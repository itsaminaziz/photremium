import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../context/LanguageContext';
import './NotFound.css';

const TOOLS = [
  { icon: 'fa-solid fa-right-left',   label: 'Convert',   path: '/image-converter' },
  { icon: 'fa-solid fa-compress',      label: 'Compress',  path: '/image-compressor' },
  { icon: 'fa-solid fa-crop-simple',   label: 'Crop',      path: '/crop-image' },
  { icon: 'fa-solid fa-eraser',        label: 'Remove BG', path: '/remove-background' },
  { icon: 'fa-solid fa-qrcode',        label: 'QR Code',   path: '/qr-code-generator' },
];

const NotFound = () => {
  const { localePath } = useLanguage();
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>404 – Page Not Found | photremium.com</title>
        <meta name="keywords" content={t('seo.homeKeywords')} />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="nf">
        <div className="nf__grid" aria-hidden="true" />

        <div className="nf__scene" aria-hidden="true">
          <div className="nf__halo" />
          <div className="nf__ring nf__ring--outer" />
          <div className="nf__ring nf__ring--middle" />
          <div className="nf__ring nf__ring--inner" />

          <div className="nf__orbit nf__orbit--1"><span></span></div>
          <div className="nf__orbit nf__orbit--2"><span></span></div>
          <div className="nf__orbit nf__orbit--3"><span></span></div>

          <div className="nf__center">
            <i className="fa-solid fa-image"></i>
          </div>
        </div>

        <p className="nf__code" data-text="404">404</p>

        <h1 className="nf__title">Oops! This page doesn't exist</h1>
        <p className="nf__sub">
          This link drifted out of frame. Jump back home or launch a tool and keep
          creating without interruption.
        </p>

        <div className="nf__actions">
          <Link to={localePath('/')} className="nf__btn nf__btn--primary">
            <i className="fa-solid fa-house"></i> Back to Home
          </Link>
          <Link to={localePath('/image-converter')} className="nf__btn nf__btn--ghost">
            <i className="fa-solid fa-right-left"></i> Try a Tool
          </Link>
        </div>

        <div className="nf__tools-row" aria-label="Quick links to tools">
          {TOOLS.map((tool) => (
            <Link key={tool.path} to={localePath(tool.path)} className="nf__chip">
              <i className={tool.icon}></i>
              {tool.label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default NotFound;
