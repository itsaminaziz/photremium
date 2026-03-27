import React, { useCallback, useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { deleteDoc, doc, onSnapshot, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { db, hasFirebaseConfig } from '../../lib/firebase';
import { LANG_CODES } from '../../i18n/languages';
import './MobileImportPopup.css';

const MOBILE_IMPORT_COLLECTION = 'mobileImports';
const MOBILE_IMPORT_TOOL = 'image-compressor';
const MOBILE_IMPORT_TTL_MS = 15 * 60 * 1000;

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

const generateMobileSessionId = () => {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID().replace(/-/g, '').slice(0, 16);
  }
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`.slice(0, 16);
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

const getReceiverPath = () => {
  const segments = window.location.pathname.split('/').filter(Boolean);
  const langPrefix = segments[0] && LANG_CODES.has(segments[0]) ? `/${segments[0]}` : '';
  return `${langPrefix}/image-compressor`;
};

const MobileImportPopup = ({ onImportFiles }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [startingSession, setStartingSession] = useState(false);
  const [mobileSessionId, setMobileSessionId] = useState('');
  const [mobileShareUrl, setMobileShareUrl] = useState('');
  const [mobileQrUrl, setMobileQrUrl] = useState('');
  const [mobileImportState, setMobileImportState] = useState('idle');
  const [mobileImportMessage, setMobileImportMessage] = useState('');
  const [copyLinkSuccess, setCopyLinkSuccess] = useState(false);
  const mobileSessionUnsubRef = useRef(null);
  const copyLinkTimerRef = useRef(null);

  const stopMobileSessionListener = useCallback(() => {
    if (mobileSessionUnsubRef.current) {
      mobileSessionUnsubRef.current();
      mobileSessionUnsubRef.current = null;
    }
  }, []);

  const attachDesktopSessionListener = useCallback(
    (sessionId) => {
      if (!db || !sessionId) return;
      stopMobileSessionListener();

      const sessionRef = doc(db, MOBILE_IMPORT_COLLECTION, sessionId);
      mobileSessionUnsubRef.current = onSnapshot(sessionRef, async (snapshot) => {
        if (!snapshot.exists()) {
          setMobileImportState('error');
          setMobileImportMessage('Import session not found.');
          return;
        }

        const payload = snapshot.data();
        if (payload?.status === 'uploaded' && Array.isArray(payload.images) && payload.images.length) {
          const files = payload.images.map((item, index) =>
            dataUrlToFile(item.dataUrl, item.name || `mobile-import-${index + 1}.jpg`, item.type || 'image/jpeg')
          );

          await Promise.resolve(onImportFiles(files));
          setMobileImportState('done');
          setMobileImportMessage(`Imported ${files.length} image${files.length > 1 ? 's' : ''} from mobile.`);

          await updateDoc(sessionRef, {
            status: 'consumed',
            consumedAt: serverTimestamp(),
          });

          stopMobileSessionListener();
        }

        if (payload?.status === 'failed' && payload?.errorMessage) {
          setMobileImportState('error');
          setMobileImportMessage(payload.errorMessage);
        }
      });
    },
    [onImportFiles, stopMobileSessionListener]
  );

  const startMobileImportSession = useCallback(async (replaceCurrent = false) => {
    if (startingSession) return;

    if (!hasFirebaseConfig || !db) {
      setMobileImportState('error');
      setMobileImportMessage('Firebase config missing. Add REACT_APP_FIREBASE_* values in your .env file.');
      return;
    }

    try {
      setStartingSession(true);
      setMobileQrUrl('');

      stopMobileSessionListener();
      if (replaceCurrent && db && mobileSessionId) {
        try {
          await deleteDoc(doc(db, MOBILE_IMPORT_COLLECTION, mobileSessionId));
        } catch {
          // ignore cleanup failure
        }
      }

      const sessionId = generateMobileSessionId();
      const shareUrl = `${window.location.origin}${getReceiverPath()}?mobileImport=1&tool=${MOBILE_IMPORT_TOOL}&session=${sessionId}`;

      await setDoc(doc(db, MOBILE_IMPORT_COLLECTION, sessionId), {
        tool: MOBILE_IMPORT_TOOL,
        status: 'waiting',
        createdAt: serverTimestamp(),
        expiresAt: Date.now() + MOBILE_IMPORT_TTL_MS,
      });

      const qr = await QRCode.toDataURL(shareUrl, {
        width: 240,
        margin: 1,
      });

      setMobileSessionId(sessionId);
      setMobileShareUrl(shareUrl);
      setMobileQrUrl(qr);
      setMobileImportState('waiting');
      setMobileImportMessage('');

      attachDesktopSessionListener(sessionId);
    } catch (error) {
      setMobileImportState('error');
      setMobileImportMessage(mapFirebaseErrorMessage(error, 'Unable to create mobile import session.'));
    } finally {
      setStartingSession(false);
    }
  }, [attachDesktopSessionListener, mobileSessionId, startingSession, stopMobileSessionListener]);

  const openAndStartMobileImport = useCallback(() => {
    setIsOpen(true);

    if (!mobileSessionId && !startingSession) {
      startMobileImportSession();
    }
  }, [mobileSessionId, startMobileImportSession, startingSession]);

  const copyMobileImportLink = useCallback(async () => {
    if (!mobileShareUrl) return;
    try {
      await navigator.clipboard.writeText(mobileShareUrl);
      setCopyLinkSuccess(true);
      if (copyLinkTimerRef.current) {
        clearTimeout(copyLinkTimerRef.current);
      }
      copyLinkTimerRef.current = setTimeout(() => {
        setCopyLinkSuccess(false);
      }, 1200);
    } catch {
      setMobileImportState('error');
      setMobileImportMessage('Could not copy link. Please copy it manually.');
    }
  }, [mobileShareUrl]);

  const closeMobileImportPopup = useCallback(async () => {
    stopMobileSessionListener();

    if (db && mobileSessionId) {
      try {
        await deleteDoc(doc(db, MOBILE_IMPORT_COLLECTION, mobileSessionId));
      } catch {
        // ignore cleanup failure
      }
    }

    setMobileSessionId('');
    setMobileShareUrl('');
    setMobileQrUrl('');
    setMobileImportState('idle');
    setMobileImportMessage('');
    setIsOpen(false);
  }, [mobileSessionId, stopMobileSessionListener]);

  const statusConfig = (() => {
    if (mobileImportState === 'error') return { label: 'Error', className: 'mip-info-card--status-error' };
    if (mobileImportState === 'done') return { label: 'Completed', className: 'mip-info-card--status-done' };
    if (mobileSessionId) return { label: 'Active', className: 'mip-info-card--status-active' };
    return { label: 'Initializing', className: 'mip-info-card--status-idle' };
  })();

  useEffect(() => {
    const onEsc = (event) => {
      if (event.key === 'Escape') {
        closeMobileImportPopup();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', onEsc);
      return () => window.removeEventListener('keydown', onEsc);
    }

    return undefined;
  }, [closeMobileImportPopup, isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => () => stopMobileSessionListener(), [stopMobileSessionListener]);

  useEffect(
    () => () => {
      if (copyLinkTimerRef.current) {
        clearTimeout(copyLinkTimerRef.current);
      }
    },
    []
  );

  return (
    <>
      <button
        className="mip-trigger"
        onClick={openAndStartMobileImport}
        data-tooltip="Import from mobile"
        aria-label="Import from mobile"
      >
        <i className="fa-solid fa-mobile-screen-button"></i>
      </button>

      {isOpen ? (
        <div className="mip-modal" role="dialog" aria-modal="true" aria-label="Scan with mobile">
          <div className="mip-modal__backdrop" onClick={() => closeMobileImportPopup()}></div>
          <div className="mip-modal__dialog">
            <button className="mip-modal__close" onClick={() => closeMobileImportPopup()} aria-label="Close">
              <i className="fa-solid fa-xmark"></i>
            </button>

            <div className="mip-card">
              <div className="mip-card__head">
                <h3><i className="fa-solid fa-mobile-screen-button"></i> Scan with mobile</h3>
              </div>

              <div className="mip-card__content">
                <div className="mip-card__left">
                  {mobileQrUrl ? (
                    <button
                      className="mip-card__qr-wrap mip-card__qr-reload"
                      data-tooltip="Refresh QR code"
                      onClick={() => startMobileImportSession(true)}
                      disabled={startingSession}
                    >
                      <img src={mobileQrUrl} alt="Mobile import QR" className="mip-card__qr" />
                    </button>
                  ) : (
                    <div className="mip-card__qr-wrap mip-card__qr-wrap--placeholder">
                      {startingSession ? <span className="mip-skeleton mip-skeleton--qr"></span> : <i className="fa-solid fa-qrcode"></i>}
                      <span>{startingSession ? 'Loading QR code...' : 'Waiting for QR code...'}</span>
                    </div>
                  )}
                </div>

                <div className="mip-card__right">
                  {!mobileSessionId && startingSession ? (
                    <div className="mip-card__skeleton">
                      <div className="mip-info-card mip-info-card--skeleton">
                        <div className="mip-skeleton-row">
                          <span className="mip-skeleton mip-skeleton--dot"></span>
                          <span className="mip-skeleton mip-skeleton--label"></span>
                        </div>
                        <span className="mip-skeleton mip-skeleton--value short"></span>
                      </div>

                      <div className="mip-info-card mip-info-card--skeleton">
                        <span className="mip-skeleton mip-skeleton--label"></span>
                        <span className="mip-skeleton mip-skeleton--value"></span>
                      </div>

                      <div className="mip-info-card mip-info-card--skeleton">
                        <span className="mip-skeleton mip-skeleton--label long"></span>
                        <span className="mip-skeleton mip-skeleton--value"></span>
                        <span className="mip-skeleton mip-skeleton--button"></span>
                      </div>
                    </div>
                  ) : !mobileSessionId ? (
                    <button className="mip-card__start" onClick={() => startMobileImportSession(false)} disabled={startingSession}>
                      <><i className="fa-solid fa-link"></i> Start Mobile Import</>
                    </button>
                  ) : (
                    <>
                      <div className={`mip-info-card mip-info-card--status ${statusConfig.className}`}>
                        <div className="mip-info-card__status-row">
                          <span className="mip-status-dot"></span>
                          <span className="mip-info-card__label">Status</span>
                        </div>
                        <strong className="mip-info-card__value">{statusConfig.label}</strong>
                      </div>

                      <div className="mip-info-card mip-info-card--session">
                        <span className="mip-info-card__label">Session ID</span>
                        <strong className="mip-info-card__value">{mobileSessionId}</strong>
                      </div>

                      <div className="mip-info-card mip-info-card--link">
                        <span className="mip-info-card__label">Scan QR code or open this link in mobile</span>
                        <span className="mip-info-card__link" title={mobileShareUrl}>{mobileShareUrl}</span>
                        <button className={`mip-card__btn ${copyLinkSuccess ? 'mip-card__btn--success' : ''}`} onClick={copyMobileImportLink}>
                          {copyLinkSuccess ? <i className="fa-solid fa-check"></i> : <><i className="fa-regular fa-copy"></i> Copy Link</>}
                        </button>
                      </div>
                    </>
                  )}

                  {mobileImportMessage ? (
                    <p className={`mip-card__status mip-card__status--${mobileImportState}`}>
                      {mobileImportMessage}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default MobileImportPopup;
