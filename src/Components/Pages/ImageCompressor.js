import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { doc, getDoc, onSnapshot, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import SEO from '../SEO/SEO';
import FAQ from '../FAQ/FAQ';
import MobileImportPopup from '../MobileImportPopup/MobileImportPopup';
import { LANG_CODES } from '../../i18n/languages';
import { useLanguage } from '../../context/LanguageContext';
import { db, hasFirebaseConfig } from '../../lib/firebase';
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

const MOBILE_IMPORT_COLLECTION = 'mobileImports';
const MOBILE_IMPORT_TOOL = 'image-compressor';
const MOBILE_IMPORT_MAX_FILES = 10;
const MOBILE_IMPORT_MAX_TOTAL_BYTES = 900000;

const getScannerPath = () => {
  const segments = window.location.pathname.split('/').filter(Boolean);
  const langPrefix = segments[0] && LANG_CODES.has(segments[0]) ? `/${segments[0]}` : '';
  return `${langPrefix}/qr-code-scanner?autostart=1`;
};

const mapFirebaseErrorMessage = (error, fallbackMessage) => {
  const code = error?.code || '';

  if (code === 'permission-denied') {
    return 'Firestore denied write access. Update Firestore rules to allow mobileImports create/update.';
  }

  if (code === 'failed-precondition' || code === 'unavailable') {
    return 'Cloud Firestore is not ready for this project. Enable Firestore in Firebase console and try again.';
  }

  if (code === 'unauthenticated') {
    return 'Firestore requires authentication for this action. Adjust rules or sign in first.';
  }

  if (error?.message) {
    return `${fallbackMessage} ${error.message}`;
  }

  return fallbackMessage;
};

const dataUrlToFile = (dataUrl, fileName, mimeType = 'image/jpeg') => {
  const parts = dataUrl.split(',');
  const base64 = parts[1] || '';
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let index = 0; index < len; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return new File([bytes], fileName, { type: mimeType });
};

const blobToDataUrl = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Failed to convert blob to data URL'));
    reader.readAsDataURL(blob);
  });

const fileToSharePayload = async (file) => {
  const originalUrl = URL.createObjectURL(file);

  try {
    const image = await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Image decode failed'));
      img.src = originalUrl;
    });

    const maxEdge = 1400;
    const scale = Math.min(1, maxEdge / Math.max(image.width, image.height));
    const targetWidth = Math.max(1, Math.round(image.width * scale));
    const targetHeight = Math.max(1, Math.round(image.height * scale));

    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, targetWidth, targetHeight);

    const encodeJpeg = (targetQuality) =>
      new Promise((resolve) => {
        canvas.toBlob((result) => resolve(result), 'image/jpeg', targetQuality);
      });

    let quality = 0.82;
    let blob = await encodeJpeg(quality);

    while (blob && blob.size > 250000 && quality > 0.45) {
      quality = Math.max(0.45, quality - 0.07);
      blob = await encodeJpeg(quality);
    }

    if (!blob) {
      throw new Error('Image encode failed');
    }

    const dataUrl = await blobToDataUrl(blob);

    return {
      name: file.name.replace(/\.[^.]+$/, '') + '.jpg',
      type: 'image/jpeg',
      size: blob.size,
      dataUrl,
    };
  } finally {
    URL.revokeObjectURL(originalUrl);
  }
};

