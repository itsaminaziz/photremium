import React, { useMemo } from 'react';
import SEO from '../SEO/SEO';
import { useLanguage } from '../../context/LanguageContext';
import LANGUAGES, { DEFAULT_LANG } from '../../i18n/languages';
import './SitemapPage.css';

const CONVERSION_SLUGS = [
  'png-to-jpg', 'jpg-to-png', 'png-to-webp', 'jpg-to-webp', 'webp-to-jpg',
  'webp-to-png', 'gif-to-jpg', 'gif-to-png', 'bmp-to-jpg', 'bmp-to-png',
  'svg-to-png', 'svg-to-jpg', 'tiff-to-jpg', 'tiff-to-png', 'jpg-to-gif',
  'png-to-gif', 'jpg-to-bmp', 'png-to-bmp', 'webp-to-gif', 'jpg-to-ico',
  'png-to-ico', 'jpg-to-svg', 'png-to-svg', 'webp-to-svg', 'gif-to-svg',
  'bmp-to-svg', 'tiff-to-svg',
];

const STATIC_ROUTES = [
  '/',
  '/about',
  '/image-converter',
  '/image-compressor',
  '/resize-image',
  '/crop-image',
  '/remove-background',
  '/watermark-image',
  '/qr-code-generator',
  '/qr-code-scanner',
  '/face-blur',
  '/privacy-policy',
  '/sitemap',
];

const BASE_URL = 'https://photremium.com';

const SitemapPage = () => {
  const { localePath } = useLanguage();

  const allRoutes = useMemo(
    () => [
      ...STATIC_ROUTES,
      ...CONVERSION_SLUGS.map((slug) => `/convert/${slug}`),
    ],
    []
  );

  const localizedUrls = useMemo(() => {
    const urls = [];

    for (const lang of LANGUAGES) {
      for (const route of allRoutes) {
        const path = lang.code === DEFAULT_LANG ? route : `/${lang.code}${route}`;
        urls.push({
          lang: lang.code,
          name: lang.name,
          url: `${BASE_URL}${path}`,
        });
      }
    }

    return urls;
  }, [allRoutes]);

  return (
    <>
      <SEO
        title="Sitemap | Photremium"
        description="Browse all Photremium URLs by language. Access XML sitemap for Google Search Console."
        keywords="sitemap, photremium.com sitemap, image tools sitemap, multilingual sitemap"
      />

      <section className="sitemap-page">
        <div className="sitemap-page__inner">
          <h1>Sitemap</h1>
          <p>
            Total URLs: <strong>{localizedUrls.length}</strong> ({allRoutes.length} pages × {LANGUAGES.length} languages)
          </p>

          <div className="sitemap-page__actions">
            <a href="/sitemap.xml" target="_blank" rel="noreferrer" className="sitemap-page__btn sitemap-page__btn--primary">
              Open sitemap.xml
            </a>
            <a href={localePath('/')} className="sitemap-page__btn sitemap-page__btn--ghost">
              Back to Home
            </a>
          </div>

          <div className="sitemap-page__table-wrap">
            <table className="sitemap-page__table">
              <thead>
                <tr>
                  <th>Language</th>
                  <th>URL</th>
                </tr>
              </thead>
              <tbody>
                {localizedUrls.map((item) => (
                  <tr key={`${item.lang}-${item.url}`}>
                    <td>{item.name} ({item.lang})</td>
                    <td>
                      <a href={item.url} target="_blank" rel="noreferrer">{item.url}</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
};

export default SitemapPage;
