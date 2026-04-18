import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../../context/LanguageContext';
import './PrivacyPolicy.css';

/* ------------------------------------------------------------------ */
/*  Static data — policy sections                                       */
/* ------------------------------------------------------------------ */

const TRUST_CARD_META = [
  { icon: 'fa-solid fa-server', bg: '#eff6ff', color: '#2563eb' },
  { icon: 'fa-solid fa-database', bg: '#f0fdf4', color: '#16a34a' },
  { icon: 'fa-solid fa-eye-slash', bg: '#fdf4ff', color: '#9333ea' },
  { icon: 'fa-solid fa-shield-halved', bg: '#fff7ed', color: '#ea580c' },
];

const TOC_META = [
  { id: 'overview', icon: 'fa-solid fa-list' },
  { id: 'no-upload', icon: 'fa-solid fa-server' },
  { id: 'data-collect', icon: 'fa-solid fa-database' },
  { id: 'cookies', icon: 'fa-solid fa-cookie-bite' },
  { id: 'third-party', icon: 'fa-solid fa-puzzle-piece' },
  { id: 'analytics', icon: 'fa-solid fa-chart-bar' },
  { id: 'children', icon: 'fa-solid fa-child-reaching' },
  { id: 'rights', icon: 'fa-solid fa-scale-balanced' },
  { id: 'security', icon: 'fa-solid fa-lock' },
  { id: 'changes', icon: 'fa-solid fa-bell' },
  { id: 'contact', icon: 'fa-solid fa-envelope' },
];

