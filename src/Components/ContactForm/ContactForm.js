import React, { useState, useRef, useEffect, useCallback } from 'react';
import emailjs from '@emailjs/browser';
import { useContact } from '../../context/ContactContext';
import './ContactForm.css';

const SERVICE_ID  = 'service_esd9oub';
const TEMPLATE_ID = 'template_unwmjrn';
const PUBLIC_KEY  = 'FEcjzlxKefYWCa1O0';

const EMPTY = { name: '', gmail: '', subject: '', message: '' };

const ContactForm = ({ mode = 'popup' }) => {
  const { isOpen, closeContact } = useContact();
  const [form, setForm]       = useState(EMPTY);
  const [errors, setErrors]   = useState({});
  const [status, setStatus]   = useState('idle'); // idle | sending | success | error
  const overlayRef            = useRef(null);

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
    if (!form.name.trim())    e.name    = 'Name is required';
    if (!form.gmail.trim())   e.gmail   = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.gmail)) e.gmail = 'Enter a valid email';
    if (!form.subject.trim()) e.subject = 'Subject is required';
    if (!form.message.trim()) e.message = 'Message is required';
    return e;
  }, [form]);

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
          <span className="cf__badge"><i className="fa-solid fa-envelope-open-text"></i> Get in Touch</span>
          <h2 className="cf__title">Contact Us</h2>
          <p className="cf__subtitle">We'd love to hear from you. Drop us a message!</p>
        </div>
        {mode === 'popup' && (
          <button className="cf__close" onClick={closeContact} aria-label="Close">
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
          <h3>Message Sent!</h3>
          <p>Thanks for reaching out. We'll get back to you soon.</p>
          <button className="cf__btn cf__btn--send" onClick={handleReset}>
            Send Another
          </button>
        </div>
      ) : (
        <form className="cf__form" onSubmit={handleSubmit} noValidate>
          {/* Name & Gmail side by side on wider screens */}
          <div className="cf__row">
            <div className={`cf__field ${errors.name ? 'cf__field--error' : ''}`}>
              <label htmlFor={`cf-name-${mode}`}>
                <i className="fa-solid fa-user"></i> Name
              </label>
              <input
                id={`cf-name-${mode}`}
                type="text"
                name="name"
                placeholder="Your full name"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
              />
              {errors.name && <span className="cf__error">{errors.name}</span>}
            </div>

            <div className={`cf__field ${errors.gmail ? 'cf__field--error' : ''}`}>
              <label htmlFor={`cf-gmail-${mode}`}>
                <i className="fa-solid fa-envelope"></i> Email
              </label>
              <input
                id={`cf-gmail-${mode}`}
                type="email"
                name="gmail"
                placeholder="you@gmail.com"
                value={form.gmail}
                onChange={handleChange}
                autoComplete="email"
              />
              {errors.gmail && <span className="cf__error">{errors.gmail}</span>}
            </div>
          </div>

          <div className={`cf__field ${errors.subject ? 'cf__field--error' : ''}`}>
            <label htmlFor={`cf-subject-${mode}`}>
              <i className="fa-solid fa-tag"></i> Subject
            </label>
            <input
              id={`cf-subject-${mode}`}
              type="text"
              name="subject"
              placeholder="What's this about?"
              value={form.subject}
              onChange={handleChange}
            />
            {errors.subject && <span className="cf__error">{errors.subject}</span>}
          </div>

          <div className={`cf__field ${errors.message ? 'cf__field--error' : ''}`}>
            <label htmlFor={`cf-message-${mode}`}>
              <i className="fa-solid fa-message"></i> Message
            </label>
            <textarea
              id={`cf-message-${mode}`}
              name="message"
              placeholder="Write your message here…"
              rows={mode === 'popup' ? 4 : 6}
              value={form.message}
              onChange={handleChange}
            />
            {errors.message && <span className="cf__error">{errors.message}</span>}
          </div>

          {status === 'error' && (
            <p className="cf__send-error">
              <i className="fa-solid fa-triangle-exclamation"></i> Something went wrong. Please try again.
            </p>
          )}

          <div className="cf__actions">
            {mode === 'popup' && (
              <button type="button" className="cf__btn cf__btn--cancel" onClick={closeContact}>
                <i className="fa-solid fa-xmark"></i> Cancel
              </button>
            )}
            <button type="submit" className="cf__btn cf__btn--send" disabled={status === 'sending'}>
              {status === 'sending' ? (
                <><i className="fa-solid fa-circle-notch fa-spin"></i> Sending…</>
              ) : (
                <><i className="fa-solid fa-paper-plane"></i> Send Message</>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );

  /* ---------- Section mode (Home page) ---------- */
  if (mode === 'section') {
    return (
      <section className="cf__section-wrapper">
        <div className="cf__section-bg-glow" aria-hidden="true" />
        {inner}
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
      <div className={`cf__panel ${isOpen ? 'cf__panel--open' : ''}`}>
        {inner}
      </div>
    </div>
  );
};

export default ContactForm;
