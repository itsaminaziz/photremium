import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import SEO from '../SEO/SEO';
import FAQ from '../FAQ/FAQ';
import ToolBlogSection from '../ToolBlog/ToolBlogSection';
import { useLanguage } from '../../context/LanguageContext';
import './ImageCompressor.css';

/* ---- helpers ---- */
const fmtSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const compressImage = (file, qualityRatio) =>
  new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      /* Always export as JPEG for real compression; PNG toBlob ignores quality */
      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url);
          resolve(blob);
        },
        'image/jpeg',
        qualityRatio
      );
    };
    img.src = url;
  });

const getCompressionQualityMeta = (compression) => {
  if (compression <= 40) {
    return {
      key: 'good',
      text: 'Good quality',
      icon: 'fa-solid fa-circle-check',
      sliderClass: 'comp-slider--good',
    };
  }

  if (compression <= 60) {
    return {
      key: 'normal',
      text: 'Normal quality (recommended)',
      icon: 'fa-solid fa-circle-exclamation',
      sliderClass: 'comp-slider--normal',
    };
  }

  return {
    key: 'bad',
    text: 'Bad quality',
    icon: 'fa-solid fa-triangle-exclamation',
    sliderClass: 'comp-slider--danger',
  };
};

/* ============================================= */
/*            IMAGE COMPRESSOR PAGE              */
/* ============================================= */
const ImageCompressor = () => {
  const { t } = useLanguage();
  const location = useLocation();
  /*
   * "compression" = how much smaller the file should become.
   *  30 means "reduce by 30%" → canvas quality = 0.70
   */
  const [images, setImages] = useState([]);
  const [globalCompression, setGlobalCompression] = useState(30);
  const [downloadMode, setDownloadMode] = useState('zip');
  const [dragOver, setDragOver] = useState(false);
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false);
  const fileInputRef = useRef(null);
  const addFileInputRef = useRef(null);
  const didPrefillFromStateRef = useRef(false);

  /* --- warn before reload when images exist --- */
  useEffect(() => {
    const handler = (e) => {
      if (images.length > 0) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [images.length]);

  /* --- add files --- */
  const addFiles = useCallback(
    (files) => {
      const validFiles = Array.from(files).filter((f) => f.type.startsWith('image/'));
      if (!validFiles.length) return;
      const newImages = validFiles.map((file) => ({
        id: crypto.randomUUID(),
        file,
        preview: URL.createObjectURL(file),
        compression: globalCompression,
        compressedBlob: null,
        compressedSize: null,
      }));
      setImages((prev) => [...prev, ...newImages]);
    },
    [globalCompression]
  );

  /* --- prefill from Home paste popup --- */
  useEffect(() => {
    if (didPrefillFromStateRef.current) return;
    const incoming = location.state?.pastedImages;
    if (!Array.isArray(incoming) || incoming.length === 0) return;
    didPrefillFromStateRef.current = true;
    addFiles(incoming);
  }, [location.state, addFiles]);

  /* --- Ctrl+V paste --- */
  useEffect(() => {
    const handler = (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      const files = [];
      for (const item of items) {
        if (item.kind === 'file' && item.type.startsWith('image/')) {
          files.push(item.getAsFile());
        }
      }
      if (files.length) {
        e.preventDefault();
        addFiles(files);
      }
    };
    document.addEventListener('paste', handler);
    return () => document.removeEventListener('paste', handler);
  }, [addFiles]);

  /* --- compression engine ---
   * Only processes images where compressedBlob === null.
   * Dependency string only includes unprocessed items so
   * completed compressions don't re-trigger the effect.
   */
  const unprocessedKey = images
    .filter((i) => !i.compressedBlob)
    .map((i) => `${i.id}:${i.compression}`)
    .join(',');

  useEffect(() => {
    const pending = images.filter((img) => img.compressedBlob === null);
    if (!pending.length) return;

    let cancelled = false;

    Promise.all(
      pending.map(async (img) => {
        const qualityRatio = (100 - img.compression) / 100;
        const blob = await compressImage(img.file, qualityRatio);
        return { id: img.id, blob, blobSize: blob.size, origSize: img.file.size, origFile: img.file };
      })
    ).then((results) => {
      if (cancelled) return;
      setImages((prev) =>
        prev.map((img) => {
          const r = results.find((x) => x.id === img.id);
          if (!r) return img;
          /* NEVER allow compressed > original */
          const isBigger = r.blobSize >= r.origSize;
          return {
            ...img,
            compressedBlob: isBigger ? r.origFile.slice(0, r.origFile.size, r.origFile.type) : r.blob,
            compressedSize: isBigger ? r.origSize : r.blobSize,
          };
        })
      );
    });

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unprocessedKey]);

  /* --- hide footer when editing --- */
  useEffect(() => {
    if (images.length > 0) {
      document.body.classList.add('comp-workspace-active');
    } else {
      document.body.classList.remove('comp-workspace-active');
    }
    return () => document.body.classList.remove('comp-workspace-active');
  }, [images.length]);

  /* --- global compression change (visual only while dragging) --- */
  const handleGlobalCompressionDrag = (val) => {
    const c = parseFloat(val);
    setGlobalCompression(c);
    // Update displayed value only — no recompression yet
    setImages((prev) =>
      prev.map((img) => ({ ...img, compression: c }))
    );
  };

  /* --- global compression commit (triggers compression on release) --- */
  const handleGlobalCompressionCommit = (e) => {
    const c = Math.round(parseFloat(e.target.value));
    setGlobalCompression(c);
    setImages((prev) =>
      prev.map((img) => ({ ...img, compression: c, compressedBlob: null, compressedSize: null }))
    );
  };

  /* --- individual compression drag (visual only) --- */
  const handleCompressionDrag = (id, val) => {
    const c = parseFloat(val);
    setImages((prev) =>
      prev.map((img) =>
        img.id === id ? { ...img, compression: c } : img
      )
    );
  };

  /* --- individual compression commit (triggers compression on release) --- */
  const handleCompressionCommit = (id, val) => {
    const c = Math.round(parseFloat(val));
    setImages((prev) =>
      prev.map((img) =>
        img.id === id ? { ...img, compression: c, compressedBlob: null, compressedSize: null } : img
      )
    );
  };

  /* --- remove image --- */
  const removeImage = (id) => {
    setImages((prev) => {
      const img = prev.find((i) => i.id === id);
      if (img) URL.revokeObjectURL(img.preview);
      return prev.filter((i) => i.id !== id);
    });
  };

  /* --- download single --- */
  const downloadSingle = (img) => {
    if (!img.compressedBlob) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(img.compressedBlob);
    const ext = img.file.name.replace(/\.[^.]+$/, '');
    a.download = `compressed-${ext}.jpg`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  /* --- download all --- */
  const downloadAll = async () => {
    const ready = images.filter((i) => i.compressedBlob);
    if (!ready.length) return;

    const effectiveMode = ready.length === 1 ? 'separate' : downloadMode;

    if (effectiveMode === 'separate') {
      if (ready.length >= 10) {
        const useZip = window.confirm(
          `Downloading ${ready.length} files separately may be blocked by your browser.\n\nWould you like to download as a single ZIP file instead?`
        );
        if (useZip) {
          await downloadAsZip(ready);
          return;
        }
      }
      /* Sequential downloads with delay to avoid browser blocking */
      for (let i = 0; i < ready.length; i++) {
        downloadSingle(ready[i]);
        if (i < ready.length - 1) await new Promise((r) => setTimeout(r, 400));
      }
      return;
    }

    await downloadAsZip(ready);
  };

  const downloadAsZip = async (ready) => {
    if (!window.JSZip) {
      const s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
      document.head.appendChild(s);
      await new Promise((r) => (s.onload = r));
    }
    const zip = new window.JSZip();
    ready.forEach((img) => {
      const ext = img.file.name.replace(/\.[^.]+$/, '');
      zip.file(`compressed-${ext}.jpg`, img.compressedBlob);
    });
    const content = await zip.generateAsync({ type: 'blob' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(content);
    a.download = 'compressed-images.zip';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  /* --- start over with confirmation --- */
  const handleStartOver = () => {
    const confirmed = window.confirm(t('common.startOverConfirm'));
    if (!confirmed) return;
    images.forEach((i) => URL.revokeObjectURL(i.preview));
    setImages([]);
  };

  /* --- drag & drop --- */
  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  };

  /* --- computed --- */
  const totalOriginal = images.reduce((s, i) => s + i.file.size, 0);
  const totalCompressed = images.reduce((s, i) => s + (i.compressedSize ?? i.file.size), 0);
  const allCompressed = images.length > 0 && images.every((i) => i.compressedBlob);
  const globalQualityMeta = getCompressionQualityMeta(globalCompression);
  const savedPercent =
    totalOriginal > 0 ? Math.max(0, Math.round(((totalOriginal - totalCompressed) / totalOriginal) * 100)) : 0;

  /* =========================== UPLOAD VIEW =========================== */
  if (!images.length) {
    return (
      <>
        <SEO
          title={t('compressor.seo.uploadTitle')}
          description={t('compressor.seo.uploadDesc')}
          keywords={t('compressor.seo.uploadKeywords')}
        />

        <section className="comp-upload">
          <div className="comp-upload__inner">
            <h1 className="comp-upload__title">{t('compressor.title')}</h1>
            <p className="comp-upload__desc">
              {t('compressor.desc')}
            </p>

            <div
              className={`comp-dropzone ${dragOver ? 'comp-dropzone--active' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
            >
              <div className="comp-dropzone__cloud">
                <i className="fa-solid fa-cloud-arrow-up"></i>
              </div>
              <h3>{t('common.dropHere')}</h3>
              <p>{t('common.or')} <span className="comp-dropzone__browse" onClick={() => fileInputRef.current?.click()}>{t('common.browseFiles')}</span> {t('compressor.toCompress')}</p>
              <p className="comp-dropzone__hint">
                <i className="fa-regular fa-keyboard"></i> {t('common.pasteHint')} <kbd>Ctrl</kbd> + <kbd>V</kbd>
              </p>
              <button className="comp-dropzone__btn" onClick={() => fileInputRef.current?.click()}>
                <i className="fa-solid fa-folder-open"></i> {t('common.chooseFiles')}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={(e) => addFiles(e.target.files)}
              />
            </div>
          </div>
        </section>

        <ToolBlogSection toolKey="imageCompressor" />
        <FAQ faqKey="imageCompressor" />
      </>
    );
  }

  /* =========================== WORKSPACE VIEW =========================== */
  return (
    <>
      <SEO
        title={t('compressor.seo.workspaceTitle')}
        description={t('compressor.seo.workspaceDesc')}
        keywords={t('compressor.seo.workspaceKeywords')}
      />

      <section className="comp-workspace">
        {/* ---------- MOBILE SETTINGS TOGGLE ---------- */}
        <button
          className="comp-settings-toggle"
          onClick={() => setMobileToolsOpen((prev) => !prev)}
          aria-label={t('common.toggleToolsPanel') || 'Toggle tools panel'}
        >
          <i className={mobileToolsOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-gear'}></i>
        </button>

        {/* Mobile overlay */}
        {mobileToolsOpen && (
          <div className="comp-overlay" onClick={() => setMobileToolsOpen(false)} />
        )}

        {/* ---------- LEFT PANEL ---------- */}
        <div className="comp-left">
          {/* Global slider */}
          <div className="comp-global-bar">
            <div className="comp-global-bar__label">
              <span><i className="fa-solid fa-sliders"></i> {t('compressor.compressionForAll')}</span>
              <strong>{Math.round(globalCompression)}%</strong>
            </div>
            <input
              type="range"
              min="1"
              max="99"
              step="0.1"
              value={globalCompression}
              onChange={(e) => handleGlobalCompressionDrag(e.target.value)}
              onMouseUp={(e) => handleGlobalCompressionCommit(e)}
              onTouchEnd={(e) => handleGlobalCompressionCommit(e)}
              className={`comp-slider comp-slider--global ${globalQualityMeta.sliderClass}`}
            />

            <div className={`comp-global-bar__warning comp-global-bar__warning--${globalQualityMeta.key}`}>
              <i className={globalQualityMeta.icon}></i> {globalQualityMeta.text}
            </div>
          </div>

          {/* Image cards */}
          <div className="comp-cards">
            {images.map((img) => {
              const actualSaved = img.compressedSize !== null
                ? Math.max(0, Math.round(((img.file.size - img.compressedSize) / img.file.size) * 100))
                : null;
              const itemQualityMeta = getCompressionQualityMeta(img.compression);

              return (
                <div className="comp-card" key={img.id}>
                  <button className="comp-card__remove" title={t('common.remove')} onClick={() => removeImage(img.id)}>
                    <i className="fa-solid fa-xmark"></i>
                  </button>

                  <div className="comp-card__preview">
                    <img src={img.preview} alt={img.file.name} />
                  </div>

                  <div className="comp-card__body">
                    <div className="comp-card__info">
                      <span className="comp-card__name" title={img.file.name}>
                        <i className="fa-regular fa-image"></i> {img.file.name}
                      </span>
                      <div className="comp-card__meta">
                        <span><i className="fa-solid fa-file"></i> {img.file.type.split('/')[1].toUpperCase()}</span>
                        <span><i className="fa-solid fa-weight-hanging"></i> {fmtSize(img.file.size)}</span>
                        {img.compressedSize !== null && (
                          <span className="comp-card__meta--result">
                            <i className="fa-solid fa-arrow-right"></i> {fmtSize(img.compressedSize)}
                            <em>(-{actualSaved}%)</em>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="comp-card__slider-row">
                      <label>{t('compressor.compressionLabel')} <strong>{Math.round(img.compression)}%</strong></label>
                      <input
                        type="range"
                        min="1"
                        max="99"
                        step="0.1"
                        value={img.compression}
                        onChange={(e) => handleCompressionDrag(img.id, e.target.value)}
                        onMouseUp={(e) => handleCompressionCommit(img.id, e.target.value)}
                        onTouchEnd={(e) => handleCompressionCommit(img.id, e.target.value)}
                        className={`comp-slider ${itemQualityMeta.sliderClass}`}
                      />
                    </div>

                    <button className="comp-card__dl" onClick={() => downloadSingle(img)} disabled={!img.compressedBlob}>
                      <i className="fa-solid fa-download"></i> {t('common.download')}
                    </button>
                  </div>
                </div>
              );
            })}
            {/* +Add Image card */}
            <div className="comp-card comp-card--add" onClick={() => addFileInputRef.current?.click()} title={t('common.addMoreImages')}>
              <div className="comp-card__add-inner">
                <i className="fa-solid fa-plus"></i>
                <span>{t('common.addImage')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ---------- RIGHT PANEL ---------- */}
        <div className={`comp-right ${mobileToolsOpen ? 'comp-right--open' : ''}`}>
          <div className="comp-right__sticky">
            <div className="comp-right__header">
              <h3><i className="fa-solid fa-images"></i> {t('compressor.summary')}</h3>
            </div>

            <div className="comp-right__stats">
              <div className="comp-stat">
                <span className="comp-stat__label">{t('common.images')}</span>
                <span className="comp-stat__value">{images.length}</span>
              </div>
              <div className="comp-stat">
                <span className="comp-stat__label">{t('compressor.originalSize')}</span>
                <span className="comp-stat__value">{fmtSize(totalOriginal)}</span>
              </div>
              <div className="comp-stat">
                <span className="comp-stat__label">{t('compressor.compressed')}</span>
                {allCompressed ? (
                  <span className="comp-stat__value comp-stat__value--green">{fmtSize(totalCompressed)}</span>
                ) : (
                  <span className="comp-stat__value"><span className="comp-stat-pulse"></span></span>
                )}
              </div>
              <div className="comp-stat">
                <span className="comp-stat__label">{t('compressor.saved')}</span>
                {allCompressed ? (
                  <span className="comp-stat__value comp-stat__value--green">{savedPercent}%</span>
                ) : (
                  <span className="comp-stat__value"><span className="comp-stat-pulse"></span></span>
                )}
              </div>
            </div>

            <button className="comp-right__add" onClick={() => addFileInputRef.current?.click()}>
              <i className="fa-solid fa-plus"></i> {t('common.addMoreImages')}
            </button>
            <input
              ref={addFileInputRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }}
            />

            {/* Download mode */}
            {images.length > 1 && (
            <div className="comp-right__dl-mode">
              <label>{t('common.downloadAs')}</label>
              <div className="comp-dl-toggle">
                <button className={`comp-dl-toggle__btn ${downloadMode === 'zip' ? 'active' : ''}`} onClick={() => setDownloadMode('zip')}>
                  <i className="fa-solid fa-file-zipper"></i> {t('common.zip')}
                </button>
                <button className={`comp-dl-toggle__btn ${downloadMode === 'separate' ? 'active' : ''}`} onClick={() => setDownloadMode('separate')}>
                  <i className="fa-regular fa-copy"></i> {t('common.separate')}
                </button>
              </div>
            </div>
            )}

            <button className="comp-right__reset" onClick={handleStartOver}>
              <i className="fa-solid fa-arrow-rotate-left"></i> {t('common.startOver')}
            </button>

            <button className="comp-right__download" onClick={downloadAll} disabled={!allCompressed}>
              {!allCompressed ? (
                <>
                  <span className="comp-download-spinner"></span>
                  {t('compressor.compressing')}
                </>
              ) : (
                <>
                  <i className="fa-solid fa-bolt"></i> {t('compressor.compressDownload')}
                </>
              )}
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default ImageCompressor;