const DEFAULT_PP = {
  seo: {
    title: 'Privacy Policy — Photremium | No Server Uploads, Zero Data Storage',
    description: "Photremium's Privacy Policy explains how we protect your privacy. All image processing happens 100% in your browser — no file uploads to any server, no personal data collected, no tracking.",
    ogTitle: 'Privacy Policy — Photremium | No Uploads, Zero Storage',
    ogDescription: 'Your files stay on your device. Photremium processes all images locally in your browser with no server contact, no data stored, and no tracking.',
    twitterTitle: 'Privacy Policy — Photremium',
    twitterDescription: '100% browser-based image tools. No uploads, no storage, no tracking. Read our full privacy policy.',
    schemaName: 'Privacy Policy - Photremium',
    schemaDescription: 'Photremium Privacy Policy - no server uploads, no data stored, 100% in-browser image processing.',
  },
  hero: {
    badge: 'Privacy Policy',
    titlePrefix: 'Your Privacy Is Our',
    titleHighlight: 'Top Priority',
    subPrefix: 'photremium.com is built on a simple principle —',
    subStrong: 'your files never leave your device',
    subSuffix: 'Every image tool on this site runs entirely inside your browser. No uploads. No cloud. No compromise.',
    effectiveLabel: 'Effective',
    lastUpdatedLabel: 'Last updated',
    worldwideLabel: 'Applies worldwide',
  },
  trustCards: [
    { title: 'No Server Uploads', desc: 'Your files never leave your device. All processing is 100% in-browser.' },
    { title: 'Zero Data Storage', desc: 'We store nothing about you, your images, or your activity.' },
    { title: 'No Tracking', desc: 'No behavioral tracking, no fingerprinting, no profiling.' },
    { title: 'GDPR Friendly', desc: 'Designed from the ground up to respect global privacy regulations.' },
  ],
  contentsTitle: 'Contents',
  toc: {
    overview: 'Overview',
    'no-upload': 'No Server Processing',
    'data-collect': 'Data We Collect',
    cookies: 'Cookies & Storage',
    'third-party': 'Third-Party Services',
    analytics: 'Analytics',
    children: "Children's Privacy",
    rights: 'Your Rights',
    security: 'Security',
    changes: 'Policy Changes',
    contact: 'Contact Us',
  },
  sections: {
    overview: {
      title: '1. Overview',
      subtitle: 'What this policy covers',
      p1Prefix: 'This Privacy Policy describes how',
      p1Middle: '("we", "us", or "our") handles - or more accurately,',
      p1Italic: "doesn't handle",
      p1Suffix: 'your personal information when you use our free online image tools at',
      p2: 'Unlike traditional web applications that send files to remote servers for processing, photremium.com uses modern browser APIs (Canvas API, WebAssembly, WebWorkers) to perform every operation locally on your device. The result: no data transmission, no storage, no risk.',
      calloutLabel: 'Plain English summary:',
      calloutText: "We can't see your images, we don't want to, and our technology is specifically engineered so that we never could.",
    },
    noUpload: {
      title: '2. No Server Processing — Ever',
      subtitle: 'How our tools actually work',
      introPrefix: 'Every tool on photremium.com — image converter, compressor, resizer, background remover, face blur, watermark, crop, and QR code tools — processes your files',
      introStrong: '100% inside your web browser',
      introSuffix: 'using client-side JavaScript and WebAssembly.',
      points: [
        { label: 'No file upload ever occurs.', text: "When you select a file, it is read by your browser's File API and processed in memory — it is never sent over the network." },
        { label: 'No server receives your image.', text: 'Our CDN only serves the HTML, CSS, and JavaScript assets needed to run the app — not your files.' },
        { label: 'No temporary storage.', text: 'Processed results exist only in your browser memory and are released when you close or navigate away from the page.' },
        { label: 'Works offline.', text: 'Most tools continue to function without an internet connection after the initial page load — further proof no server is involved.' },
      ],
      callout: 'You can verify this yourself: open your browser Network tab in Developer Tools, select an image, and confirm that no file data is transmitted to any external server.',
    },
    dataCollect: {
      title: "3. Data We Collect (and Don't Collect)",
      subtitle: 'Full transparency on data practices',
      headers: { type: 'Data Type', collected: 'Collected?', whereWhy: 'Where / Why' },
      rows: [
        { type: 'Your images / files', badge: 'Never', variant: 'green', showX: true, whereWhy: 'Processed entirely in your browser — never transmitted' },
        { type: 'Name / email address', badge: 'Never', variant: 'green', showX: true, whereWhy: 'No account or sign-up is required to use any tool' },
        { type: 'IP address', badge: 'Minimal', variant: 'gray', showX: false, whereWhy: 'Standard web server logs retained <= 30 days, not tied to identity' },
        { type: 'Browser / OS type', badge: 'Minimal', variant: 'gray', showX: false, whereWhy: 'Sent by your browser automatically; used only for compatibility' },
        { type: 'Pages visited / clicks', badge: 'Aggregated', variant: 'blue', showX: false, whereWhy: 'Anonymous analytics only (no personal identification)' },
        { type: 'Language preference', badge: 'Local only', variant: 'blue', showX: false, whereWhy: 'Saved to localStorage on your device — never sent to us' },
        { type: 'Payment / financial data', badge: 'Never', variant: 'green', showX: true, whereWhy: 'photremium.com is completely free with no payments required' },
      ],
    },
    cookies: {
      title: '4. Cookies & Local Storage',
      subtitle: 'What gets stored on your device',
      intro: 'photremium.com uses no advertising cookies, no cross-site tracking cookies, and no third-party cookies. The only browser storage we use is for essential site functionality.',
      points: [
        { label: 'Language preference', text: 'Stored in localStorage so the site remembers your preferred language between visits. Never sent to our servers.' },
        { label: 'Theme / UI preferences', text: 'If you set a display preference, it is saved locally on your device only.' },
        { label: 'No session cookies.', text: 'photremium.com has no login system, so no session ID cookies are ever written.' },
      ],
      callout: 'You can clear all photremium.com local storage at any time via your browser settings (Settings -> Privacy -> Clear browsing data -> Cached data & cookies). Doing so has no effect on your ability to use the tools.',
    },
    thirdParty: {
      title: '5. Third-Party Services',
      subtitle: 'External services we use and why',
      intro: 'photremium.com uses a minimal set of trusted third-party services strictly for infrastructure and performance. None of these services receive your images or any personally identifiable information.',
      headers: { service: 'Service', purpose: 'Purpose', dataShared: 'Data Shared', privacyPolicy: 'Privacy Policy' },
      rows: [
        { service: 'Cloudflare Pages', purpose: 'Hosting & CDN delivery of site assets', dataShared: 'IP address, HTTP headers (standard)', privacyLink: 'https://www.cloudflare.com/privacypolicy/', privacyText: 'cloudflare.com/privacypolicy' },
        { service: 'Font Awesome', purpose: 'Icon fonts loaded from CDN', dataShared: 'IP address (CSS request only)', privacyLink: 'https://fontawesome.com/privacy', privacyText: 'fontawesome.com/privacy' },
        { service: 'Google Fonts', purpose: 'Typeface loading (if applicable)', dataShared: 'IP address (font request only)', privacyLink: 'https://policies.google.com/privacy', privacyText: 'policies.google.com' },
      ],
      outro: 'We do not share your data with advertisers, data brokers, or any other third party beyond the infrastructure providers listed above.',
    },
    analytics: {
      title: '6. Analytics',
      subtitle: 'Aggregate, privacy-respecting usage data',
      introPrefix: 'To understand which tools are popular and how to improve the site, we may collect',
      introStrong: 'aggregated, anonymised',
      introSuffix: 'usage statistics such as:',
      points: [
        'Number of page views per tool (no user identification)',
        'Referral source (e.g. Google search, direct link) — no personal data',
        'Country-level geographic data (not city or precise location)',
        'Browser / device type for compatibility analysis',
      ],
      calloutLabel: 'No data is linked to you personally.',
      calloutText: 'We do not use Google Analytics or Meta Pixel. Any analytics we use are privacy-first tools (e.g. Plausible or similar).',
    },
    children: {
      title: "7. Children's Privacy",
      subtitle: 'COPPA & child safety compliance',
      p1: 'photremium.com does not knowingly collect any personal information from children under the age of 13 (or 16 in the European Union under GDPR). Since we collect no personal data from any user, there is nothing special to do for younger users — the site is equally safe for everyone.',
      p2Prefix: 'If you believe a child has somehow submitted personal information through our contact form, please contact us immediately at',
      p2Suffix: 'and we will promptly delete it.',
    },
    rights: {
      title: '8. Your Rights',
      subtitle: 'GDPR, CCPA, and global privacy rights',
      intro: 'Because photremium.com collects no personally identifiable information, most data-subject rights apply trivially — there is no data about you to access, correct, or delete. Nevertheless, we fully acknowledge and respect the following rights:',
      points: [
        { label: 'Right to access', text: 'You may request a copy of any data we hold about you. (There is none beyond anonymised logs.)' },
        { label: 'Right to correction', text: 'You may request correction of inaccurate personal data.' },
        { label: 'Right to erasure ("Right to be forgotten")', text: 'You may request deletion of any personal data we hold (GDPR Art. 17, CCPA).' },
        { label: 'Right to object / opt-out', text: 'You may opt out of any future analytics collection by using a browser-level opt-out or ad-block tool.' },
        { label: 'Right to data portability', text: 'All your work is downloaded directly to your device — no export request needed.' },
      ],
      callout: 'These rights apply to all users worldwide regardless of jurisdiction — we apply the highest standard (GDPR) as our baseline.',
    },
    security: {
      title: '9. Security',
      subtitle: 'How we protect your experience',
      intro: 'The most secure data is data that is never collected. photremium.com client-side architecture means a server breach cannot expose your files because your files are never on our servers. Additional security measures include:',
      points: [
        { label: 'HTTPS enforcement', text: 'All traffic between your browser and our CDN is encrypted via TLS 1.2+ with HSTS.' },
        { label: 'Content Security Policy (CSP)', text: 'Strict headers prevent cross-site scripting and inline script injection.' },
        { label: 'Regular dependency audits', text: 'We audit and update npm packages regularly to patch known vulnerabilities.' },
      ],
      disclosurePrefix: 'Responsible disclosure',
      disclosureTextPrefix: 'Found a security issue? Email us at',
      disclosureTextSuffix: 'and we will respond within 48 hours.',
    },
    changes: {
      title: '10. Changes to This Policy',
      subtitle: 'How we handle policy updates',
      intro: 'We may update this Privacy Policy from time to time to reflect changes in our practices, tools, or legal requirements. When we do:',
      points: [
        { label: '"Last Updated"', text: 'date at the top of this page will be revised.' },
        { label: 'Material changes', text: 'will be communicated via a prominent notice on the home page for at least 30 days.' },
        { label: 'Previous versions', text: 'of this policy will be archived and available upon request.' },
      ],
      outro: 'Continued use of photremium.com after changes are published constitutes acceptance of the updated policy. We encourage you to review this page periodically.',
    },
    contact: {
      title: '11. Contact & Data Requests',
      subtitle: 'Get in touch about privacy',
      p1Prefix: 'For any questions, concerns, or formal data requests related to this Privacy Policy, please contact us. We aim to respond to all privacy-related inquiries within',
      p1Strong: '5 business days',
    },
  },
  footer: {
    privacyQuestionsTitle: 'Privacy Questions?',
    privacyQuestionsDesc: "Send us your privacy questions, data requests, or concerns and we'll respond promptly.",
    versionHistoryTitle: 'Version History',
    v2Label: 'v2.0 — Major rewrite',
    v11Label: 'v1.1 — Added CCPA rights',
    v10Label: 'v1.0 — Initial policy',
  },
};

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */

