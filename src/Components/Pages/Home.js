import React from 'react';
import SEO from '../SEO/SEO';
import HeroCards from '../HeroCards/HeroCards';
import ToolsShowcase from '../ToolsShowcase/ToolsShowcase';
import ShowcaseSection from '../ShowcaseSection/ShowcaseSection';
import ContactForm from '../ContactForm/ContactForm';
import HomePasteAssistant from '../HomePasteAssistant/HomePasteAssistant';
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
      <HomePasteAssistant />
      <HeroCards />
      <ToolsShowcase />
      <ShowcaseSection />
      <ContactForm mode="section" />
    </>
  );
};

export default Home;
