import React from 'react';
import SEO from '../SEO/SEO';
import FAQ from '../FAQ/FAQ';
import { useLanguage } from '../../context/LanguageContext';
import './Pages.css';

const MemeGenerator = () => {
  const { t } = useLanguage();
  return (
  <>
    <SEO
      title={t('memeGenerator.seo.title')}
      description={t('memeGenerator.seo.desc')}
      keywords={t('memeGenerator.seo.keywords')}
    />
    <section className="page-section">
      <div className="page-container">
        <div className="product-hero">
          <div className="product-hero__icon" style={{ background: '#fdf4ff', color: '#d946ef' }}>
            <i className="fa-solid fa-face-laugh-squint"></i>
          </div>
          <h1>{t('memeGenerator.title')}</h1>
          <p>
            {t('memeGenerator.desc')}
          </p>
        </div>

        <div className="upload-area">
          <div className="upload-area__icon"><i className="fa-solid fa-cloud-arrow-up"></i></div>
          <h3>{t('common.dropHere')}</h3>
          <p>{t('common.or')} <span>{t('common.browseFiles')}</span> {t('memeGenerator.toCreateMeme')}</p>
        </div>

        <div className="features-list">
          <div className="feature-item">
            <i className="fa-solid fa-image"></i>
            <h4>{t('memeGenerator.popularTemplates')}</h4>
            <p>{t('memeGenerator.popularTemplatesDesc')}</p>
          </div>
          <div className="feature-item">
            <i className="fa-solid fa-font"></i>
            <h4>{t('memeGenerator.customCaptions')}</h4>
            <p>{t('memeGenerator.customCaptionsDesc')}</p>
          </div>
          <div className="feature-item">
            <i className="fa-solid fa-share-nodes"></i>
            <h4>{t('memeGenerator.easySharing')}</h4>
            <p>{t('memeGenerator.easySharingDesc')}</p>
          </div>
        </div>
      </div>
    </section>

    <FAQ faqKey="memeGenerator" />
  </>
  );
};

export default MemeGenerator;