const PrivacyPolicy = () => {
  const { t, translations } = useLanguage();
  const ppRaw = translations?.privacyPolicyPage;
  const pp = useMemo(() => {
    if (!ppRaw || typeof ppRaw !== 'object' || Array.isArray(ppRaw)) {
      return DEFAULT_PP;
    }

    const mergedSections = {
      ...DEFAULT_PP.sections,
      ...(ppRaw.sections || {}),
      overview: { ...DEFAULT_PP.sections.overview, ...(ppRaw.sections?.overview || {}) },
      noUpload: { ...DEFAULT_PP.sections.noUpload, ...(ppRaw.sections?.noUpload || {}) },
      dataCollect: { ...DEFAULT_PP.sections.dataCollect, ...(ppRaw.sections?.dataCollect || {}) },
      cookies: { ...DEFAULT_PP.sections.cookies, ...(ppRaw.sections?.cookies || {}) },
      thirdParty: { ...DEFAULT_PP.sections.thirdParty, ...(ppRaw.sections?.thirdParty || {}) },
      analytics: { ...DEFAULT_PP.sections.analytics, ...(ppRaw.sections?.analytics || {}) },
      children: { ...DEFAULT_PP.sections.children, ...(ppRaw.sections?.children || {}) },
      rights: { ...DEFAULT_PP.sections.rights, ...(ppRaw.sections?.rights || {}) },
      security: { ...DEFAULT_PP.sections.security, ...(ppRaw.sections?.security || {}) },
      changes: { ...DEFAULT_PP.sections.changes, ...(ppRaw.sections?.changes || {}) },
      contact: { ...DEFAULT_PP.sections.contact, ...(ppRaw.sections?.contact || {}) },
    };

    const mergedTrustCards = DEFAULT_PP.trustCards.map((card, index) => ({
      ...card,
      ...((Array.isArray(ppRaw.trustCards) && ppRaw.trustCards[index]) || {}),
    }));

    return {
      ...DEFAULT_PP,
      ...ppRaw,
      seo: { ...DEFAULT_PP.seo, ...(ppRaw.seo || {}) },
      hero: { ...DEFAULT_PP.hero, ...(ppRaw.hero || {}) },
      toc: { ...DEFAULT_PP.toc, ...(ppRaw.toc || {}) },
      sections: mergedSections,
      footer: { ...DEFAULT_PP.footer, ...(ppRaw.footer || {}) },
      trustCards: mergedTrustCards,
    };
  }, [ppRaw]);
  const lastUpdated   = 'March 11, 2026';
  const effectiveDate = 'January 1, 2025';
  const siteURL       = 'https://photremium.com';
  const contactEmail  = 'contact@photremium.com';

  const TRUST_CARDS = useMemo(
    () => TRUST_CARD_META.map((item, index) => ({
      ...item,
      title: pp.trustCards[index].title,
      desc: pp.trustCards[index].desc,
    })),
    [pp]
  );

  const TOC = useMemo(
    () => TOC_META.map((item) => ({
      ...item,
      label: pp.toc[item.id],
    })),
    [pp]
  );

  const [activeId, setActiveId] = useState('overview');

  /* ---- IntersectionObserver — highlight active TOC item ---- */
  useEffect(() => {
    const ids = TOC.map((t) => t.id);
    const observers = [];

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveId(id); },
        { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [TOC]);

  /* ---- Smooth scroll with navbar offset when TOC link clicked ---- */
  const handleTocClick = useCallback((e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const OFFSET = 110; // px above the card (accounts for sticky navbar)
    const top = el.getBoundingClientRect().top + window.pageYOffset - OFFSET;
    window.scrollTo({ top, behavior: 'smooth' });
    setActiveId(id);
  }, []);

  return (
    <>
      {/* â”€â”€ SEO â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <Helmet>
        <title>{pp.seo.title}</title>
        <meta
          name="description"
          content={pp.seo.description}
        />
        <meta
          name="keywords"
            content={t('seo.homeKeywords')}
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`${siteURL}/privacy-policy`} />
        <meta property="og:type"        content="website" />
        <meta property="og:url"         content={`${siteURL}/privacy-policy`} />
        <meta property="og:title"       content={pp.seo.ogTitle} />
        <meta property="og:description" content={pp.seo.ogDescription} />
        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:title"       content={pp.seo.twitterTitle} />
        <meta name="twitter:description" content={pp.seo.twitterDescription} />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: pp.seo.schemaName,
          url: `${siteURL}/privacy-policy`,
          description: pp.seo.schemaDescription,
          inLanguage: 'en',
          publisher: {
            '@type': 'Organization',
            name: 'photremium.com',
            url: siteURL,
            contactPoint: { '@type': 'ContactPoint', email: contactEmail, contactType: 'customer support' },
          },
          dateModified: lastUpdated,
          datePublished: effectiveDate,
        })}</script>
      </Helmet>

      {/* â”€â”€ Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="privacy-section">

        {/* Hero */}
        <header className="privacy-hero">
          <div className="privacy-hero__badge">
            <i className="fa-solid fa-shield-halved"></i> {pp.hero.badge}
          </div>
          <h1>{pp.hero.titlePrefix}&nbsp;<span>{pp.hero.titleHighlight}</span></h1>
          <p className="privacy-hero__sub">
            {pp.hero.subPrefix} <strong>{pp.hero.subStrong}</strong>. {pp.hero.subSuffix}
          </p>
          <div className="privacy-hero__meta">
            <span><i className="fa-solid fa-calendar-check"></i> {pp.hero.effectiveLabel}: {effectiveDate}</span>
            <span><i className="fa-solid fa-rotate"></i> {pp.hero.lastUpdatedLabel}: {lastUpdated}</span>
            <span><i className="fa-solid fa-earth-europe"></i> {pp.hero.worldwideLabel}</span>
          </div>
        </header>

        {/* Trust Cards */}
        <div className="privacy-trust-banner" role="list" aria-label="Privacy highlights">
          {TRUST_CARDS.map((c) => (
            <div className="privacy-trust-card" key={c.title} role="listitem">
              <div className="privacy-trust-card__icon" style={{ background: c.bg, color: c.color }}>
                <i className={c.icon} aria-hidden="true"></i>
              </div>
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
            </div>
          ))}
        </div>

        {/* Mobile horizontal TOC chips (visible on tablet/mobile) */}
        <nav className="privacy-toc--mobile" aria-label="Jump to section">
          {TOC.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={activeId === item.id ? 'toc-active' : ''}
              onClick={(e) => handleTocClick(e, item.id)}
            >
              <i className={item.icon} aria-hidden="true"></i>
              {item.label}
            </a>
          ))}
        </nav>

        {/* Two-column layout: TOC sidebar + content */}
        <div className="privacy-layout">

          {/* Sticky Sidebar TOC (desktop) */}
          <aside className="privacy-toc" aria-label="Table of contents">
            <p className="privacy-toc__title">{pp.contentsTitle}</p>
            <ul className="privacy-toc__list">
              {TOC.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className={activeId === item.id ? 'toc-active' : ''}
                    onClick={(e) => handleTocClick(e, item.id)}
                  >
                    <i className={item.icon} aria-hidden="true"></i>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </aside>

          {/* â”€â”€â”€ Policy Content â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <div className="privacy-content">

            {/* §1 Overview */}
            <article className="policy-block policy-block--indigo" id="overview">
              <div className="policy-block__header">
                <div className="policy-block__icon" style={{ background: '#eef2ff', color: '#4f46e5' }}>
                  <i className="fa-solid fa-list" aria-hidden="true"></i>
                </div>
                <div className="policy-block__header-text">
                  <h2>{pp.sections.overview.title}</h2>
                  <span>{pp.sections.overview.subtitle}</span>
                </div>
              </div>
              <div className="policy-block__body">
                <p>
                  {pp.sections.overview.p1Prefix}{' '}
                  <strong>photremium.com</strong>{' '}
                  {pp.sections.overview.p1Middle}{' '}
                  <em>{pp.sections.overview.p1Italic}</em>{' '}
                  {pp.sections.overview.p1Suffix}{' '}
                  <a href={siteURL} style={{ color: '#4f46e5' }}>{siteURL}</a>.
                </p>
                <p>
                  {pp.sections.overview.p2}
                </p>
                <div className="policy-callout policy-callout--green">
                  <i className="fa-solid fa-circle-check"></i>
                  <span>
                    <strong>{pp.sections.overview.calloutLabel}</strong> {pp.sections.overview.calloutText}
                  </span>
                </div>
              </div>
            </article>

            {/* §2 No Server Processing */}
            <article className="policy-block policy-block--blue" id="no-upload">
              <div className="policy-block__header">
                <div className="policy-block__icon" style={{ background: '#eff6ff', color: '#2563eb' }}>
                  <i className="fa-solid fa-server" aria-hidden="true"></i>
                </div>
                <div className="policy-block__header-text">
                  <h2>{pp.sections.noUpload.title}</h2>
                  <span>{pp.sections.noUpload.subtitle}</span>
                </div>
              </div>
              <div className="policy-block__body">
                <p>
                  {pp.sections.noUpload.introPrefix}{' '}
                  <strong>{pp.sections.noUpload.introStrong}</strong>{' '}
                  {pp.sections.noUpload.introSuffix}
                </p>
                <ul className="policy-list">
                  {pp.sections.noUpload.points.map((point, idx) => (
                    <li key={`noupload-${idx}`}>
                      <i className="fa-solid fa-circle-check" style={{ color: '#16a34a' }}></i>
                      <span><strong>{point.label}</strong> {point.text}</span>
                    </li>
                  ))}
                </ul>
                <div className="policy-callout policy-callout--blue">
                  <i className="fa-solid fa-circle-info"></i>
                  <span>{pp.sections.noUpload.callout}</span>
                </div>
              </div>
            </article>

            {/* §3 Data We Collect */}
            <article className="policy-block policy-block--green" id="data-collect">
              <div className="policy-block__header">
                <div className="policy-block__icon" style={{ background: '#f0fdf4', color: '#16a34a' }}>
                  <i className="fa-solid fa-database" aria-hidden="true"></i>
                </div>
                <div className="policy-block__header-text">
                  <h2>{pp.sections.dataCollect.title}</h2>
                  <span>{pp.sections.dataCollect.subtitle}</span>
                </div>
              </div>
              <div className="policy-block__body">
                <div className="policy-table-wrap">
                  <table className="policy-table">
                    <thead>
                      <tr>
                        <th>{pp.sections.dataCollect.headers.type}</th>
                        <th>{pp.sections.dataCollect.headers.collected}</th>
                        <th>{pp.sections.dataCollect.headers.whereWhy}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pp.sections.dataCollect.rows.map((row, idx) => (
                        <tr key={`dc-row-${idx}`}>
                          <td>{row.type}</td>
                          <td>
                            <span className={`policy-badge policy-badge--${row.variant}`}>
                              {row.showX && <i className="fa-solid fa-xmark"></i>} {row.badge}
                            </span>
                          </td>
                          <td>{row.whereWhy}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </article>

            {/* §4 Cookies */}
            <article className="policy-block policy-block--orange" id="cookies">
              <div className="policy-block__header">
                <div className="policy-block__icon" style={{ background: '#fff7ed', color: '#ea580c' }}>
                  <i className="fa-solid fa-cookie-bite" aria-hidden="true"></i>
                </div>
                <div className="policy-block__header-text">
                  <h2>{pp.sections.cookies.title}</h2>
                  <span>{pp.sections.cookies.subtitle}</span>
                </div>
              </div>
              <div className="policy-block__body">
                <p>{pp.sections.cookies.intro}</p>
                <ul className="policy-list">
                  {pp.sections.cookies.points.map((point, idx) => (
                    <li key={`cookies-${idx}`}>
                      <i
                        className={idx === 0 ? 'fa-solid fa-language' : idx === 1 ? 'fa-solid fa-circle-half-stroke' : 'fa-solid fa-shield-halved'}
                        style={{ color: idx === 2 ? '#16a34a' : '#ea580c' }}
                      ></i>
                      <span><strong>{point.label}</strong> {point.text}</span>
                    </li>
                  ))}
                </ul>
                <div className="policy-callout policy-callout--amber">
                  <i className="fa-solid fa-triangle-exclamation"></i>
                  <span>{pp.sections.cookies.callout}</span>
                </div>
              </div>
            </article>

            {/* §5 Third-Party Services */}
            <article className="policy-block policy-block--purple" id="third-party">
              <div className="policy-block__header">
                <div className="policy-block__icon" style={{ background: '#fdf4ff', color: '#9333ea' }}>
                  <i className="fa-solid fa-puzzle-piece" aria-hidden="true"></i>
                </div>
                <div className="policy-block__header-text">
                  <h2>{pp.sections.thirdParty.title}</h2>
                  <span>{pp.sections.thirdParty.subtitle}</span>
                </div>
              </div>
              <div className="policy-block__body">
                <p>{pp.sections.thirdParty.intro}</p>
                <div className="policy-table-wrap">
                  <table className="policy-table">
                    <thead>
                      <tr>
                        <th>{pp.sections.thirdParty.headers.service}</th>
                        <th>{pp.sections.thirdParty.headers.purpose}</th>
                        <th>{pp.sections.thirdParty.headers.dataShared}</th>
                        <th>{pp.sections.thirdParty.headers.privacyPolicy}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pp.sections.thirdParty.rows.map((row, idx) => (
                        <tr key={`tp-${idx}`}>
                          <td>{row.service}</td>
                          <td>{row.purpose}</td>
                          <td>{row.dataShared}</td>
                          <td><a href={row.privacyLink} target="_blank" rel="noopener noreferrer" style={{ color: '#9333ea' }}>{row.privacyText}</a></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p>{pp.sections.thirdParty.outro}</p>
              </div>
            </article>

            {/* §6 Analytics */}
            <article className="policy-block policy-block--sky" id="analytics">
              <div className="policy-block__header">
                <div className="policy-block__icon" style={{ background: '#f0f9ff', color: '#0284c7' }}>
                  <i className="fa-solid fa-chart-bar" aria-hidden="true"></i>
                </div>
                <div className="policy-block__header-text">
                  <h2>{pp.sections.analytics.title}</h2>
                  <span>{pp.sections.analytics.subtitle}</span>
                </div>
              </div>
              <div className="policy-block__body">
                <p>
                  {pp.sections.analytics.introPrefix} <strong> {pp.sections.analytics.introStrong}</strong> {pp.sections.analytics.introSuffix}
                </p>
                <ul className="policy-list">
                  {pp.sections.analytics.points.map((point, idx) => (
                    <li key={`an-${idx}`}>
                      <i className="fa-solid fa-arrow-right" style={{ color: '#0284c7' }}></i>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                <div className="policy-callout policy-callout--green">
                  <i className="fa-solid fa-circle-check"></i>
                  <span>
                    <strong>{pp.sections.analytics.calloutLabel}</strong> {pp.sections.analytics.calloutText}
                  </span>
                </div>
              </div>
            </article>

            {/* §7 Children */}
            <article className="policy-block policy-block--pink" id="children">
              <div className="policy-block__header">
                <div className="policy-block__icon" style={{ background: '#fdf2f8', color: '#db2777' }}>
                  <i className="fa-solid fa-child-reaching" aria-hidden="true"></i>
                </div>
                <div className="policy-block__header-text">
                  <h2>{pp.sections.children.title}</h2>
                  <span>{pp.sections.children.subtitle}</span>
                </div>
              </div>
              <div className="policy-block__body">
                <p>{pp.sections.children.p1}</p>
                <p>
                  {pp.sections.children.p2Prefix}{' '}
                  <a href={`mailto:${contactEmail}`} style={{ color: '#db2777' }}>{contactEmail}</a>{' '}
                  {pp.sections.children.p2Suffix}
                </p>
              </div>
            </article>

            {/* §8 Your Rights */}
            <article className="policy-block policy-block--teal" id="rights">
              <div className="policy-block__header">
                <div className="policy-block__icon" style={{ background: '#f0fdfa', color: '#0d9488' }}>
                  <i className="fa-solid fa-scale-balanced" aria-hidden="true"></i>
                </div>
                <div className="policy-block__header-text">
                  <h2>{pp.sections.rights.title}</h2>
                  <span>{pp.sections.rights.subtitle}</span>
                </div>
              </div>
              <div className="policy-block__body">
                <p>{pp.sections.rights.intro}</p>
                <ul className="policy-list">
                  {pp.sections.rights.points.map((point, idx) => (
                    <li key={`rights-${idx}`}>
                      <i
                        className={
                          idx === 0 ? 'fa-solid fa-eye'
                            : idx === 1 ? 'fa-solid fa-pen-to-square'
                              : idx === 2 ? 'fa-solid fa-trash-can'
                                : idx === 3 ? 'fa-solid fa-ban'
                                  : 'fa-solid fa-box-archive'
                        }
                        style={{ color: '#0d9488' }}
                      ></i>
                      <span><strong>{point.label}</strong> {point.text}</span>
                    </li>
                  ))}
                </ul>
                <div className="policy-callout policy-callout--purple">
                  <i className="fa-solid fa-globe"></i>
                  <span>{pp.sections.rights.callout}</span>
                </div>
              </div>
            </article>

            {/* §9 Security */}
            <article className="policy-block policy-block--amber" id="security">
              <div className="policy-block__header">
                <div className="policy-block__icon" style={{ background: '#fffbeb', color: '#d97706' }}>
                  <i className="fa-solid fa-lock" aria-hidden="true"></i>
                </div>
                <div className="policy-block__header-text">
                  <h2>{pp.sections.security.title}</h2>
                  <span>{pp.sections.security.subtitle}</span>
                </div>
              </div>
              <div className="policy-block__body">
                <p>{pp.sections.security.intro}</p>
                <ul className="policy-list">
                  {pp.sections.security.points.map((point, idx) => (
                    <li key={`sec-${idx}`}>
                      <i
                        className={idx === 0 ? 'fa-solid fa-lock' : idx === 1 ? 'fa-solid fa-shield-halved' : 'fa-solid fa-code-branch'}
                        style={{ color: '#d97706' }}
                      ></i>
                      <span><strong>{point.label}</strong> {point.text}</span>
                    </li>
                  ))}
                  <li>
                    <i className="fa-solid fa-triangle-exclamation" style={{ color: '#d97706' }}></i>
                    <span><strong>{pp.sections.security.disclosurePrefix}</strong> {pp.sections.security.disclosureTextPrefix}{' '}
                    <a href={`mailto:${contactEmail}`} style={{ color: '#d97706' }}>{contactEmail}</a>{' '}
                    {pp.sections.security.disclosureTextSuffix}</span>
                  </li>
                </ul>
              </div>
            </article>

            {/* §10 Policy Changes */}
            <article className="policy-block policy-block--violet" id="changes">
              <div className="policy-block__header">
                <div className="policy-block__icon" style={{ background: '#f5f3ff', color: '#7c3aed' }}>
                  <i className="fa-solid fa-bell" aria-hidden="true"></i>
                </div>
                <div className="policy-block__header-text">
                  <h2>{pp.sections.changes.title}</h2>
                  <span>{pp.sections.changes.subtitle}</span>
                </div>
              </div>
              <div className="policy-block__body">
                <p>{pp.sections.changes.intro}</p>
                <ul className="policy-list">
                  {pp.sections.changes.points.map((point, idx) => (
                    <li key={`chg-${idx}`}>
                      <i
                        className={idx === 0 ? 'fa-solid fa-calendar-check' : idx === 1 ? 'fa-solid fa-bell' : 'fa-solid fa-scroll'}
                        style={{ color: '#7c3aed' }}
                      ></i>
                      <span><strong>{point.label}</strong> {point.text}</span>
                    </li>
                  ))}
                </ul>
                <p>{pp.sections.changes.outro}</p>
              </div>
            </article>

            {/* §11 Contact */}
            <article className="policy-block policy-block--emerald" id="contact">
              <div className="policy-block__header">
                <div className="policy-block__icon" style={{ background: '#ecfdf5', color: '#059669' }}>
                  <i className="fa-solid fa-envelope" aria-hidden="true"></i>
                </div>
                <div className="policy-block__header-text">
                  <h2>{pp.sections.contact.title}</h2>
                  <span>{pp.sections.contact.subtitle}</span>
                </div>
              </div>
              <div className="policy-block__body">
                <p>
                  {pp.sections.contact.p1Prefix}{' '}
                  <strong>{pp.sections.contact.p1Strong}</strong>.
                </p>
              </div>
            </article>

            {/* Footer Cards */}
            <div className="privacy-footer-box">
              <div className="privacy-contact-card">
                <h3><i className="fa-solid fa-envelope" style={{ marginRight: 8 }}></i> {pp.footer.privacyQuestionsTitle}</h3>
                <p>
                  {pp.footer.privacyQuestionsDesc}
                </p>
                <a href={`mailto:${contactEmail}`}>
                  <i className="fa-solid fa-paper-plane"></i> {contactEmail}
                </a>
              </div>

              <div className="privacy-updated-card">
                <h3><i className="fa-solid fa-clock-rotate-left" style={{ marginRight: 8 }}></i> {pp.footer.versionHistoryTitle}</h3>
                <ul>
                  <li><span>{pp.footer.v2Label}</span><span>March 11, 2026</span></li>
                  <li><span>{pp.footer.v11Label}</span><span>Sep 1, 2025</span></li>
                  <li><span>{pp.footer.v10Label}</span><span>Jan 1, 2025</span></li>
                </ul>
              </div>
            </div>

          </div>{/* end privacy-content */}
        </div>{/* end privacy-layout */}
      </section>
    </>
  );
};

export default PrivacyPolicy;
