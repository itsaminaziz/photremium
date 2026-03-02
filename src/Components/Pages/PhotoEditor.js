import React from 'react';
import SEO from '../SEO/SEO';
import FAQ from '../FAQ/FAQ';
import { useLanguage } from '../../context/LanguageContext';
import './Pages.css';

const PhotoEditor = () => {
  const { t } = useLanguage();
  return (
  <>
    <SEO
      title={t('photoEditor.seo.title')}
      description={t('photoEditor.seo.desc')}
      keywords={t('photoEditor.seo.keywords')}
    />
    <section className="page-section">
      <div className="page-container">
        <div className="product-hero">
          <div className="product-hero__icon" style={{ background: '#fdf2f8', color: '#ec4899' }}>
            <i className="fa-solid fa-pen-to-square"></i>
          </div>
          <h1>{t('photoEditor.title')}</h1>
          <p>
            {t('photoEditor.desc')}
          </p>
        </div>

        <div className="upload-area">
          <div className="upload-area__icon"><i className="fa-solid fa-cloud-arrow-up"></i></div>
          <h3>{t('common.dropHere')}</h3>
          <p>{t('common.or')} <span>{t('common.browseFiles')}</span> {t('photoEditor.toEdit')}</p>
        </div>

        <div className="features-list">
          <div className="feature-item">
            <i className="fa-solid fa-font"></i>
            <h4>{t('photoEditor.textTypography')}</h4>
            <p>{t('photoEditor.textTypographyDesc')}</p>
          </div>
          <div className="feature-item">
            <i className="fa-solid fa-wand-magic-sparkles"></i>
            <h4>{t('photoEditor.filtersEffects')}</h4>
            <p>{t('photoEditor.filtersEffectsDesc')}</p>
          </div>
          <div className="feature-item">
            <i className="fa-solid fa-border-all"></i>
            <h4>{t('photoEditor.framesStickers')}</h4>
            <p>{t('photoEditor.framesStickersDesc')}</p>
          </div>
        </div>
      </div>
    </section>

    <FAQ faqKey="photoEditor" />
  </>
  );
};

export default PhotoEditor;
