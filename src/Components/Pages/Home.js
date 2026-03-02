import React from 'react';
import SEO from '../SEO/SEO';
import HeroCards from '../HeroCards/HeroCards';
import WhyChooseUs from '../WhyChooseUs/WhyChooseUs';
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
      <WhyChooseUs />
    </>
  );
};

export default Home;
