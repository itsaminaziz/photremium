import React from 'react';
import SEO from '../SEO/SEO';
import { useLanguage } from '../../context/LanguageContext';
import './Pages.css';

const About = () => {
  const { t } = useLanguage();

  return (
    <>
      <SEO
        title={t('seo.aboutTitle')}
        description={t('seo.aboutDesc')}
        keywords={t('seo.aboutKeywords')}
      />

      <section className="page-section">
        <div className="page-container">
          <div className="page-header">
            <span className="page-label">
              <i className="fa-solid fa-circle-info"></i> {t('about.label')}
            </span>
            <h1>{t('about.heading')}</h1>
            <p>{t('about.subheading')}</p>
          </div>

          <div className="about-grid">
            <div className="about-card about-card--full">
              <div className="about-card__icon" style={{ background: '#eef2ff', color: '#4f46e5' }}>
                <i className="fa-solid fa-rocket"></i>
              </div>
              <h2>{t('about.missionTitle')}</h2>
              <p>{t('about.missionText')}</p>
            </div>

            <div className="about-card">
              <div className="about-card__icon" style={{ background: '#ecfdf5', color: '#10b981' }}>
                <i className="fa-solid fa-shield-halved"></i>
              </div>
              <h3>{t('about.privacyTitle')}</h3>
              <p>{t('about.privacyText')}</p>
            </div>

            <div className="about-card">
              <div className="about-card__icon" style={{ background: '#fff7ed', color: '#f59e0b' }}>
                <i className="fa-solid fa-code"></i>
              </div>
              <h3>{t('about.techTitle')}</h3>
              <p>{t('about.techText')}</p>
            </div>

            <div className="about-card">
              <div className="about-card__icon" style={{ background: '#fdf2f8', color: '#ec4899' }}>
                <i className="fa-solid fa-heart"></i>
              </div>
              <h3>{t('about.communityTitle')}</h3>
              <p>{t('about.communityText')}</p>
            </div>

            <div className="about-card">
              <div className="about-card__icon" style={{ background: '#f5f3ff', color: '#8b5cf6' }}>
                <i className="fa-solid fa-globe"></i>
              </div>
              <h3>{t('about.globalTitle')}</h3>
              <p>{t('about.globalText')}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
