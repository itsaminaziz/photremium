import React, { useState, useRef, useEffect, useCallback } from 'react';
import emailjs from '@emailjs/browser';
import { useContact } from '../../context/ContactContext';
import { useLanguage } from '../../context/LanguageContext';
import './ContactForm.css';

const SHARE_URL  = 'https://favimg.com';
const SHARE_TEXT = 'Check out favIMG – free online image tools: converter, compressor, crop, remove background & more!';
const SOCIAL = [
  { id: 'whatsapp',  icon: 'fa-brands fa-whatsapp',    label: 'WhatsApp',   color: '#25d366', bg: '#e7fdf0', href: `https://api.whatsapp.com/send?text=${encodeURIComponent(SHARE_TEXT + ' ' + SHARE_URL)}` },
  { id: 'facebook',  icon: 'fa-brands fa-facebook-f',  label: 'Facebook',   color: '#1877f2', bg: '#e7f0fd', href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SHARE_URL)}` },
  { id: 'twitter',   icon: 'fa-brands fa-x-twitter',   label: 'X / Twitter',color: '#000',    bg: '#f1f3f5', href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(SHARE_URL)}&text=${encodeURIComponent(SHARE_TEXT)}` },
  { id: 'telegram',  icon: 'fa-brands fa-telegram',    label: 'Telegram',   color: '#0088cc', bg: '#e5f4fd', href: `https://t.me/share/url?url=${encodeURIComponent(SHARE_URL)}&text=${encodeURIComponent(SHARE_TEXT)}` },
  { id: 'instagram', icon: 'fa-brands fa-instagram',   label: 'Instagram',  color: '#e1306c', bg: '#fdeef4', href: 'https://www.instagram.com/' },
  { id: 'linkedin',  icon: 'fa-brands fa-linkedin-in', label: 'LinkedIn',   color: '#0077b5', bg: '#e5f2f8', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(SHARE_URL)}` },
  { id: 'reddit',    icon: 'fa-brands fa-reddit-alien',label: 'Reddit',     color: '#ff4500', bg: '#fff1ec', href: `https://reddit.com/submit?url=${encodeURIComponent(SHARE_URL)}&title=${encodeURIComponent(SHARE_TEXT)}` },
  { id: 'copy',      icon: 'fa-solid fa-link',         label: 'Copy Link',  color: '#6366f1', bg: '#eef2ff', href: null },
];

const FOLLOW_CARDS = [
  { id: 'youtube',   icon: 'fa-brands fa-youtube',    label: 'YouTube',   handle: '@favIMG', subtext: 'Video tips & tutorials', color: '#ff0000', bg: 'rgba(255,0,0,0.08)',    href: 'https://www.youtube.com/' },
  { id: 'instagram', icon: 'fa-brands fa-instagram',  label: 'Instagram', handle: '@favimg', subtext: 'Reels & design posts',   color: '#e1306c', bg: 'rgba(225,48,108,0.08)', href: 'https://www.instagram.com/' },
  { id: 'facebook',  icon: 'fa-brands fa-facebook-f', label: 'Facebook',  handle: 'favIMG',  subtext: 'Updates & community',    color: '#1877f2', bg: 'rgba(24,119,242,0.08)', href: 'https://www.facebook.com/' },
  { id: 'tiktok',    icon: 'fa-brands fa-tiktok',     label: 'TikTok',    handle: '@favimg', subtext: 'Short quick tips',        color: '#010101', bg: 'rgba(0,0,0,0.06)',      href: 'https://www.tiktok.com/' },
];

const openShareWindow = (url) => {
  const w = 620, h = 520;
  const left = Math.round(window.screenX + (window.outerWidth  - w) / 2);
  const top  = Math.round(window.screenY + (window.outerHeight - h) / 2);
  window.open(url, 'favimg_share', `width=${w},height=${h},left=${left},top=${top},toolbar=0,menubar=0,scrollbars=1,resizable=1`);
};

const SERVICE_ID  = 'service_esd9oub';
const TEMPLATE_ID = 'template_unwmjrn';
const PUBLIC_KEY  = 'FEcjzlxKefYWCa1O0';

const EMPTY = { name: '', gmail: '', subject: '', message: '' };