/* ============================================= */
/*            IMAGE COMPRESSOR PAGE              */
/* ============================================= */
const ImageCompressor = () => {
  const { t, lang } = useLanguage();
  const isBlogRtl = lang === 'ur' || lang === 'ar';
  const blog = t('compressor.blog');
  const blogSections = useMemo(() => (Array.isArray(blog?.sections) ? blog.sections : []), [blog]);
  const blogFaqId = 'imgcomp-blog-faq';
  const blogToc = useMemo(
    () => [
      ...blogSections.map((section) => ({ id: section.id || section.title, label: section.title })),
      { id: blogFaqId, label: t('faq.heading') },
    ],
    [blogSections, blogFaqId, t]
  );
  const [activeBlogId, setActiveBlogId] = useState(blogSections[0]?.id || blogSections[0]?.title || '');
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
  const [mobileImportState, setMobileImportState] = useState('idle');
  const [mobileImportMessage, setMobileImportMessage] = useState('');
  const [mobilePendingFiles, setMobilePendingFiles] = useState([]);
  const [mobileUploadBusy, setMobileUploadBusy] = useState(false);
  const [mobileUploadProgress, setMobileUploadProgress] = useState(0);
  const [mobileUploadSuccess, setMobileUploadSuccess] = useState(false);
  const [mobileReceiverSessionActive, setMobileReceiverSessionActive] = useState(true);
  const [mobileSelectionOverflow, setMobileSelectionOverflow] = useState(null);
  const [mobilePreviewIndex, setMobilePreviewIndex] = useState(0);
  const fileInputRef = useRef(null);
  const addFileInputRef = useRef(null);
  const mobilePickerInputRef = useRef(null);
  const mobilePreviewTrackRef = useRef(null);
  const didPrefillFromStateRef = useRef(false);
  const dragDepthRef = useRef(0);

  const query = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const isMobileImportMode = query.get('mobileImport') === '1' && query.get('tool') === MOBILE_IMPORT_TOOL;
  const mobileImportSessionFromQuery = query.get('session') || '';

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

  const openQrScannerCamera = useCallback(() => {
    window.location.assign(getScannerPath());
  }, []);

  const uploadFromMobile = useCallback(async () => {
    if (!db || !mobileImportSessionFromQuery) return;

    if (!mobilePendingFiles.length) {
      setMobileImportMessage('Please select at least one image to upload.');
      return;
    }

    setMobileUploadBusy(true);
    setMobileUploadSuccess(false);
    setMobileUploadProgress(0);
    setMobileImportMessage('Preparing files...');

    try {
      const sessionRef = doc(db, MOBILE_IMPORT_COLLECTION, mobileImportSessionFromQuery);
      const sessionSnap = await getDoc(sessionRef);
      if (!sessionSnap.exists()) {
        throw new Error('This import session is no longer available.');
      }

      const sessionData = sessionSnap.data();
      if (sessionData?.expiresAt && Date.now() > sessionData.expiresAt) {
        throw new Error('This import session has expired. Please create a new one on desktop.');
      }

      const files = mobilePendingFiles.slice(0, MOBILE_IMPORT_MAX_FILES);
      const payloads = [];
      for (let index = 0; index < files.length; index += 1) {
        const file = files[index];
        setMobileImportMessage(`Preparing ${index + 1}/${files.length}...`);
        payloads.push(await fileToSharePayload(file));
        setMobileUploadProgress(Math.min(90, Math.round(((index + 1) / files.length) * 90)));
      }

      const totalBytes = payloads.reduce((sum, item) => sum + (item.size || 0), 0);
      if (totalBytes > MOBILE_IMPORT_MAX_TOTAL_BYTES) {
        throw new Error('Selected images are too large for Firestore transfer. Please choose fewer/smaller images.');
      }

      const uploadToken = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      await updateDoc(sessionRef, {
        status: 'uploaded',
        uploadedAt: serverTimestamp(),
        uploadToken,
        images: payloads,
      });

      setMobileUploadProgress(100);
      setMobileImportMessage('');
      setMobilePendingFiles([]);
      setMobileSelectionOverflow(null);
      setMobilePreviewIndex(0);
      setMobileUploadSuccess(true);

      await new Promise((resolve) => setTimeout(resolve, 1200));
      try {
        await updateDoc(sessionRef, {
          status: 'terminated',
          terminatedAt: serverTimestamp(),
          terminatedBy: 'receiver',
          errorMessage: 'Session terminated after successful send.',
        });
      } catch {
        try {
          await setDoc(
            sessionRef,
            {
              tool: MOBILE_IMPORT_TOOL,
              status: 'terminated',
              terminatedAt: serverTimestamp(),
              terminatedBy: 'receiver',
              errorMessage: 'Session terminated after successful send.',
            },
            { merge: true }
          );
        } catch {
          // ignore termination failure after successful send
        }
      }

      setMobileImportState('disconnected');
      setMobileReceiverSessionActive(false);
      setMobileImportMessage('Session terminated after successful send.');
    } catch (error) {
      setMobileImportMessage(mapFirebaseErrorMessage(error, 'Upload failed. Please try again.'));
      if (db && mobileImportSessionFromQuery) {
        try {
          await updateDoc(doc(db, MOBILE_IMPORT_COLLECTION, mobileImportSessionFromQuery), {
            status: 'failed',
            errorMessage: mapFirebaseErrorMessage(error, 'Upload failed'),
          });
        } catch {
          // ignore
        }
      }
    } finally {
      setMobileUploadBusy(false);
    }
  }, [db, mobileImportSessionFromQuery, mobilePendingFiles]);

  const terminateMobileImportSession = useCallback(async () => {
    if (!db || !mobileImportSessionFromQuery) {
      setMobileImportState('disconnected');
      setMobileReceiverSessionActive(false);
      setMobileImportMessage('Session disconnected.');
      return;
    }

    const sessionRef = doc(db, MOBILE_IMPORT_COLLECTION, mobileImportSessionFromQuery);
    try {
      await updateDoc(sessionRef, {
        status: 'terminated',
        terminatedAt: serverTimestamp(),
        terminatedBy: 'receiver',
        errorMessage: 'Session disconnected by receiver.',
      });
    } catch {
      try {
        await setDoc(
          sessionRef,
          {
            tool: MOBILE_IMPORT_TOOL,
            status: 'terminated',
            terminatedAt: serverTimestamp(),
            terminatedBy: 'receiver',
            errorMessage: 'Session disconnected by receiver.',
          },
          { merge: true }
        );
      } catch {
        // ignore; receiver state still moves to disconnected
      }
    } finally {
      setMobileImportState('disconnected');
      setMobileReceiverSessionActive(false);
      setMobileImportMessage('Session disconnected.');
      setMobileUploadBusy(false);
      setMobileUploadProgress(0);
      setMobileUploadSuccess(false);
    }
  }, [db, mobileImportSessionFromQuery]);

  const handleMobileFilesPicked = useCallback((fileList) => {
    const picked = Array.from(fileList || []).filter((file) => file.type.startsWith('image/'));
    if (!picked.length) return;

    const combined = [...mobilePendingFiles, ...picked];
    if (combined.length > MOBILE_IMPORT_MAX_FILES) {
      setMobileSelectionOverflow({
        nextFiles: combined.slice(0, MOBILE_IMPORT_MAX_FILES),
      });
      setMobileUploadSuccess(false);
      setMobileUploadProgress(0);
      return;
    }

    setMobilePendingFiles(combined);
    setMobileSelectionOverflow(null);
    setMobileImportMessage('');

    setMobileUploadSuccess(false);
    setMobileUploadProgress(0);
  }, [mobilePendingFiles]);

  const acceptMobileFileLimit = useCallback(() => {
    if (!mobileSelectionOverflow?.nextFiles) return;
    setMobilePendingFiles(mobileSelectionOverflow.nextFiles);
    setMobileSelectionOverflow(null);
    setMobileImportMessage('');
    setMobileUploadSuccess(false);
    setMobileUploadProgress(0);
  }, [mobileSelectionOverflow]);

  const handleMobilePickerChange = useCallback((e) => {
    handleMobileFilesPicked(e.target.files);
    e.target.value = '';
  }, [handleMobileFilesPicked]);

  const removeMobilePendingFile = useCallback((removeIndex) => {
    setMobilePendingFiles((prev) => prev.filter((_, index) => index !== removeIndex));
    setMobileSelectionOverflow(null);
    setMobileImportMessage('');
    setMobileUploadSuccess(false);
    setMobileUploadProgress(0);
  }, []);

  const handleAddImageCardClick = useCallback(() => {
    if (!mobileReceiverSessionActive) {
      openQrScannerCamera();
      return;
    }

    if (mobileUploadBusy) return;
    mobilePickerInputRef.current?.click();
  }, [mobileReceiverSessionActive, mobileUploadBusy, openQrScannerCamera]);

  const scrollMobilePreview = useCallback((direction) => {
    const track = mobilePreviewTrackRef.current;
    if (!track) return;

    const distance = Math.max(220, Math.round(track.clientWidth * 0.85));
    track.scrollBy({ left: distance * direction, behavior: 'smooth' });
  }, []);

  const onMobilePreviewScroll = useCallback(() => {
    const track = mobilePreviewTrackRef.current;
    if (!track) return;

    const cardWidth = track.clientWidth || 1;
    const index = Math.max(0, Math.min(mobilePendingFiles.length - 1, Math.round(track.scrollLeft / cardWidth)));
    setMobilePreviewIndex(index);
  }, [mobilePendingFiles.length]);

  useEffect(() => {
    setMobilePreviewIndex((prev) => {
      if (!mobilePendingFiles.length) return 0;
      return Math.min(prev, mobilePendingFiles.length - 1);
    });
  }, [mobilePendingFiles.length]);

  const mobilePreviewItems = useMemo(
    () => mobilePendingFiles.map((file) => ({
      id: `${file.name}-${file.size}-${file.lastModified}`,
      src: URL.createObjectURL(file),
      name: file.name,
    })),
    [mobilePendingFiles]
  );

  useEffect(
    () => () => {
      mobilePreviewItems.forEach((item) => URL.revokeObjectURL(item.src));
    },
    [mobilePreviewItems]
  );

  useEffect(() => {
    if (!isMobileImportMode) return;

    if (!hasFirebaseConfig || !db) {
      setMobileImportMessage('Firebase config missing. Add REACT_APP_FIREBASE_* values in your .env file.');
      return;
    }

    if (!mobileImportSessionFromQuery) {
      setMobileImportMessage('Invalid import link. Missing session id.');
      return;
    }

    setMobileImportMessage('Select images and tap “Send”.');
  }, [db, isMobileImportMode, mobileImportSessionFromQuery]);

  useEffect(() => {
    if (!isMobileImportMode || !db || !mobileImportSessionFromQuery) {
      setMobileReceiverSessionActive(false);
      return undefined;
    }

    const sessionRef = doc(db, MOBILE_IMPORT_COLLECTION, mobileImportSessionFromQuery);
    const unsubscribe = onSnapshot(
      sessionRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          setMobileImportState('disconnected');
          setMobileReceiverSessionActive(false);
          setMobileImportMessage('Session disconnected.');
          return;
        }

        const payload = snapshot.data();
        const isConnected = payload?.status !== 'terminated';
        setMobileImportState(isConnected ? 'waiting' : 'disconnected');
        setMobileReceiverSessionActive(isConnected);
        if (!isConnected) {
          setMobileImportMessage(payload?.errorMessage || 'Session disconnected.');
        }
      },
      () => {
        setMobileImportState('disconnected');
        setMobileReceiverSessionActive(false);
        setMobileImportMessage('Session disconnected.');
      }
    );

    return () => unsubscribe();
  }, [db, isMobileImportMode, mobileImportSessionFromQuery]);

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

  const handleBlogTocClick = useCallback((e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.pageYOffset - 110;
    window.scrollTo({ top, behavior: 'smooth' });
    setActiveBlogId(id);
  }, []);

  useEffect(() => {
    const newActive = blogSections[0]?.id || blogSections[0]?.title || '';
    setActiveBlogId(newActive);
  }, [blogSections]);

  useEffect(() => {
    if (!blogSections.length || images.length > 0) return;
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
  }, [blogToc, blogSections.length, images.length]);

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
  const isFileDrag = (e) => Array.from(e.dataTransfer?.types || []).includes('Files');

  const onDragEnter = (e) => {
    if (!isFileDrag(e)) return;
    e.preventDefault();
    dragDepthRef.current += 1;
    setDragOver(true);
  };

  const onDragOver = (e) => {
    if (!isFileDrag(e)) return;
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
    if (!dragOver) setDragOver(true);
  };

  const onDragLeave = (e) => {
    if (!isFileDrag(e)) return;
    e.preventDefault();
    dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);
    if (dragDepthRef.current === 0) setDragOver(false);
  };

  const onDrop = (e) => {
    if (!isFileDrag(e)) return;
    e.preventDefault();
    dragDepthRef.current = 0;
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

        <section className={`comp-upload ${isMobileImportMode ? 'comp-upload--mobile-mode' : ''}`}>
          <div className="comp-upload__inner">
            {!isMobileImportMode ? (
              <>
                <h1 className="comp-upload__title">{t('compressor.title')}</h1>
                <p className="comp-upload__desc">
                  {t('compressor.desc')}
                </p>

                <div
                  className={`comp-dropzone ${dragOver ? 'comp-dropzone--active' : ''}`}
                  onDragEnter={onDragEnter}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
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
                  <div style={{ marginTop: 20, display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                    <button className="comp-dropzone__btn" onClick={() => fileInputRef.current?.click()} style={{ marginTop: 0 }}>
                      <i className="fa-solid fa-folder-open"></i> {t('common.chooseFiles')}
                    </button>
                    <MobileImportPopup onImportFiles={addFiles} />
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    hidden
                    onChange={(e) => addFiles(e.target.files)}
                  />
                </div>

              </>
            ) : (
              <div className="comp-mobile-receiver comp-mobile-receiver--fullscreen">
                <div className="comp-mobile-receiver__screen">
                  <div className="comp-mobile-receiver__top">
                    <div className="comp-mobile-receiver__meta-row">
                      <span className={`comp-mobile-receiver__connection ${mobileReceiverSessionActive ? 'comp-mobile-receiver__connection--active' : 'comp-mobile-receiver__connection--disconnected'}`}>
                        <span className="comp-mobile-receiver__connection-dot" aria-hidden="true"></span>
                        <span>{mobileReceiverSessionActive ? 'Active' : 'Disconnected'}</span>
                      </span>
                      <span className="comp-mobile-receiver__session">Session: {mobileImportSessionFromQuery || 'N/A'}</span>
                    </div>
                  </div>

                  {mobileSelectionOverflow ? (
                    <div className="comp-mobile-receiver__limit-card" role="alert" aria-live="assertive">
                      <p>Only 10 images supported at a time, First 10 will be selected.</p>
                      <button type="button" onClick={acceptMobileFileLimit}>OK</button>
                    </div>
                  ) : null}

                  <input
                    ref={mobilePickerInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    hidden
                    onChange={handleMobilePickerChange}
                  />

                  <button
                    className="comp-mobile-receiver__add-card"
                    onClick={handleAddImageCardClick}
                    disabled={mobileUploadBusy && mobileReceiverSessionActive}
                    aria-disabled={mobileUploadBusy && mobileReceiverSessionActive}
                    type="button"
                  >
                    {mobileReceiverSessionActive ? (
                      <>
                        <span className="comp-mobile-receiver__add-plus">+</span>
                        <span className="comp-mobile-receiver__add-title">Add Images</span>
                        <span className="comp-mobile-receiver__add-sub">Choose up to {MOBILE_IMPORT_MAX_FILES} images</span>
                      </>
                    ) : (
                      <>
                        <span className="comp-mobile-receiver__add-plus comp-mobile-receiver__add-plus--qr">
                          <i className="fa-solid fa-qrcode"></i>
                        </span>
                        <span className="comp-mobile-receiver__add-title">Scan QR</span>
                        <span className="comp-mobile-receiver__add-sub">Session terminated</span>
                      </>
                    )}
                  </button>

                  <div className="comp-mobile-receiver__preview-card">
                    <div className="comp-mobile-receiver__preview-head">
                      <strong>Preview</strong>
                      {mobilePendingFiles.length ? (
                        <span>{mobilePreviewIndex + 1}/{mobilePendingFiles.length}</span>
                      ) : (
                        <span>0/0</span>
                      )}
                    </div>

                    {mobilePreviewItems.length ? (
                      <>
                        <div className="comp-mobile-receiver__preview-track-wrap">
                          <button
                            className="comp-mobile-receiver__nav"
                            type="button"
                            onClick={() => scrollMobilePreview(-1)}
                            aria-label="Previous image"
                          >
                            <i className="fa-solid fa-chevron-left"></i>
                          </button>

                          <div
                            className="comp-mobile-receiver__preview-track"
                            ref={mobilePreviewTrackRef}
                            onScroll={onMobilePreviewScroll}
                          >
                            {mobilePreviewItems.map((item, index) => (
                              <div key={item.id} className="comp-mobile-receiver__preview-item">
                                <button
                                  className="comp-mobile-receiver__preview-remove"
                                  type="button"
                                  onClick={() => removeMobilePendingFile(index)}
                                  aria-label={`Remove ${item.name}`}
                                  title="Remove image"
                                >
                                  <i className="fa-solid fa-trash"></i>
                                </button>
                                <img src={item.src} alt={item.name} loading="lazy" />
                              </div>
                            ))}
                          </div>

                          <button
                            className="comp-mobile-receiver__nav"
                            type="button"
                            onClick={() => scrollMobilePreview(1)}
                            aria-label="Next image"
                          >
                            <i className="fa-solid fa-chevron-right"></i>
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="comp-mobile-receiver__empty">No images selected yet.</div>
                    )}
                  </div>

                  <div className="comp-mobile-receiver__actions">
                    <button
                      className="comp-mobile-receiver__scan-qr"
                      type="button"
                      onClick={openQrScannerCamera}
                      aria-label="Open camera QR scanner"
                    >
                      <i className="fa-solid fa-camera"></i>
                    </button>

                    <button
                      className="comp-dropzone__btn"
                      disabled={mobileUploadBusy || !mobilePendingFiles.length || !mobileReceiverSessionActive}
                      onClick={uploadFromMobile}
                    >
                      {mobileUploadBusy ? (
                        <><span className="comp-download-spinner"></span> Sending...</>
                      ) : (
                        <><i className="fa-solid fa-paper-plane"></i> Send</>
                      )}
                    </button>

                    <button
                      className="comp-mobile-receiver__cancel"
                      type="button"
                      onClick={terminateMobileImportSession}
                      disabled={!mobileReceiverSessionActive}
                    >
                      <i className="fa-solid fa-ban"></i> Cancel
                    </button>

                  </div>

                  {(mobileUploadBusy || mobileUploadProgress > 0) ? (
                    <div className="comp-mobile-receiver__progress-wrap" aria-live="polite">
                      <div className="comp-mobile-receiver__progress-label">
                        <span>Sending images</span>
                        <span>{mobileUploadProgress}%</span>
                      </div>
                      <div className="comp-mobile-receiver__progress-track">
                        <span className="comp-mobile-receiver__progress-bar" style={{ width: `${mobileUploadProgress}%` }}></span>
                      </div>
                    </div>
                  ) : null}

                  {mobileUploadSuccess ? (
                    <div className="comp-mobile-receiver__success" role="status" aria-live="polite">
                      <span className="comp-mobile-receiver__success-icon"><i className="fa-solid fa-check"></i></span>
                      <span>Sent successfully</span>
                    </div>
                  ) : null}

                  {mobileImportMessage ? <p className="comp-mobile-receiver__status">{mobileImportMessage}</p> : null}
                </div>
              </div>
            )}
          </div>
        </section>

        {!isMobileImportMode && blogSections.length ? (
          <>
            <nav className={`comp-blog-toc--mobile ${isBlogRtl ? 'comp-blog-toc--mobile--rtl' : ''}`} aria-label="Image compressor blog sections">
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
              <aside className="comp-blog-toc" aria-label="Image compressor blog TOC">
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
                {blogSections.map((section) => (
                  <article className="comp-blog__card" id={section.id || section.title} key={section.id || section.title}>
                    <h2>{section.title}</h2>

                    {Array.isArray(section.paragraphs)
                      ? section.paragraphs.map((p, idx) => <p key={`p-${idx}`}>{p}</p>)
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
                              ? step.paragraphs.map((p, pIdx) => <p key={`sp-${pIdx}`}>{p}</p>)
                              : null}

                            {Array.isArray(step.bullets) ? (
                              <ul className="comp-blog__list comp-blog__list--nested">
                                {step.bullets.map((bullet, bIdx) => (
                                  <li key={`sb-${bIdx}`}>{bullet}</li>
                                ))}
                              </ul>
                            ) : null}

                            {step.table ? (
                              <div className="comp-blog__table" role="table" aria-label={step.table.caption || step.heading}>
                                <div className="comp-blog__table-row comp-blog__table-row--head" role="row">
                                  {step.table.headers.map((header, hIdx) => (
                                    <div className="comp-blog__table-cell" role="columnheader" key={`h-${hIdx}`}>
                                      {header}
                                    </div>
                                  ))}
                                </div>
                                {step.table.rows.map((row, rIdx) => (
                                  <div className="comp-blog__table-row" role="row" key={`r-${rIdx}`}>
                                    {row.map((cell, cIdx) => (
                                      <div className="comp-blog__table-cell" role="cell" key={`c-${cIdx}`}>
                                        {cell}
                                      </div>
                                    ))}
                                  </div>
                                ))}
                              </div>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    ) : null}

                    {Array.isArray(section.formats) ? (
                      <>
                        <p className="comp-blog__formats-intro">
                          {section.formatsIntro || t('compressor.blog.formatsIntro') || 'Our tool supports all the image formats. So, you can compress any image seamlessly. List of all the formats is given below:'}
                        </p>
                        <div className="comp-blog__chips" aria-label="Supported formats">
                          {section.formats.map((fmt, fIdx) => (
                            <span className="comp-blog__chip" key={`f-${fIdx}`}>
                              {fmt}
                            </span>
                          ))}
                        </div>
                      </>
                    ) : null}
                  </article>
                ))}

                <section className="comp-blog__faq-section" id={blogFaqId}>
                  <FAQ faqKey="imageCompressor" />
                </section>
              </section>
            </div>
          </>
        ) : null}
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

      <section
        className={`comp-workspace ${dragOver ? 'comp-workspace--dragover' : ''}`}
        onDragEnter={onDragEnter}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
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