import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import './WhyChooseUs.css';

const reasonKeys = [
  { key: 'fast', icon: 'fa-solid fa-bolt', color: '#f59e0b', bg: '#fffbeb' },
  { key: 'private', icon: 'fa-solid fa-lock', color: '#10b981', bg: '#ecfdf5' },
  { key: 'noLimits', icon: 'fa-solid fa-infinity', color: '#6366f1', bg: '#eef2ff' },
  { key: 'quality', icon: 'fa-solid fa-paintbrush', color: '#ec4899', bg: '#fdf2f8' },
  { key: 'batch', icon: 'fa-solid fa-layer-group', color: '#0ea5e9', bg: '#e0f2fe' },
  { key: 'everywhere', icon: 'fa-solid fa-mobile-screen-button', color: '#8b5cf6', bg: '#f5f3ff' },
];

const WhyChooseUs = () => {
  const { t } = useLanguage();

  return (
    <section className="why-choose">
      <div className="why-choose__container">
        <div className="why-choose__header">
          <span className="why-choose__label">
            <i className="fa-solid fa-star"></i> {t('whyChoose.label')}
          </span>
          <h2>{t('whyChoose.heading')}</h2>
          <p>{t('whyChoose.subheading')}</p>
        </div>

        <div className="why-choose__grid">
          {reasonKeys.map((r, i) => {
            const data = t(`whyChoose.reasons.${r.key}`);
            return (
              <div className="why-choose__card" key={i}>
                <div className="why-choose__icon" style={{ background: r.bg, color: r.color }}>
                  <i className={r.icon}></i>
                </div>
                <h3>{data.title || r.key}</h3>
                <p>{data.desc || ''}</p>
              </div>
            );
          })}
        </div>

        {/* Stats */}
        <div className="why-choose__stats">
          <div className="why-choose__stat">
            <strong>5M+</strong>
            <span>{t('whyChoose.stats.imagesProcessed')}</span>
          </div>
          <div className="why-choose__stat">
            <strong>120+</strong>
            <span>{t('whyChoose.stats.countriesServed')}</span>
          </div>
          <div className="why-choose__stat">
            <strong>99.9%</strong>
            <span>{t('whyChoose.stats.uptime')}</span>
          </div>
          <div className="why-choose__stat">
            <strong>10+</strong>
            <span>{t('whyChoose.stats.freeTools')}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;