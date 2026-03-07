import React from 'react';
import SEO from '../SEO/SEO';
import HeroCards from '../HeroCards/HeroCards';
import ShowcaseSection from '../ShowcaseSection/ShowcaseSection';
import ContactForm from '../ContactForm/ContactForm';
import { useLanguage } from '../../context/LanguageContext';

const Home = () => {
  const { t } = useLanguage();

  return (
    <>
      <SEO
        title={t('seo.homeTitle')}
        description={t('seo.homeDesc')}
        keywords={t('seo.homeKeywords')}
      />
      <HeroCards />
      <ShowcaseSection />
      <ContactForm mode="section" />
    </>
  );
};

export default Home;