const ContactForm = ({ mode = 'popup' }) => {
  const { isOpen, closeContact } = useContact();
  const { t } = useLanguage();
  const [form, setForm]       = useState(EMPTY);
  const [errors, setErrors]   = useState({});
  const [status, setStatus]   = useState('idle'); // idle | sending | success | error
  const overlayRef            = useRef(null);
  const [copied, setCopied]   = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(SHARE_URL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, []);

  const handleNativeShare = useCallback(async () => {
    if (navigator.share) {
      try { await navigator.share({ title: 'favIMG', text: SHARE_TEXT, url: SHARE_URL }); }
      catch {} // user cancelled
    } else {
      handleCopy(); // fallback: copy link
    }
  }, [handleCopy]);

  /* Close popup on Escape key */
  useEffect(() => {
    if (mode !== 'popup') return;
    const onKey = (e) => { if (e.key === 'Escape') closeContact(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mode, closeContact]);

  /* Prevent body scroll when popup open */
  useEffect(() => {
    if (mode !== 'popup') return;
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen, mode]);

  const validate = useCallback(() => {
    const e = {};
    if (!form.name.trim())    e.name    = t('contactForm.errName');
    if (!form.gmail.trim())   e.gmail   = t('contactForm.errEmail');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.gmail)) e.gmail = t('contactForm.errEmailInvalid');
    if (!form.subject.trim()) e.subject = t('contactForm.errSubject');
    if (!form.message.trim()) e.message = t('contactForm.errMessage');
    return e;
  }, [form, t]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setStatus('sending');
    const now = new Date();
    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          name:    form.name.trim(),
          gmail:   form.gmail.trim(),
          subject: form.subject.trim(),
          message: form.message.trim(),
          date:    now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
          time:    now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        },
        PUBLIC_KEY
      );
      setStatus('success');
      setForm(EMPTY);
    } catch {
      setStatus('error');
    }
  };

  const handleReset = () => { setStatus('idle'); setErrors({}); };

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) closeContact();
  };

  /* ---------- shared inner form markup ---------- */
  const inner = (
    <div className={`cf__card cf__card--${mode}`}>
      {/* Header */}
      <div className="cf__header">
        <div className="cf__header-text">
          <span className="cf__badge"><i className="fa-solid fa-envelope-open-text"></i> {t('contactForm.badge')}</span>
          <h2 className="cf__title">{t('contactForm.title')}</h2>
          <p className="cf__subtitle">{t('contactForm.subtitle')}</p>
        </div>
        {mode === 'popup' && (
          <button className="cf__close" onClick={closeContact} aria-label={t('common.close')}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        )}
      </div>

      {/* Success state */}
      {status === 'success' ? (
        <div className="cf__success">
          <div className="cf__success-icon">
            <i className="fa-solid fa-circle-check"></i>
          </div>
          <h3>{t('contactForm.successTitle')}</h3>
          <p>{t('contactForm.successMsg')}</p>
          <button className="cf__btn cf__btn--send" onClick={handleReset}>
            {t('contactForm.sendAnother')}
          </button>
        </div>
      ) : (
        <form className="cf__form" onSubmit={handleSubmit} noValidate>
          {/* Name & Gmail side by side on wider screens */}
          <div className="cf__row">
            <div className={`cf__field ${errors.name ? 'cf__field--error' : ''}`}>
              <label htmlFor={`cf-name-${mode}`}>
                <i className="fa-solid fa-user"></i> {t('contactForm.nameLabel')}
              </label>
              <input
                id={`cf-name-${mode}`}
                type="text"
                name="name"
                placeholder={t('contactForm.namePlaceholder')}
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
              />
              {errors.name && <span className="cf__error">{errors.name}</span>}
            </div>

            <div className={`cf__field ${errors.gmail ? 'cf__field--error' : ''}`}>
              <label htmlFor={`cf-gmail-${mode}`}>
                <i className="fa-solid fa-envelope"></i> {t('contactForm.emailLabel')}
              </label>
              <input
                id={`cf-gmail-${mode}`}
                type="email"
                name="gmail"
                placeholder={t('contactForm.emailPlaceholder')}
                value={form.gmail}
                onChange={handleChange}
                autoComplete="email"
              />
              {errors.gmail && <span className="cf__error">{errors.gmail}</span>}
            </div>
          </div>

          <div className={`cf__field ${errors.subject ? 'cf__field--error' : ''}`}>
            <label htmlFor={`cf-subject-${mode}`}>
              <i className="fa-solid fa-tag"></i> {t('contactForm.subjectLabel')}
            </label>
            <input
              id={`cf-subject-${mode}`}
              type="text"
              name="subject"
              placeholder={t('contactForm.subjectPlaceholder')}
              value={form.subject}
              onChange={handleChange}
            />
            {errors.subject && <span className="cf__error">{errors.subject}</span>}
          </div>

          <div className={`cf__field ${errors.message ? 'cf__field--error' : ''}`}>
            <label htmlFor={`cf-message-${mode}`}>
              <i className="fa-solid fa-message"></i> {t('contactForm.messageLabel')}
            </label>
            <textarea
              id={`cf-message-${mode}`}
              name="message"
              placeholder={t('contactForm.messagePlaceholder')}
              rows={mode === 'popup' ? 4 : 6}
              value={form.message}
              onChange={handleChange}
            />
            {errors.message && <span className="cf__error">{errors.message}</span>}
          </div>

          {status === 'error' && (
            <p className="cf__send-error">
              <i className="fa-solid fa-triangle-exclamation"></i> {t('contactForm.sendError')}
            </p>
          )}

          <div className="cf__actions">
            {mode === 'popup' && (
              <button type="button" className="cf__btn cf__btn--cancel" onClick={() => { setForm(EMPTY); setErrors({}); setStatus('idle'); }}>
                <i className="fa-solid fa-broom"></i> {t('common.clear')}
              </button>
            )}
            <button type="submit" className="cf__btn cf__btn--send" disabled={status === 'sending'}>
              {status === 'sending' ? (
                <><i className="fa-solid fa-circle-notch fa-spin"></i> {t('contactForm.sending')}</>
              ) : (
                <><i className="fa-solid fa-paper-plane"></i> {t('contactForm.send')}</>
              )}
            </button>
          </div>
        </form>
      )}
      {/* Inline share strip — visible only inside popup on mobile */}
      {mode === 'popup' && (
        <div className="cf__share-inline">
          <p className="cf__share-inline-title"><i className="fa-solid fa-share-nodes"></i> Share favIMG</p>
          <div className="cf__social-grid">
            {SOCIAL.map((s, i) => s.href ? (
              <a
                key={s.id}
                href={s.href}
                className="cf__social-btn"
                title={s.label}
                style={{ '--sb': s.bg, '--sc': s.color, animationDelay: `${i * 0.06}s` }}
                onClick={e => { e.preventDefault(); openShareWindow(s.href); }}
              >
                <i className={s.icon}></i>
              </a>
            ) : (
              <button
                key={s.id}
                type="button"
                className={`cf__social-btn${copied ? ' cf__social-btn--copied' : ''}`}
                title={copied ? 'Copied!' : s.label}
                onClick={handleCopy}
                style={{ '--sb': s.bg, '--sc': s.color, animationDelay: `${i * 0.06}s` }}
              >
                <i className={copied ? 'fa-solid fa-check' : s.icon}></i>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  /* ---------- Shared share card markup ---------- */
  const shareCard = (
    <div className="cf__share-card">
      <div className="cf__share-bg" aria-hidden="true">
        <div className="cf__share-blob cf__share-blob--1"></div>
        <div className="cf__share-blob cf__share-blob--2"></div>
      </div>
      <button type="button" className="cf__share-icon" onClick={handleNativeShare} title="Tap to share favIMG">
        <i className="fa-solid fa-share-nodes"></i>
      </button>
      <h3 className="cf__share-title">Love <span>favIMG</span>?</h3>
      <p className="cf__share-desc">Share it with your friends and help more people discover free image tools online.</p>
      <div className="cf__social-grid">
        {SOCIAL.map((s, i) => s.href ? (
          <a
            key={s.id}
            href={s.href}
            className="cf__social-btn"
            title={s.label}
            style={{ '--sb': s.bg, '--sc': s.color, animationDelay: `${0.1 + i * 0.07}s` }}
            onClick={e => { e.preventDefault(); openShareWindow(s.href); }}
          >
            <i className={s.icon}></i>
          </a>
        ) : (
          <button
            key={s.id}
            type="button"
            className={`cf__social-btn${copied ? ' cf__social-btn--copied' : ''}`}
            title={copied ? 'Copied!' : s.label}
            onClick={handleCopy}
            style={{ '--sb': s.bg, '--sc': s.color, animationDelay: `${0.1 + i * 0.07}s` }}
          >
            <i className={copied ? 'fa-solid fa-check' : s.icon}></i>
          </button>
        ))}
      </div>
      <div className="cf__share-url"><i className="fa-solid fa-link"></i> favimg.com</div>
    </div>
  );

  /* ---------- Follow cards (YouTube / Instagram / Facebook / TikTok) ---------- */
  const followCards = (
    <div className="cf__follow-grid">
      {FOLLOW_CARDS.map((p, i) => (
        <a
          key={p.id}
          href={p.href}
          target="_blank"
          rel="noopener noreferrer"
          className="cf__follow-card"
          style={{ '--fc': p.color, '--fb': p.bg, animationDelay: `${0.3 + i * 0.1}s` }}
        >
          <span className="cf__follow-icon" style={{ background: p.bg }}>
            <i className={p.icon} style={{ color: p.color }}></i>
          </span>
          <span className="cf__follow-info">
            <span className="cf__follow-name">{p.label}</span>
            <span className="cf__follow-sub">{p.subtext}</span>
          </span>
          <span className="cf__follow-btn">Follow</span>
        </a>
      ))}
    </div>
  );

  /* ---------- Section mode (Home page) ---------- */
  if (mode === 'section') {
    return (
      <section className="cf__section-wrapper">
        <div className="cf__section-bg-glow" aria-hidden="true" />
        <div className="cf__section-row">
          {inner}
          <aside className="cf__share-aside-section">
            {shareCard}
            {followCards}
          </aside>
        </div>
      </section>
    );
  }

  /* ---------- Popup mode ---------- */
  return (
    <div
      className={`cf__overlay ${isOpen ? 'cf__overlay--open' : ''}`}
      ref={overlayRef}
      onClick={handleOverlayClick}
      aria-modal="true"
      role="dialog"
      aria-label="Contact Us"
    >
      {/* Share aside — desktop left side */}
      <aside className={`cf__share-aside ${isOpen ? 'cf__share-aside--open' : ''}`}>
        {shareCard}
        {followCards}
      </aside>

      <div className={`cf__panel ${isOpen ? 'cf__panel--open' : ''}`}>
        {inner}
      </div>
    </div>
  );
};

export default ContactForm;
