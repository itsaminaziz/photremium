import React from 'react';
import SEO from '../SEO/SEO';
import FAQ from '../FAQ/FAQ';
import { useLanguage } from '../../context/LanguageContext';
import './Pages.css';

const UpscaleImage = () => {
  const { t } = useLanguage();
  return (
  <>
    <SEO
      title={t('upscaleImage.seo.title')}
      description={t('upscaleImage.seo.desc')}
      keywords={t('seo.homeKeywords')}
    />
    <section className="page-section">
      <div className="page-container">
        <div className="product-hero">
          <div className="product-hero__icon" style={{ background: '#f0fdf4', color: '#22c55e' }}>
            <i className="fa-solid fa-magnifying-glass-plus"></i>
          </div>
          <h1>{t('upscaleImage.title')}</h1>
          <p>
            {t('upscaleImage.desc')}
          </p>
        </div>

        <div className="upload-area">
          <div className="upload-area__icon"><i className="fa-solid fa-cloud-arrow-up"></i></div>
          <h3>{t('common.dropHere')}</h3>
          <p>{t('common.or')} <span>{t('common.browseFiles')}</span> {t('upscaleImage.toUpscale')}</p>
        </div>

        <div className="features-list">
          <div className="feature-item">
            <i className="fa-solid fa-brain"></i>
            <h4>{t('upscaleImage.aiEnhancement')}</h4>
            <p>{t('upscaleImage.aiEnhancementDesc')}</p>
          </div>
          <div className="feature-item">
            <i className="fa-solid fa-expand"></i>
            <h4>{t('upscaleImage.upTo4x')}</h4>
            <p>{t('upscaleImage.upTo4xDesc')}</p>
          </div>
          <div className="feature-item">
            <i className="fa-solid fa-image"></i>
            <h4>{t('upscaleImage.multipleFormats')}</h4>
            <p>{t('upscaleImage.multipleFormatsDesc')}</p>
          </div>
        </div>
      </div>
    </section>

    <FAQ faqKey="upscaleImage" />
  </>
  );
};

export default UpscaleImage;