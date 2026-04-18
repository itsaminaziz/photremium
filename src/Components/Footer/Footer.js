import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useContact } from '../../context/ContactContext';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import './Footer.css';

const Footer = () => {
  const { t, localePath } = useLanguage();
  const { openContact } = useContact();

  return (
    <footer className="footer">
      <div className="footer__wave">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path d="M0,40 C360,100 1080,0 1440,60 L1440,100 L0,100 Z" fill="#1e1b4b" />
        </svg>
      </div>

      <div className="footer__body">
        <div className="footer__container">
          {/* Brand */}
          <div className="footer__brand">
            <Link to={localePath('/')} className="footer__logo">
              <img src={`${process.env.PUBLIC_URL}/Images/nav-logo.png`} alt="photremium.com" className="footer__logo-img" />
            </Link>
            <p className="footer__tagline">
              {t('footer.tagline')}
            </p>
            <div className="footer__socials">
              <a href="https://www.facebook.com/share/1Stks4NQcS/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <i className="fa-brands fa-facebook-f"></i>
              </a>
              <a href="https://twitter.com/photremium" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <i className="fa-brands fa-x-twitter"></i>
              </a>
              <a href="https://www.linkedin.com/in/photremium-pro-5103373b9 " target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <i className="fa-brands fa-linkedin"></i>
              </a>
              <a href="https://instagram.com/photremium" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href="https://tiktok.com/@photremium" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                <i className="fa-brands fa-tiktok"></i>
              </a>
              <a href="https://www.youtube.com/channel/UCad9bW8bwTHTwvBj2DxmMeg" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <i className="fa-brands fa-youtube"></i>
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="footer__col">
            <h4>{t('footer.imageTools')}</h4>
            <ul>
              <li><Link to={localePath('/image-converter')}><i className="fa-solid fa-right-left"></i> {t('nav.imageConverter')}</Link></li>
              <li><Link to={localePath('/image-compressor')}><i className="fa-solid fa-compress"></i> {t('nav.imageCompressor')}</Link></li>
              <li><Link to={localePath('/resize-image')}><i className="fa-solid fa-up-right-and-down-left-from-center"></i> {t('nav.resizeImage')}</Link></li>
              <li><Link to={localePath('/crop-image')}><i className="fa-solid fa-crop-simple"></i> {t('nav.cropImage')}</Link></li>
            </ul>
          </div>

          <div className="footer__col">
            <h4>{t('footer.moreTools')}</h4>
            <ul>
              <li><Link to={localePath('/remove-background')}><i className="fa-solid fa-eraser"></i> {t('nav.removeBackground')}</Link></li>
              <li><Link to={localePath('/watermark-image')}><i className="fa-solid fa-stamp"></i> {t('nav.watermarkImage')}</Link></li>
              <li><Link to={localePath('/qr-code-generator')}><i className="fa-solid fa-qrcode"></i> {t('nav.qrCodeGenerator')}</Link></li>
              <li><Link to={localePath('/qr-code-scanner')}><i className="fa-solid fa-expand"></i> {t('nav.qrCodeScanner')}</Link></li>
              <li><Link to={localePath('/face-blur')}><i className="fa-solid fa-face-dizzy"></i> {t('nav.faceBlur')}</Link></li>
            </ul>
          </div>

          <div className="footer__col">
            <h4>{t('footer.company')}</h4>
            <ul>
              <li><Link to={localePath('/about')}><i className="fa-solid fa-circle-info"></i> {t('nav.aboutUs')}</Link></li>
              <li><Link to={localePath('/')}><i className="fa-solid fa-house"></i> {t('nav.home')}</Link></li>
            </ul>

            <h4 style={{ marginTop: 24 }}>{t('footer.contact')}</h4>
            <ul>
              <li>
                <a href="mailto:contact@photremium.com"><i className="fa-solid fa-envelope"></i> contact@photremium.com</a>
              </li>
              <li>
                <button className="footer__contact-btn" onClick={openContact}>
                  <i className="fa-solid fa-envelope"></i> Contact Us
                </button>
              </li>
            </ul>

          </div>
        </div>

        <div className="footer__bottom">
          <p>&copy; {new Date().getFullYear()} photremium.com. {t('footer.allRightsReserved')}</p>
          <div className="footer__bottom-lang">
            <LanguageSwitcher variant="footer" />
          </div>
          <div className="footer__bottom-links">
            <Link to={localePath('/privacy-policy')}>{t('footer.privacyPolicy')}</Link>
            <Link to={localePath('/')}>{t('footer.termsOfService')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;