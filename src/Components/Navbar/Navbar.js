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
  const location = useLocation();
  const dropdownRef = useRef(null);
  const dropdownHoverTimer = useRef(null);
  const isTouchDevice = useRef(false);
  const { t, localePath } = useLanguage();
  const { openContact } = useContact();
  const shareLabelRaw = t('common.share');
  const shareLabel = !shareLabelRaw || shareLabelRaw === 'common.share' ? 'Share' : shareLabelRaw;

  const handleShare = async () => {
    const shareData = {
      title: document.title || 'favIMG',
      text: t('hero.heading') || 'favIMG',
      url: window.location.href,
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
        return;
      }

      window.prompt('Copy this link:', shareData.url);
    } catch (error) {
      if (error?.name !== 'AbortError') {
        console.error('Share failed:', error);
      }
    }
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
        <Link to={localePath('/')} className="navbar__logo">
          <img src={`${process.env.PUBLIC_URL}/Images/nav-logo.png`} alt="favIMG" className="navbar__logo-img" />
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
            <Link to={localePath('/')} className={location.pathname === '/' || location.pathname === localePath('/') ? 'active' : ''}>
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
              <li>
                <Link to={localePath('/about')}>
                  <i className="fa-solid fa-circle-info"></i> {t('nav.aboutUs')}
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
            <button className="navbar__share-btn navbar__share-btn--mobile" onClick={() => { setMobileOpen(false); handleShare(); }}>
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
          onClick={handleShare}
          aria-label={shareLabel}
          title={shareLabel}
        >
          <i className="fa-solid fa-share-nodes"></i>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
