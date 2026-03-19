import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../context/LanguageContext';
import LANGUAGES from '../../i18n/languages';

const SEO = ({ title, description, keywords }) => {
  const { lang } = useLanguage();
  const { t } = useTranslation();
  const dir = LANGUAGES.find((l) => l.code === lang)?.dir || 'ltr';
  const fallbackKeywords = t('seo.homeKeywords');
  const resolvedDescription = description || 'Free online image tools by favIMG.';
  const resolvedKeywords = (typeof keywords === 'string' && keywords.trim()) ? keywords : fallbackKeywords;

  // Direct DOM write as an instant fallback — react-helmet-async batches its
  // updates and may lag a frame on re-renders that don't involve a full mount.
  // This ensures the browser tab title always reflects the current language
  // immediately when the user switches languages.
  useEffect(() => {
    if (title) document.title = title;

    let descriptionTag = document.querySelector('meta[name="description"]');
    if (!descriptionTag) {
      descriptionTag = document.createElement('meta');
      descriptionTag.setAttribute('name', 'description');
      document.head.appendChild(descriptionTag);
    }
    descriptionTag.setAttribute('content', resolvedDescription);

    let keywordsTag = document.querySelector('meta[name="keywords"]');
    if (!keywordsTag) {
      keywordsTag = document.createElement('meta');
      keywordsTag.setAttribute('name', 'keywords');
      document.head.appendChild(keywordsTag);
    }
    keywordsTag.setAttribute('content', resolvedKeywords);
  }, [title, resolvedDescription, resolvedKeywords]);

  // key={lang} forces react-helmet-async to treat each language as a fresh
  // <Helmet> instance, guaranteeing all meta tags are re-applied when the
  // language changes without a page reload.
  return (
    <Helmet key={lang}>
      <html lang={lang} dir={dir} />
      <title>{title}</title>
      <meta name="description" content={resolvedDescription} />
      <meta name="keywords" content={resolvedKeywords} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={resolvedDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content={lang} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={resolvedDescription} />
    </Helmet>
  );
};

export default SEO;