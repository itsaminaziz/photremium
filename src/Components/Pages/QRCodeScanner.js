import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../SEO/SEO';
import FAQ from '../FAQ/FAQ';
import { useLanguage } from '../../context/LanguageContext';
import './ImageCompressor.css';
import './QRCodeScanner.css';

/* ================================================================
   HELPERS
   ================================================================ */

/** Load jsQR from CDN once */
const loadJsQR = (() => {
  let promise = null;
  return () => {
    if (promise) return promise;
    promise = new Promise((resolve, reject) => {
      if (window.jsQR) { resolve(window.jsQR); return; }
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js';
      s.onload = () => resolve(window.jsQR);
      s.onerror = () => reject(new Error('Failed to load QR scanner library'));
      document.head.appendChild(s);
    });
    return promise;
  };
})();

/** Detect if value looks like a URL */
const isURL = (str) => {
  try {
    const u = new URL(str.startsWith('http') ? str : `https://${str}`);
    return u.hostname.includes('.');
  } catch { return false; }
};

/** Detect content type for display */
const detectType = (data) => {
  if (!data) return { type: 'text', label: 'typeText' };
  const lower = data.toLowerCase();
  if (lower.startsWith('http://') || lower.startsWith('https://')) return { type: 'url', label: 'typeUrl' };
  if (lower.startsWith('wifi:')) return { type: 'wifi', label: 'typeWifi' };
  if (lower.startsWith('begin:vcard')) return { type: 'vcard', label: 'typeContact' };
  if (lower.startsWith('mailto:')) return { type: 'email', label: 'typeEmail' };
  if (lower.startsWith('tel:')) return { type: 'phone', label: 'typePhone' };
  if (lower.startsWith('sms:')) return { type: 'sms', label: 'typeSms' };
  if (lower.startsWith('geo:')) return { type: 'geo', label: 'typeLocation' };
  if (isURL(data)) return { type: 'url', label: 'typeUrl' };
  return { type: 'text', label: 'typeText' };
};

/** Parse WiFi string: WIFI:T:WPA;S:MySSID;P:MyPass;; */
const parseWifi = (data) => {
  const get = (key) => { const m = data.match(new RegExp(`${key}:([^;]*)`)); return m ? m[1] : ''; };
  return { ssid: get('S'), password: get('P'), encryption: get('T'), hidden: get('H') === 'true' };
};

/* ================================================================
   QR CODE SCANNER PAGE
   ================================================================ */
