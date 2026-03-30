import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import './HeroCards.css';

const toolKeys = [
  { key: 'compressImage', image: 'image-compressor.webp', link: '/image-compressor' },
  { key: 'resizeImage',   image: 'image-resizer.webp',    link: '/resize-image' },
  { key: 'cropImage',     image: 'image-croper.webp',     link: '/crop-image' },
  { key: 'convertToJpg',  image: 'convert-to-jpg.webp',   link: '/image-converter' },
  { key: 'convertFromJpg',image: 'convert-from-jpg.webp',  link: '/image-converter' },
  { key: 'qrCodeGenerator', image: 'qr-code-generator.webp', link: '/qr-code-generator' },
  { key: 'qrCodeScanner', image: 'qr-code-scanner.webp',  link: '/qr-code-scanner', badge: true },
  { key: 'blurFace',      image: 'blur-face.webp',        link: '/face-blur', badge: true },
  { key: 'removeBackground', image: 'background-remover.webp', link: '/remove-background', badge: true },
  { key: 'watermarkImage', image: 'watermark-image.webp',  link: '/watermark-image' },
];

const HeroCards = () => {
  const { t, localePath } = useLanguage();

  return (
    <section className="hero-bg" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/Images/hero.webp)` }}>
      <div className="hero-cards">
      <div className="hero-cards__header">
        <h1>{t('hero.heading')}</h1>
        <p>{t('hero.subheading')}</p>
      </div>

      <div className="hero-cards__grid">
        {toolKeys.map((tool, i) => {
          const data = t(`tools.${tool.key}`);
          return (
            <Link to={localePath(tool.link)} key={i} className="hero-card">
              {tool.badge && <span className="hero-card__badge">{t('common.new')}</span>}
              <div className="hero-card__icon">
                <img src={`${process.env.PUBLIC_URL}/Images/${tool.image}`} alt={data.title || tool.key} className="hero-card__img" />
              </div>
              <h3 className="hero-card__title">{data.title || tool.key}</h3>
              <p className="hero-card__desc">{data.desc || ''}</p>
            </Link>
          );
        })}
      </div>
      </div>
    </section>
  );
};

export default HeroCards;