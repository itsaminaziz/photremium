import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import './HomePasteAssistant.css';

const URL_REGEX = /(https?:\/\/[^\s]+)/i;

const isLikelyUrl = (value) => {
  if (!value) return false;
  const text = value.trim();
  if (!text) return false;
  if (URL_REGEX.test(text)) return true;
  try {
    const normalized = text.startsWith('http://') || text.startsWith('https://') ? text : `https://${text}`;
    const url = new URL(normalized);
    return Boolean(url.hostname && url.hostname.includes('.'));
  } catch {
    return false;
  }
};

const isEditablePasteTarget = (target) => {
  if (!(target instanceof Element)) return false;

  const editable = target.closest('input, textarea, [contenteditable="true"], [contenteditable=""], [role="textbox"]');
  if (!editable) return false;

  if (editable instanceof HTMLInputElement || editable instanceof HTMLTextAreaElement) {
    return !editable.readOnly && !editable.disabled;
  }

  return true;
};

const HomePasteAssistant = () => {
  const navigate = useNavigate();
  const { t, localePath } = useLanguage();

  const [isOpen, setIsOpen] = useState(false);
  const [images, setImages] = useState([]);
  const [pastedText, setPastedText] = useState('');
  const imagesRef = useRef([]);

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  const clearImages = useCallback((prevImages) => {
    prevImages.forEach((item) => URL.revokeObjectURL(item.preview));
    return [];
  }, []);

  const closePopup = useCallback(() => {
    setIsOpen(false);
    setPastedText('');
    setImages((prev) => clearImages(prev));
  }, [clearImages]);

  useEffect(() => {
    return () => {
      imagesRef.current.forEach((item) => URL.revokeObjectURL(item.preview));
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const handlePaste = useCallback((e) => {
    if (isEditablePasteTarget(e.target)) return;

    const clipboard = e.clipboardData;
    if (!clipboard) return;

    const incomingFiles = [];
    const items = clipboard.items ? Array.from(clipboard.items) : [];
    for (const item of items) {
      if (item.kind === 'file' && item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) incomingFiles.push(file);
      }
    }

    const incomingText = (clipboard.getData('text/plain') || '').trim();
    if (!incomingFiles.length && !incomingText) return;

    e.preventDefault();

    if (incomingFiles.length) {
      const prepared = incomingFiles.map((file) => ({
        id: crypto.randomUUID(),
        file,
        preview: URL.createObjectURL(file),
      }));
      setImages((prev) => [...prev, ...prepared]);
    }

    if (incomingText) {
      setPastedText((prev) => (prev ? `${prev}\n${incomingText}` : incomingText));
    }

    setIsOpen(true);
  }, []);

  useEffect(() => {
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [handlePaste]);

  const hasMultipleImages = images.length > 1;
  const hasText = pastedText.trim().length > 0;
  const detectedUrl = useMemo(() => {
    if (!hasText) return '';
    const match = pastedText.match(URL_REGEX);
    if (match?.[1]) return match[1];
    if (isLikelyUrl(pastedText)) {
      return pastedText.startsWith('http://') || pastedText.startsWith('https://')
        ? pastedText
        : `https://${pastedText.trim()}`;
    }
    return '';
  }, [hasText, pastedText]);

  const imageTools = useMemo(() => ([
    { id: 'converter', label: t('nav.imageConverter'), icon: 'fa-solid fa-right-left', path: '/image-converter', supportsMultiple: true },
    { id: 'compressor', label: t('nav.imageCompressor'), icon: 'fa-solid fa-compress', path: '/image-compressor', supportsMultiple: true },
    { id: 'resizer', label: t('nav.resizeImage'), icon: 'fa-solid fa-up-right-and-down-left-from-center', path: '/resize-image', supportsMultiple: true },
    { id: 'crop', label: t('nav.cropImage'), icon: 'fa-solid fa-crop-simple', path: '/crop-image', supportsMultiple: true },
    { id: 'removebg', label: t('nav.removeBackground'), icon: 'fa-solid fa-eraser', path: '/remove-background', supportsMultiple: true },
    { id: 'watermark', label: t('nav.watermarkImage'), icon: 'fa-solid fa-stamp', path: '/watermark-image', supportsMultiple: true },
  ]), [t]);

  const visibleImageTools = hasMultipleImages
    ? imageTools.filter((tool) => tool.supportsMultiple)
    : imageTools;
  const shouldShowImageTools = images.length > 0;

  const openImageTool = (path) => {
    if (!images.length) return;
    navigate(localePath(path), {
      state: {
        pastedImages: images.map((img) => img.file),
      },
    });
    closePopup();
  };

  const openQrGenerator = () => {
    if (!hasText) return;
    navigate(localePath('/qr-code-generator'), {
      state: {
        pastedText: detectedUrl || pastedText,
        autoGenerate: true,
      },
    });
    closePopup();
  };

  if (!isOpen) return null;

  return (
    <div className="hpa__overlay" role="dialog" aria-modal="true" aria-label={t('homePaste.title')}>
      <div className="hpa__card">
        <button className="hpa__close" onClick={closePopup} aria-label={t('common.close')}>
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div className="hpa__preview-pane">
          <div className="hpa__head">
            <span className="hpa__badge"><i className="fa-solid fa-bolt"></i> {t('homePaste.badge')}</span>
            <h3>{t('homePaste.title')}</h3>
            <p>{t('homePaste.subtitle')}</p>
          </div>

          {images.length > 0 && (
            <div className="hpa__preview-block">
              <div className="hpa__section-title">
                <i className="fa-regular fa-images"></i> {t('homePaste.imagesLabel')} ({images.length})
              </div>
              <div className="hpa__images-grid">
                {images.map((img) => (
                  <div key={img.id} className="hpa__image-item">
                    <img src={img.preview} alt={img.file.name} />
                    <span>{img.file.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {hasText && (
            <div className="hpa__preview-block">
              <div className="hpa__section-title">
                <i className="fa-solid fa-file-lines"></i> {t('homePaste.textLabel')}
              </div>
              <div className="hpa__text-preview">{pastedText}</div>
            </div>
          )}
        </div>

        <aside className="hpa__tools-pane">
          <h4>{t('homePaste.toolsTitle')}</h4>
          {hasMultipleImages && <p className="hpa__hint">{t('homePaste.multiHint')}</p>}

          {shouldShowImageTools && visibleImageTools.map((tool) => (
            <button key={tool.id} className="hpa__tool-btn" onClick={() => openImageTool(tool.path)}>
              <span className="hpa__tool-icon"><i className={tool.icon}></i></span>
              <span>{tool.label}</span>
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          ))}

          {hasText && (
            <button className="hpa__tool-btn hpa__tool-btn--qr" onClick={openQrGenerator}>
              <span className="hpa__tool-icon"><i className="fa-solid fa-qrcode"></i></span>
              <span>{t('nav.qrCodeGenerator')}</span>
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          )}
        </aside>
      </div>
    </div>
  );
};

export default HomePasteAssistant;