const QRCodeScanner = () => {
  const { t, localePath, lang } = useLanguage();
  const isBlogRtl = lang === 'ur' || lang === 'ar';
  const blog = t('qrScanner.blog');
  const blogSections = useMemo(() => (Array.isArray(blog?.sections) ? blog.sections : []), [blog]);
  const blogFaqId = 'qrscan-blog-faq';
  const blogContentSections = useMemo(
    () => blogSections.filter((section) => !Array.isArray(section.faqs)),
    [blogSections]
  );
  const [activeBlogId, setActiveBlogId] = useState(blogContentSections[0]?.id || blogContentSections[0]?.title || '');
  const blogToc = useMemo(
    () => [
      ...blogContentSections.map((section) => ({ id: section.id || section.title, label: section.title })),
      { id: blogFaqId, label: t('faq.heading') },
    ],
    [blogContentSections, t]
  );
  /* ---------- state ---------- */
  const [showCamera, setShowCamera] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [result, setResult] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [copied, setCopied] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [jsQRLoaded, setJsQRLoaded] = useState(false);
  const [facingMode, setFacingMode] = useState('environment');
  const [torchSupported, setTorchSupported] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [screenLightOn, setScreenLightOn] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const animRef = useRef(null);
  const fileInputRef = useRef(null);
  const autoStartHandledRef = useRef(false);

  const refreshTorchSupport = useCallback((stream) => {
    const videoTrack = stream?.getVideoTracks?.()[0];
    if (!videoTrack) {
      setTorchSupported(false);
      setTorchOn(false);
      return;
    }
    const capabilities = videoTrack.getCapabilities?.();
    const supported = Boolean(capabilities?.torch);
    setTorchSupported(supported);
    setTorchOn(false);
  }, []);

  /* ---------- load jsQR on mount ---------- */
  useEffect(() => {
    loadJsQR().then(() => setJsQRLoaded(true)).catch(() => {});
  }, []);

  /* ---------- lock body scroll when camera or result popup is open ---------- */
  useEffect(() => {
    if (showCamera || showPopup) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [showCamera, showPopup]);

  /* ---------- stop camera ---------- */
  const stopCamera = useCallback(() => {
    if (animRef.current) { cancelAnimationFrame(animRef.current); animRef.current = null; }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setScanning(false);
    setShowCamera(false);
    setTorchOn(false);
    setTorchSupported(false);
    setScreenLightOn(false);
  }, []);

  /* cleanup on unmount */
  useEffect(() => () => stopCamera(), [stopCamera]);

  /* ---------- handle found QR ---------- */
  const handleResult = useCallback((data) => {
    stopCamera();
    const info = detectType(data);
    setResult({ data, ...info });
    setShowPopup(true);
  }, [stopCamera]);

  /* ---------- scan frame from video ---------- */
  const scanFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !window.jsQR) return;
    const video = videoRef.current;
    if (video.readyState !== video.HAVE_ENOUGH_DATA) {
      animRef.current = requestAnimationFrame(scanFrame);
      return;
    }
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = window.jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: 'attemptBoth' });
    if (code && code.data) {
      handleResult(code.data);
      return;
    }
    animRef.current = requestAnimationFrame(scanFrame);
  }, [handleResult]);

  /* ---------- attach stream to video element ---------- */
  const attachStream = useCallback(async (stream) => {
    /* Wait a tick for React to mount the video element */
    await new Promise((r) => setTimeout(r, 50));
    const video = videoRef.current;
    if (!video) return;
    video.srcObject = stream;
    video.setAttribute('playsinline', 'true');
    try {
      await video.play();
      setScanning(true);
      animRef.current = requestAnimationFrame(scanFrame);
    } catch {
      setCameraError(t('qrScanner.videoError'));
    }
  }, [scanFrame]);

  /* ---------- start camera ---------- */
  const startCamera = useCallback(async () => {
    setCameraError('');
    setShowCamera(true);
    try {
      await loadJsQR();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      refreshTorchSupport(stream);
      await attachStream(stream);
    } catch (err) {
      if (err.name === 'NotAllowedError') {
        setCameraError(t('qrScanner.cameraDenied'));
      } else if (err.name === 'NotFoundError') {
        setCameraError(t('qrScanner.noCamera'));
      } else {
        setCameraError(t('qrScanner.cameraError'));
      }
    }
  }, [facingMode, attachStream, refreshTorchSupport]);

  /* ---------- switch camera ---------- */
  const switchCamera = useCallback(async () => {
    /* Stop current stream */
    if (animRef.current) { cancelAnimationFrame(animRef.current); animRef.current = null; }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setScanning(false);
    setTorchOn(false);
    setTorchSupported(false);
    setScreenLightOn(false);
    const newMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(newMode);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: newMode, width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      refreshTorchSupport(stream);
      await attachStream(stream);
    } catch {
      setCameraError(t('qrScanner.switchError'));
    }
  }, [facingMode, attachStream, refreshTorchSupport]);

  const toggleTorch = useCallback(async () => {
    const videoTrack = streamRef.current?.getVideoTracks?.()[0];
    if (torchSupported && videoTrack && videoTrack.applyConstraints) {
      const nextState = !torchOn;
      try {
        await videoTrack.applyConstraints({ advanced: [{ torch: nextState }] });
        setTorchOn(nextState);
        setScreenLightOn(false);
      } catch {
        setTorchOn(false);
      }
      return;
    }

    setScreenLightOn((prev) => !prev);
    setTorchOn(false);
  }, [torchSupported, torchOn]);

  /* ---------- scan image file ---------- */
  const scanImage = useCallback(async (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    try {
      const jsQR = await loadJsQR();
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: 'attemptBoth' });
        URL.revokeObjectURL(url);
        if (code && code.data) {
          handleResult(code.data);
        } else {
          setResult({ data: null, type: 'error', label: 'noQrFound' });
          setShowPopup(true);
        }
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        setResult({ data: null, type: 'error', label: 'couldNotRead' });
        setShowPopup(true);
      };
      img.src = url;
    } catch {
      setResult({ data: null, type: 'error', label: 'scannerFailed' });
      setShowPopup(true);
    }
  }, [handleResult]);

  /* ---------- file input / drop ---------- */
  const handleFiles = useCallback((files) => {
    const file = Array.from(files).find((f) => f.type.startsWith('image/'));
    if (file) { stopCamera(); scanImage(file); }
  }, [stopCamera, scanImage]);

  /* ---------- Ctrl+V paste support ---------- */
  useEffect(() => {
    const handlePaste = (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          e.preventDefault();
          const file = item.getAsFile();
          if (file) { stopCamera(); scanImage(file); }
          return;
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [stopCamera, scanImage]);

  /* --- hide footer when camera or result active --- */
  useEffect(() => {
    if (showCamera || result) {
      document.body.classList.add('qrs-workspace-active');
    } else {
      document.body.classList.remove('qrs-workspace-active');
    }
    return () => document.body.classList.remove('qrs-workspace-active');
  }, [showCamera, result]);

  const onDrop = (e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); };

  useEffect(() => {
    if (autoStartHandledRef.current) return;
    const query = new URLSearchParams(window.location.search);
    if (query.get('autostart') !== '1') return;
    autoStartHandledRef.current = true;
    startCamera();
  }, [startCamera]);

  /* ---------- copy to clipboard ---------- */
  const copyToClipboard = async () => {
    if (!result?.data) return;
    try {
      await navigator.clipboard.writeText(result.data);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* fallback */ }
  };

  /* ---------- share ---------- */
  const shareResult = async () => {
    if (!result?.data) return;
    if (navigator.share) {
      try { await navigator.share({ text: result.data }); } catch { /* user cancelled */ }
    } else {
      copyToClipboard();
    }
  };

  /* ---------- open URL ---------- */
  const openURL = () => {
    if (!result?.data) return;
    const url = result.data.startsWith('http') ? result.data : `https://${result.data}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  /* ---------- close popup & reset ---------- */
  const closePopup = () => {
    setShowPopup(false);
    setResult(null);
    setCopied(false);
  };

  /* ---------- scan again ---------- */
  const scanAgain = () => {
    closePopup();
  };

  const handleBlogTocClick = useCallback((e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (!element) return;
    const top = element.getBoundingClientRect().top + window.pageYOffset - 110;
    window.scrollTo({ top, behavior: 'smooth' });
    setActiveBlogId(id);
  }, []);

  /* ---------- render WiFi details ---------- */
  const renderWifiDetails = (data) => {
    const wifi = parseWifi(data);
    return (
      <div className="qrscan-wifi-details">
        <div className="qrscan-wifi-row">
          <span className="qrscan-wifi-label"><i className="fa-solid fa-wifi"></i> {t('qrScanner.network')}</span>
          <span className="qrscan-wifi-value">{wifi.ssid || t('qrScanner.unknown')}</span>
        </div>
        {wifi.password && (
          <div className="qrscan-wifi-row">
            <span className="qrscan-wifi-label"><i className="fa-solid fa-key"></i> {t('qrScanner.password')}</span>
            <span className="qrscan-wifi-value">{wifi.password}</span>
          </div>
        )}
        <div className="qrscan-wifi-row">
          <span className="qrscan-wifi-label"><i className="fa-solid fa-shield-halved"></i> {t('qrScanner.security')}</span>
          <span className="qrscan-wifi-value">{wifi.encryption || 'None'}</span>
        </div>
      </div>
    );
  };

  useEffect(() => {
    const newActive = blogContentSections[0]?.id || blogContentSections[0]?.title || '';
    setActiveBlogId(newActive);
  }, [blogContentSections]);

  useEffect(() => {
    if (!blogToc.length) return;
    const observers = [];
    blogToc.forEach((item) => {
      const element = document.getElementById(item.id);
      if (!element) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveBlogId(item.id);
          }
        },
        { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
      );
      observer.observe(element);
      observers.push(observer);
    });

    return () => observers.forEach((observer) => observer.disconnect());
  }, [blogToc]);

  /* ================================================================
     RENDER
     ================================================================ */
  return (
    <>
      <SEO
        title={t('qrScanner.seo.title')}
        description={t('qrScanner.seo.desc')}
        keywords={t('qrScanner.seo.keywords')}
      />

      <section className="qrscan-page">
        <div className="qrscan-inner">
          {/* Header */}
          <div className="qrscan-header">
            <h1 className="qrscan-title">{t('qrScanner.title')}</h1>
            <p className="qrscan-desc">
              {t('qrScanner.desc')}
            </p>
            <div className="qrscan-nav-pills">
              <Link to={localePath('/qr-code-generator')} className="qrscan-pill">
                <i className="fa-solid fa-qrcode"></i> {t('qrScanner.generateQrCode')}
              </Link>
              <span className="qrscan-pill qrscan-pill--active">
                <i className="fa-solid fa-expand"></i> {t('qrScanner.scan')}
              </span>
            </div>
          </div>

          {/* Scanner Boxes */}
          <div className="qrscan-boxes">
            {/* Camera Box */}
            <div className="qrscan-box qrscan-box--camera">
              <div className="qrscan-box__header">
                <i className="fa-solid fa-video"></i>
                <span>{t('qrScanner.cameraScanner')}</span>
              </div>

              <div className="qrscan-camera-area">
                <div className="qrscan-camera-placeholder">
                  <div className="qrscan-camera-icon">
                    <i className="fa-solid fa-camera"></i>
                  </div>
                  <p>{t('qrScanner.pointCamera')}</p>
                  <button className="qrscan-start-btn" onClick={startCamera} disabled={!jsQRLoaded}>
                    <i className="fa-solid fa-play"></i>
                    {jsQRLoaded ? t('qrScanner.startCamera') : t('qrScanner.loading')}
                  </button>
                </div>
              </div>
              <canvas ref={canvasRef} hidden />
            </div>

            {/* Upload Box */}
            <div
              className={`qrscan-box qrscan-box--upload ${dragOver ? 'qrscan-box--drag' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
            >
              <div className="qrscan-box__header">
                <i className="fa-solid fa-image"></i>
                <span>{t('qrScanner.uploadImage')}</span>
              </div>

              <div className="qrscan-upload-area">
                <div className="qrscan-upload-icon">
                  <i className="fa-solid fa-cloud-arrow-up"></i>
                </div>
                <h3>{t('qrScanner.dropQrImage')}</h3>
                <p>{t('common.or')} <span className="qrscan-browse" onClick={() => fileInputRef.current?.click()}>{t('common.browseFiles')}</span> {t('qrScanner.toScan')}</p>
                <p className="qrscan-upload-hint">{t('qrScanner.supportedFormats')} &bull; {t('qrScanner.ctrlVPaste')}</p>
                <div className="qrscan-upload-actions">
                  <button className="qrscan-gallery-btn" onClick={() => fileInputRef.current?.click()}>
                    <i className="fa-solid fa-images"></i> {t('qrScanner.scanFromGallery')}
                  </button>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => { handleFiles(e.target.files); e.target.value = ''; }}
              />
            </div>
          </div>

          {blogSections.length ? (
            <div className="qrscan-blog-host">
              <nav className={`comp-blog-toc--mobile ${isBlogRtl ? 'comp-blog-toc--mobile--rtl' : ''}`} aria-label="QR scanner blog sections">
                {blogToc.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={activeBlogId === item.id ? 'toc-active' : ''}
                    onClick={(e) => handleBlogTocClick(e, item.id)}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>

              <div className={`comp-blog-layout ${isBlogRtl ? 'comp-blog-layout--rtl' : ''}`}>
                <aside className="comp-blog-toc" aria-label="QR scanner blog TOC">
                  <p className="comp-blog-toc__title">{blog.tocTitle || 'Contents'}</p>
                  <ul className="comp-blog-toc__list">
                    {blogToc.map((item) => (
                      <li key={item.id}>
                        <a
                          href={`#${item.id}`}
                          className={activeBlogId === item.id ? 'toc-active' : ''}
                          onClick={(e) => handleBlogTocClick(e, item.id)}
                        >
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </aside>

                <section className="comp-blog">
                  {blogContentSections.map((section) => (
                    <article className="comp-blog__card" id={section.id || section.title} key={section.id || section.title}>
                      <h2>{section.title}</h2>

                      {Array.isArray(section.paragraphs)
                        ? section.paragraphs.map((paragraph, idx) => <p key={`p-${idx}`}>{paragraph}</p>)
                        : null}

                      {section.listTitle ? <h3>{section.listTitle}</h3> : null}

                      {Array.isArray(section.bullets) ? (
                        <ul className="comp-blog__list">
                          {section.bullets.map((bullet, idx) => (
                            <li key={`b-${idx}`}>{bullet}</li>
                          ))}
                        </ul>
                      ) : null}

                      {Array.isArray(section.steps) ? (
                        <div className="comp-blog__steps">
                          {section.steps.map((step, idx) => (
                            <div className="comp-blog__step" key={`step-${idx}`}>
                              <div className="comp-blog__step-title">{step.heading}</div>
                              {Array.isArray(step.paragraphs)
                                ? step.paragraphs.map((paragraph, pIdx) => <p key={`sp-${pIdx}`}>{paragraph}</p>)
                                : null}
                              {Array.isArray(step.bullets) ? (
                                <ul className="comp-blog__list comp-blog__list--nested">
                                  {step.bullets.map((bullet, bIdx) => (
                                    <li key={`sb-${bIdx}`}>{bullet}</li>
                                  ))}
                                </ul>
                              ) : null}
                              {Array.isArray(step.notes)
                                ? step.notes.map((note, nIdx) => {
                                  const isNoteLabel = typeof note === 'string' && note.trim().startsWith('➔');
                                  return (
                                    <p key={`note-${nIdx}`}>
                                      {isNoteLabel ? <strong>{note}</strong> : note}
                                    </p>
                                  );
                                })
                                : null}

                              {Array.isArray(step.subSteps) ? (
                                <div className="comp-blog__substeps">
                                  {step.subSteps.map((subStep, sIdx) => (
                                    <div className="comp-blog__step comp-blog__step--sub" key={`sub-${sIdx}`}>
                                      <div className="comp-blog__step-title">{subStep.heading}</div>

                                      {Array.isArray(subStep.paragraphs)
                                        ? subStep.paragraphs.map((paragraph, pIdx) => <p key={`sub-p-${pIdx}`}>{paragraph}</p>)
                                        : null}

                                      {Array.isArray(subStep.bullets) ? (
                                        <ul className="comp-blog__list comp-blog__list--nested">
                                          {subStep.bullets.map((bullet, bIdx) => (
                                            <li key={`sub-b-${bIdx}`}>{bullet}</li>
                                          ))}
                                        </ul>
                                      ) : null}

                                      {Array.isArray(subStep.notes)
                                        ? subStep.notes.map((note, nIdx) => {
                                          const isNoteLabel = typeof note === 'string' && note.trim().startsWith('➔');
                                          return (
                                            <p key={`sub-note-${nIdx}`}>
                                              {isNoteLabel ? <strong>{note}</strong> : note}
                                            </p>
                                          );
                                        })
                                        : null}
                                    </div>
                                  ))}
                                </div>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </article>
                  ))}

                  <section className="comp-blog__faq-section" id={blogFaqId}>
                    <FAQ faqKey="qrCodeScanner" />
                  </section>
                </section>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* ==================== CAMERA POPUP ==================== */}
      {showCamera && (
        <div className={`qrscan-cam-overlay ${screenLightOn ? 'qrscan-cam-overlay--screenlight' : ''}`}>
          <div className={`qrscan-cam-popup ${screenLightOn ? 'qrscan-cam-popup--screenlight' : ''}`}>
            <div className="qrscan-cam-popup__header">
              <span><i className="fa-solid fa-video"></i> {t('qrScanner.cameraScanner')}</span>
              <button className="qrscan-cam-popup__close" onClick={stopCamera}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className={`qrscan-cam-popup__body ${screenLightOn ? 'qrscan-cam-popup__body--screenlight' : ''}`}>
              {cameraError ? (
                <div className="qrscan-camera-placeholder qrscan-camera-placeholder--error">
                  <div className="qrscan-camera-icon qrscan-camera-icon--error">
                    <i className="fa-solid fa-triangle-exclamation"></i>
                  </div>
                  <p className="qrscan-error-text">{cameraError}</p>
                  <button className="qrscan-start-btn" onClick={() => { setCameraError(''); startCamera(); }}>
                    <i className="fa-solid fa-rotate-right"></i> {t('qrScanner.tryAgain')}
                  </button>
                </div>
              ) : !scanning ? (
                <div className="qrscan-camera-placeholder">
                  <div className="qrscan-cam-loader"></div>
                  <p>{t('qrScanner.accessingCamera')}</p>
                </div>
              ) : null}

              {/* Video always mounted so ref is available */}
              <div className="qrscan-video-wrapper" style={{ display: scanning ? 'flex' : 'none' }}>
                <video ref={videoRef} className="qrscan-video" muted playsInline />
                <div className="qrscan-scan-overlay">
                  <div className="qrscan-scan-frame">
                    <span className="qrscan-corner qrscan-corner--tl"></span>
                    <span className="qrscan-corner qrscan-corner--tr"></span>
                    <span className="qrscan-corner qrscan-corner--bl"></span>
                    <span className="qrscan-corner qrscan-corner--br"></span>
                    <div className="qrscan-scan-line"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Controls outside body so they never get clipped */}
            {scanning && (
              <div className="qrscan-cam-popup__controls">
                <button
                  className={`qrscan-ctrl-btn ${(torchOn || screenLightOn) ? 'qrscan-ctrl-btn--active' : ''}`}
                  onClick={toggleTorch}
                  title={torchSupported ? (torchOn ? 'Turn Flashlight Off' : 'Turn Flashlight On') : (screenLightOn ? 'Turn Screen Light Off' : 'Turn Screen Light On')}
                  aria-label={torchSupported ? (torchOn ? 'Turn Flashlight Off' : 'Turn Flashlight On') : (screenLightOn ? 'Turn Screen Light Off' : 'Turn Screen Light On')}
                >
                  <i className="fa-solid fa-lightbulb"></i>
                </button>
                <button className="qrscan-ctrl-btn" onClick={switchCamera} title={t('qrScanner.switchCamera')}>
                  <i className="fa-solid fa-camera-rotate"></i>
                </button>
                <button className="qrscan-ctrl-btn qrscan-ctrl-btn--stop" onClick={stopCamera} title={t('qrScanner.stop')}>
                  <i className="fa-solid fa-stop"></i>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================== RESULT POPUP ==================== */}
      {showPopup && (
        <div className="qrscan-popup-overlay" onClick={closePopup}>
          <div className="qrscan-popup" onClick={(e) => e.stopPropagation()}>
            <button className="qrscan-popup__close" onClick={closePopup}>
              <i className="fa-solid fa-xmark"></i>
            </button>

            {result?.type === 'error' ? (
              /* Error state */
              <div className="qrscan-popup__body qrscan-popup__body--error">
                <div className="qrscan-popup__icon qrscan-popup__icon--error">
                  <i className="fa-solid fa-circle-xmark"></i>
                </div>
                <h3>{t('qrScanner.' + result.label)}</h3>
                <p>{t('qrScanner.noQrFoundDesc')}</p>
                <button className="qrscan-popup__action" onClick={scanAgain}>
                  <i className="fa-solid fa-rotate-right"></i> {t('qrScanner.tryAgain')}
                </button>
              </div>
            ) : (
              /* Success state */
              <div className="qrscan-popup__body">
                <div className={`qrscan-popup__icon qrscan-popup__icon--${result?.type}`}>
                  <i className={
                    result?.type === 'url' ? 'fa-solid fa-link' :
                    result?.type === 'wifi' ? 'fa-solid fa-wifi' :
                    result?.type === 'vcard' ? 'fa-solid fa-address-book' :
                    result?.type === 'email' ? 'fa-solid fa-envelope' :
                    result?.type === 'phone' ? 'fa-solid fa-phone' :
                    result?.type === 'sms' ? 'fa-solid fa-comment-sms' :
                    result?.type === 'geo' ? 'fa-solid fa-location-dot' :
                    'fa-solid fa-font'
                  }></i>
                </div>

                <span className="qrscan-popup__badge">{t('qrScanner.' + result?.label)}</span>
                <h3>{t('qrScanner.qrScanned')}</h3>

                {/* Content */}
                {result?.type === 'wifi' ? (
                  renderWifiDetails(result.data)
                ) : (
                  <div className="qrscan-popup__data">
                    <code>{result?.data}</code>
                  </div>
                )}

                {/* Actions */}
                <div className="qrscan-popup__actions">
                  {result?.type === 'url' && (
                    <button className="qrscan-popup__action qrscan-popup__action--primary" onClick={openURL}>
                      <i className="fa-solid fa-arrow-up-right-from-square"></i> {t('qrScanner.openLink')}
                    </button>
                  )}
                  <button className={`qrscan-popup__action ${copied ? 'qrscan-popup__action--copied' : ''}`} onClick={copyToClipboard}>
                    <i className={copied ? 'fa-solid fa-check' : 'fa-regular fa-copy'}></i>
                    {copied ? t('qrScanner.copied') : t('qrScanner.copy')}
                  </button>
                  <button className="qrscan-popup__action" onClick={shareResult}>
                    <i className="fa-solid fa-share-nodes"></i> {t('qrScanner.share')}
                  </button>
                  <button className="qrscan-popup__action" onClick={scanAgain}>
                    <i className="fa-solid fa-rotate-right"></i> {t('qrScanner.scanAgain')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </>
  );
};

export default QRCodeScanner;
