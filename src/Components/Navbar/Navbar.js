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
  const { t, localePath } = useLanguage();
  const { openContact } = useContact();

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
          {/* Mobile menu header: language switcher + close button */}
          <li className="navbar__mobile-header">
            <LanguageSwitcher forceClose={langCloseSignal} />
            <button
              className="navbar__mobile-close"
            >
            </button>
          </li>
          <li>
            <Link to={localePath('/')} className={location.pathname === '/' || location.pathname === localePath('/') ? 'active' : ''}>
              <i className="fa-solid fa-house"></i> {t('nav.home')}
            </Link>
          </li>
          <li>
            <Link to={localePath('/image-converter')} className={location.pathname.includes('/image-converter') ? 'active' : ''}>
              <i className="fa-solid fa-right-left"></i> {t('nav.imageConverter')}
            </Link>
          </li>
          <li>
            <Link to={localePath('/image-compressor')} className={location.pathname.includes('/image-compressor') ? 'active' : ''}>
              <i className="fa-solid fa-compress"></i> {t('nav.imageCompressor')}
            </Link>
          </li>
          <li className="navbar__dropdown" ref={dropdownRef}>
            <button
              className={`navbar__dropdown-toggle ${dropdownOpen ? 'open' : ''}`}
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <i className="fa-solid fa-ellipsis"></i> {t('nav.otherTools')}
              <i className={`fa-solid fa-chevron-down navbar__chevron ${dropdownOpen ? 'rotate' : ''}`}></i>
            </button>
            <ul className={`navbar__dropdown-menu ${dropdownOpen ? 'navbar__dropdown-menu--open' : ''}`}>
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
        </ul>
        {/* Desktop language switcher — always visible on desktop */}
        <div className="navbar__lang-desktop">
          <LanguageSwitcher />
        </div>
        {/* Desktop: Contact Us button */}
        <button className="navbar__contact-btn navbar__contact-btn--desktop" onClick={openContact}>
          <i className="fa-solid fa-envelope"></i> Contact
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
