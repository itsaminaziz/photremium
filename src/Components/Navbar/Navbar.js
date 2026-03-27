import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useContact } from '../../context/ContactContext';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import './Navbar.css';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [langCloseSignal, setLangCloseSignal] = useState(0);
  const [sharePanelOpen, setSharePanelOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef(null);
  const dropdownHoverTimer = useRef(null);
  const copiedTimerRef = useRef(null);
  const isTouchDevice = useRef(false);
  const { t, localePath } = useLanguage();
  const { openContact } = useContact();
  const shareLabelRaw = t('common.share');
  const shareLabel = !shareLabelRaw || shareLabelRaw === 'common.share' ? 'Share' : shareLabelRaw;
  const shareTitle = document.title || 'photremium.com';
  const shareText = t('hero.heading') || 'photremium.com';
  const shareUrl = window.location.href;

  const handleOpenSharePanel = () => {
    setCopied(false);
    setSharePanelOpen(true);
  };

  const closeSharePanel = () => {
    setSharePanelOpen(false);
  };

  const normalizePath = (path) => {
    if (!path) return '/';
    const normalized = path.replace(/\/+$/, '');
    return normalized || '/';
  };

  const handleHomeOrLogoClick = (e) => {
    const currentPath = normalizePath(location.pathname);
    const localeHomePath = normalizePath(localePath('/'));
    const isOnHome = currentPath === '/' || currentPath === localeHomePath;

    if (isOnHome) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (mobileOpen) {
      setLangCloseSignal((prev) => prev + 1);
    }
    setMobileOpen(false);
    setDropdownOpen(false);
  };

  const handleNativeShare = async () => {
    const shareData = {
      title: shareTitle,
      text: shareText,
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        if (!navigator.canShare || navigator.canShare({ url: shareData.url })) {
          await navigator.share(shareData);
          return;
        }
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareData.url);
        setCopied(true);
        clearTimeout(copiedTimerRef.current);
        copiedTimerRef.current = setTimeout(() => setCopied(false), 1600);
        return;
      }

      window.prompt('Copy this link:', shareData.url);
    } catch (error) {
      if (error?.name !== 'AbortError') {
        console.error('Share failed:', error);
      }
    }
  };

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        window.prompt('Copy this link:', shareUrl);
      }
      setCopied(true);
      clearTimeout(copiedTimerRef.current);
      copiedTimerRef.current = setTimeout(() => setCopied(false), 1600);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  const handleSocialShare = (platform) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(shareTitle);
    const encodedText = encodeURIComponent(shareText);
    const targets = {
      whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      x: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
      email: `mailto:?subject=${encodedTitle}&body=${encodedText}%0A${encodedUrl}`,
      reddit: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
      pinterest: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedText}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    };

    const url = targets[platform];
    if (!url) return;

    window.open(url, '_blank', 'noopener,noreferrer,width=720,height=650');
  };

  // Detect touch so we skip hover handlers on mobile/tablet touch screens
  useEffect(() => {
    const markTouch = () => { isTouchDevice.current = true; };
    window.addEventListener('touchstart', markTouch, { once: true, passive: true });
    return () => window.removeEventListener('touchstart', markTouch);
  }, []);

  const handleDropdownEnter = () => {
    if (isTouchDevice.current) return;
    clearTimeout(dropdownHoverTimer.current);
    setDropdownOpen(true);
  };

  const handleDropdownLeave = () => {
    if (isTouchDevice.current) return;
    dropdownHoverTimer.current = setTimeout(() => setDropdownOpen(false), 150);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [location]);

  useEffect(() => {
    const onEsc = (e) => {
      if (e.key === 'Escape') {
        setSharePanelOpen(false);
      }
    };
    document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, []);

  useEffect(() => {
    document.body.style.overflow = sharePanelOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [sharePanelOpen]);

  useEffect(() => () => clearTimeout(copiedTimerRef.current), []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__container">
        {/* Logo */}
        <Link to={localePath('/')} className="navbar__logo" onClick={handleHomeOrLogoClick}>
          <img src={`${process.env.PUBLIC_URL}/Images/nav-logo.png`} alt="photremium.com" className="navbar__logo-img" />
        </Link>

        {/* Hamburger */}
        <button
          className={`navbar__hamburger ${mobileOpen ? 'active' : ''}`}
          onClick={() => {
            if (mobileOpen) {
              // Close lang switcher first, then close menu
              setLangCloseSignal(prev => prev + 1);
            }
            setMobileOpen(!mobileOpen);
          }}
          aria-label="Toggle navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Links */}
        <ul className={`navbar__links ${mobileOpen ? 'navbar__links--open' : ''}`}>
          {/* Row 1 (mobile only): Language switcher */}
          <li className="navbar__mobile-header">
            <LanguageSwitcher forceClose={langCloseSignal} />
          </li>
          <li>
            <Link
              to={localePath('/')}
              className={location.pathname === '/' || location.pathname === localePath('/') ? 'active' : ''}
              onClick={handleHomeOrLogoClick}
            >
              <i className="fa-solid fa-house"></i> {t('nav.home')}
            </Link>
          </li>
          <li>
            <Link to={localePath('/privacy-policy')} className={location.pathname === localePath('/privacy-policy') ? 'active' : ''}>
              <i className="fa-solid fa-shield-halved"></i> {t('footer.privacyPolicy')}
            </Link>
          </li>
          <li className="navbar__dropdown" ref={dropdownRef} onMouseEnter={handleDropdownEnter} onMouseLeave={handleDropdownLeave}>
            <button
              className={`navbar__dropdown-toggle ${dropdownOpen ? 'open' : ''}`}
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <i className="fa-solid fa-grip"></i> Tools
              <i className={`fa-solid fa-chevron-down navbar__chevron ${dropdownOpen ? 'rotate' : ''}`}></i>
            </button>
            <ul className={`navbar__dropdown-menu ${dropdownOpen ? 'navbar__dropdown-menu--open' : ''}`}>
              <li>
                <Link to={localePath('/image-converter')}>
                  <i className="fa-solid fa-right-left"></i> {t('nav.imageConverter')}
                </Link>
              </li>
              <li>
                <Link to={localePath('/image-compressor')}>
                  <i className="fa-solid fa-compress"></i> {t('nav.imageCompressor')}
                </Link>
              </li>
              <li>
                <Link to={localePath('/resize-image')}>
                  <i className="fa-solid fa-up-right-and-down-left-from-center"></i> {t('nav.resizeImage')}
                </Link>
              </li>
              <li>
                <Link to={localePath('/crop-image')}>
                  <i className="fa-solid fa-crop-simple"></i> {t('nav.cropImage')}
                </Link>
              </li>
              <li>
                <Link to={localePath('/remove-background')}>
                  <i className="fa-solid fa-eraser"></i> {t('nav.removeBackground')}
                </Link>
              </li>
              <li>
                <Link to={localePath('/watermark-image')}>
                  <i className="fa-solid fa-stamp"></i> {t('nav.watermarkImage')}
                </Link>
              </li>
              <li>
                <Link to={localePath('/qr-code-generator')}>
                  <i className="fa-solid fa-qrcode"></i> {t('nav.qrCodeGenerator')}
                </Link>
              </li>
              <li>
                <Link to={localePath('/qr-code-scanner')}>
                  <i className="fa-solid fa-expand"></i> {t('nav.qrCodeScanner')}
                </Link>
              </li>
              <li>
                <Link to={localePath('/face-blur')}>
                  <i className="fa-solid fa-face-dizzy"></i> {t('nav.faceBlur')}
                </Link>
              </li>
            </ul>
          </li>
          {/* Mobile: Contact Us button */}
          <li className="navbar__contact-mobile">
            <button className="navbar__contact-btn" onClick={() => { setMobileOpen(false); openContact(); }}>
              <i className="fa-solid fa-envelope"></i> Contact Us
            </button>
          </li>
          <li className="navbar__share-mobile">
            <button className="navbar__share-btn navbar__share-btn--mobile" onClick={() => { setMobileOpen(false); handleOpenSharePanel(); }}>
              <i className="fa-solid fa-share-nodes"></i> {shareLabel}
            </button>
          </li>
        </ul>
        {/* Desktop language switcher — always visible on desktop */}
        <div className="navbar__lang-desktop">
          <LanguageSwitcher />
        </div>
        {/* Desktop: Contact Us button */}
        <button className="navbar__contact-btn navbar__contact-btn--desktop" onClick={openContact}>
          <i className="fa-solid fa-envelope"></i> Contact
        </button>
        <button
          className="navbar__share-btn navbar__share-btn--desktop"
          onClick={handleOpenSharePanel}
          aria-label={shareLabel}
          title={shareLabel}
        >
          <i className="fa-solid fa-share-nodes"></i>
        </button>
      </div>
      {sharePanelOpen && (
        <div className="share-panel" role="dialog" aria-modal="true" aria-label="Share this page">
          <button className="share-panel__backdrop" aria-label="Close share panel" onClick={closeSharePanel}></button>
          <div className="share-panel__card">
            <button className="share-panel__close" aria-label="Close" onClick={closeSharePanel}>
              <span></span>
              <span></span>
            </button>

            <h3 className="share-panel__title">Share this page</h3>
            <p className="share-panel__subtitle">Choose a platform or copy the link below.</p>

            <div className="share-panel__icons">
              <button onClick={() => handleSocialShare('whatsapp')} className="share-icon share-icon--whatsapp" aria-label="Share on WhatsApp"><i className="fa-brands fa-whatsapp"></i><span>WhatsApp</span></button>
              <button onClick={() => handleSocialShare('facebook')} className="share-icon share-icon--facebook" aria-label="Share on Facebook"><i className="fa-brands fa-facebook-f"></i><span>Facebook</span></button>
              <button onClick={() => handleSocialShare('x')} className="share-icon share-icon--x" aria-label="Share on X"><i className="fa-brands fa-x-twitter"></i><span>X</span></button>
              <button onClick={() => handleSocialShare('email')} className="share-icon share-icon--email" aria-label="Share via Email"><i className="fa-solid fa-envelope"></i><span>Email</span></button>
              <button onClick={() => handleSocialShare('reddit')} className="share-icon share-icon--reddit" aria-label="Share on Reddit"><i className="fa-brands fa-reddit-alien"></i><span>Reddit</span></button>
              <button onClick={() => handleSocialShare('pinterest')} className="share-icon share-icon--pinterest" aria-label="Share on Pinterest"><i className="fa-brands fa-pinterest-p"></i><span>Pinterest</span></button>
              <button onClick={() => handleSocialShare('linkedin')} className="share-icon share-icon--linkedin" aria-label="Share on LinkedIn"><i className="fa-brands fa-linkedin-in"></i><span>LinkedIn</span></button>
            </div>

            <div className="share-panel__linkbox">
              <input className="share-panel__input" value={shareUrl} readOnly aria-label="Page link" />
              <button
                className={`share-panel__copy ${copied ? 'share-panel__copy--done' : ''}`}
                onClick={handleCopyLink}
                aria-label={copied ? 'Copied' : 'Copy link'}
              >
                {copied ? <i className="fa-solid fa-check"></i> : <i className="fa-regular fa-copy"></i>}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <button className="share-panel__native" onClick={handleNativeShare}>
              <i className="fa-solid fa-share-nodes"></i> Share now
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
