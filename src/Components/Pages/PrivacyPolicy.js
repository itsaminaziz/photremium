import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import './PrivacyPolicy.css';

/* ------------------------------------------------------------------ */
/*  Static data — policy sections                                       */
/* ------------------------------------------------------------------ */

const TRUST_CARDS = [
  {
    icon: 'fa-solid fa-server',
    bg: '#eff6ff',
    color: '#2563eb',
    title: 'No Server Uploads',
    desc: 'Your files never leave your device. All processing is 100 % in-browser.',
  },
  {
    icon: 'fa-solid fa-database',
    bg: '#f0fdf4',
    color: '#16a34a',
    title: 'Zero Data Storage',
    desc: 'We store nothing about you, your images, or your activity.',
  },
  {
    icon: 'fa-solid fa-eye-slash',
    bg: '#fdf4ff',
    color: '#9333ea',
    title: 'No Tracking',
    desc: 'No behavioral tracking, no fingerprinting, no profiling.',
  },
  {
    icon: 'fa-solid fa-shield-halved',
    bg: '#fff7ed',
    color: '#ea580c',
    title: 'GDPR Friendly',
    desc: 'Designed from the ground up to respect global privacy regulations.',
  },
];

const TOC = [
  { id: 'overview',     icon: 'fa-solid fa-list',            label: 'Overview' },
  { id: 'no-upload',    icon: 'fa-solid fa-server',          label: 'No Server Processing' },
  { id: 'data-collect', icon: 'fa-solid fa-database',        label: 'Data We Collect' },
  { id: 'cookies',      icon: 'fa-solid fa-cookie-bite',     label: 'Cookies & Storage' },
  { id: 'third-party',  icon: 'fa-solid fa-puzzle-piece',    label: 'Third-Party Services' },
  { id: 'analytics',    icon: 'fa-solid fa-chart-bar',       label: 'Analytics' },
  { id: 'children',     icon: 'fa-solid fa-child-reaching',  label: "Children's Privacy" },
  { id: 'rights',       icon: 'fa-solid fa-scale-balanced',  label: 'Your Rights' },
  { id: 'security',     icon: 'fa-solid fa-lock',            label: 'Security' },
  { id: 'changes',      icon: 'fa-solid fa-bell',            label: 'Policy Changes' },
  { id: 'contact',      icon: 'fa-solid fa-envelope',        label: 'Contact Us' },
];

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */

const PrivacyPolicy = () => {
  const { t } = useTranslation();
  const lastUpdated   = 'March 11, 2026';
  const effectiveDate = 'January 1, 2025';
  const siteURL       = 'https://photremium.com';
  const contactEmail  = 'hello@photremium.com';

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
  }, []);

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
        <title>Privacy Policy — photremium.com | No Server Uploads, Zero Data Storage</title>
        <meta
          name="description"
          content="photremium.com's Privacy Policy explains how we protect your privacy. All image processing happens 100% in your browser — no file uploads to any server, no personal data collected, no tracking."
        />
        <meta
          name="keywords"
            content={t('seo.homeKeywords')}
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`${siteURL}/privacy-policy`} />
        <meta property="og:type"        content="website" />
        <meta property="og:url"         content={`${siteURL}/privacy-policy`} />
        <meta property="og:title"       content="Privacy Policy — photremium.com | No Uploads, Zero Storage" />
        <meta property="og:description" content="Your files stay on your device. photremium.com processes all images locally in your browser with no server contact, no data stored, and no tracking." />
        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:title"       content="Privacy Policy — photremium.com" />
        <meta name="twitter:description" content="100% browser-based image tools. No uploads, no storage, no tracking. Read our full privacy policy." />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Privacy Policy â€“ photremium.com',
          url: `${siteURL}/privacy-policy`,
          description: 'photremium.com Privacy Policy â€“ no server uploads, no data stored, 100% in-browser image processing.',
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
            <i className="fa-solid fa-shield-halved"></i> Privacy Policy
          </div>
          <h1>Your Privacy Is Our&nbsp;<span>Top&nbsp;Priority</span></h1>
          <p className="privacy-hero__sub">
            photremium.com is built on a simple principle — <strong>your files never leave your device</strong>.
            Every image tool on this site runs entirely inside your browser. No uploads. No cloud. No compromise.
          </p>
          <div className="privacy-hero__meta">
            <span><i className="fa-solid fa-calendar-check"></i> Effective: {effectiveDate}</span>
            <span><i className="fa-solid fa-rotate"></i> Last updated: {lastUpdated}</span>
            <span><i className="fa-solid fa-earth-europe"></i> Applies worldwide</span>
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
            <p className="privacy-toc__title">Contents</p>
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
                  <h2>1. Overview</h2>
                  <span>What this policy covers</span>
                </div>
              </div>
              <div className="policy-block__body">
                <p>
                  This Privacy Policy describes how <strong>photremium.com</strong> ("we", "us", or "our") handles — or more
                  accurately, <em>doesn't handle</em> — your personal information when you use our free online image
                  tools at <a href={siteURL} style={{ color: '#4f46e5' }}>{siteURL}</a>.
                </p>
                <p>
                  Unlike traditional web applications that send files to remote servers for processing, photremium.com uses
                  modern browser APIs (Canvas API, WebAssembly, WebWorkers) to perform every operation locally on your
                  device. The result: no data transmission, no storage, no risk.
                </p>
                <div className="policy-callout policy-callout--green">
                  <i className="fa-solid fa-circle-check"></i>
                  <span>
                    <strong>Plain English summary:</strong> We can't see your images, we don't want to, and our
                    technology is specifically engineered so that we never could.
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
                  <h2>2. No Server Processing — Ever</h2>
                  <span>How our tools actually work</span>
                </div>
              </div>
              <div className="policy-block__body">
                <p>
                  Every tool on photremium.com — image converter, compressor, resizer, background remover, face blur,
                  watermark, crop, and QR code tools — processes your files <strong>100% inside your web browser</strong>
                  using client-side JavaScript and WebAssembly.
                </p>
                <ul className="policy-list">
                  <li>
                    <i className="fa-solid fa-circle-check" style={{ color: '#16a34a' }}></i>
                    <span><strong>No file upload ever occurs.</strong> When you select a file, it is read by your
                    browser's File API and processed in memory — it is never sent over the network.</span>
                  </li>
                  <li>
                    <i className="fa-solid fa-circle-check" style={{ color: '#16a34a' }}></i>
                    <span><strong>No server receives your image.</strong> Our CDN only serves the HTML, CSS, and
                    JavaScript assets needed to run the app — not your files.</span>
                  </li>
                  <li>
                    <i className="fa-solid fa-circle-check" style={{ color: '#16a34a' }}></i>
                    <span><strong>No temporary storage.</strong> Processed results exist only in your browser's
                    memory and are released when you close or navigate away from the page.</span>
                  </li>
                  <li>
                    <i className="fa-solid fa-circle-check" style={{ color: '#16a34a' }}></i>
                    <span><strong>Works offline.</strong> Most tools continue to function without an internet
                    connection after the initial page load — further proof no server is involved.</span>
                  </li>
                </ul>
                <div className="policy-callout policy-callout--blue">
                  <i className="fa-solid fa-circle-info"></i>
                  <span>
                    You can verify this yourself: open your browser's Network tab in Developer Tools, select an image,
                    and confirm that no file data is transmitted to any external server.
                  </span>
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
                  <h2>3. Data We Collect (and Don't Collect)</h2>
                  <span>Full transparency on data practices</span>
                </div>
              </div>
              <div className="policy-block__body">
                <div className="policy-table-wrap">
                  <table className="policy-table">
                    <thead>
                      <tr>
                        <th>Data Type</th>
                        <th>Collected?</th>
                        <th>Where / Why</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Your images / files</td>
                        <td><span className="policy-badge policy-badge--green"><i className="fa-solid fa-xmark"></i> Never</span></td>
                        <td>Processed entirely in your browser — never transmitted</td>
                      </tr>
                      <tr>
                        <td>Name / email address</td>
                        <td><span className="policy-badge policy-badge--green"><i className="fa-solid fa-xmark"></i> Never</span></td>
                        <td>No account or sign-up is required to use any tool</td>
                      </tr>
                      <tr>
                        <td>IP address</td>
                        <td><span className="policy-badge policy-badge--gray">Minimal</span></td>
                        <td>Standard web server logs retained ≤ 30 days, not tied to identity</td>
                      </tr>
                      <tr>
                        <td>Browser / OS type</td>
                        <td><span className="policy-badge policy-badge--gray">Minimal</span></td>
                        <td>Sent by your browser automatically; used only for compatibility</td>
                      </tr>
                      <tr>
                        <td>Pages visited / clicks</td>
                        <td><span className="policy-badge policy-badge--blue">Aggregated</span></td>
                        <td>Anonymous analytics only (no personal identification)</td>
                      </tr>
                      <tr>
                        <td>Language preference</td>
                        <td><span className="policy-badge policy-badge--blue">Local only</span></td>
                        <td>Saved to <code>localStorage</code> on your device — never sent to us</td>
                      </tr>
                      <tr>
                        <td>Payment / financial data</td>
                        <td><span className="policy-badge policy-badge--green"><i className="fa-solid fa-xmark"></i> Never</span></td>
                        <td>photremium.com is completely free with no payments required</td>
                      </tr>
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
                  <h2>4. Cookies &amp; Local Storage</h2>
                  <span>What gets stored on your device</span>
                </div>
              </div>
              <div className="policy-block__body">
                <p>
                  photremium.com uses <strong>no advertising cookies</strong>, <strong>no cross-site tracking cookies</strong>,
                  and <strong>no third-party cookies</strong>. The only browser storage we use is for essential
                  site functionality:
                </p>
                <ul className="policy-list">
                  <li>
                    <i className="fa-solid fa-language" style={{ color: '#ea580c' }}></i>
                    <span><strong>Language preference</strong> — stored in <code>localStorage</code> so the site
                    remembers your preferred language between visits. Never sent to our servers.</span>
                  </li>
                  <li>
                    <i className="fa-solid fa-circle-half-stroke" style={{ color: '#ea580c' }}></i>
                    <span><strong>Theme / UI preferences</strong> — if you set a display preference, it is saved
                    locally on your device only.</span>
                  </li>
                  <li>
                    <i className="fa-solid fa-shield-halved" style={{ color: '#16a34a' }}></i>
                    <span><strong>No session cookies.</strong> photremium.com has no login system, so no session ID
                    cookies are ever written.</span>
                  </li>
                </ul>
                <div className="policy-callout policy-callout--amber">
                  <i className="fa-solid fa-triangle-exclamation"></i>
                  <span>
                    You can clear all photremium.com local storage at any time via your browser settings
                    (<em>Settings → Privacy → Clear browsing data → Cached data &amp; cookies</em>).
                    Doing so has no effect on your ability to use the tools.
                  </span>
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
                  <h2>5. Third-Party Services</h2>
                  <span>External services we use and why</span>
                </div>
              </div>
              <div className="policy-block__body">
                <p>
                  photremium.com uses a minimal set of trusted third-party services strictly for infrastructure and
                  performance. None of these services receive your images or any personally identifiable information.
                </p>
                <div className="policy-table-wrap">
                  <table className="policy-table">
                    <thead>
                      <tr>
                        <th>Service</th>
                        <th>Purpose</th>
                        <th>Data Shared</th>
                        <th>Privacy Policy</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Netlify</td>
                        <td>Hosting &amp; CDN delivery of site assets</td>
                        <td>IP address, HTTP headers (standard)</td>
                        <td><a href="https://www.netlify.com/privacy/" target="_blank" rel="noopener noreferrer" style={{ color: '#9333ea' }}>netlify.com/privacy</a></td>
                      </tr>
                      <tr>
                        <td>Font Awesome</td>
                        <td>Icon fonts loaded from CDN</td>
                        <td>IP address (CSS request only)</td>
                        <td><a href="https://fontawesome.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#9333ea' }}>fontawesome.com/privacy</a></td>
                      </tr>
                      <tr>
                        <td>Google Fonts</td>
                        <td>Typeface loading (if applicable)</td>
                        <td>IP address (font request only)</td>
                        <td><a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#9333ea' }}>policies.google.com</a></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p>
                  We do not share your data with advertisers, data brokers, or any other third party beyond
                  the infrastructure providers listed above.
                </p>
              </div>
            </article>

            {/* §6 Analytics */}
            <article className="policy-block policy-block--sky" id="analytics">
              <div className="policy-block__header">
                <div className="policy-block__icon" style={{ background: '#f0f9ff', color: '#0284c7' }}>
                  <i className="fa-solid fa-chart-bar" aria-hidden="true"></i>
                </div>
                <div className="policy-block__header-text">
                  <h2>6. Analytics</h2>
                  <span>Aggregate, privacy-respecting usage data</span>
                </div>
              </div>
              <div className="policy-block__body">
                <p>
                  To understand which tools are popular and how to improve the site, we may collect
                  <strong> aggregated, anonymised</strong> usage statistics such as:
                </p>
                <ul className="policy-list">
                  <li>
                    <i className="fa-solid fa-arrow-right" style={{ color: '#0284c7' }}></i>
                    <span>Number of page views per tool (no user identification)</span>
                  </li>
                  <li>
                    <i className="fa-solid fa-arrow-right" style={{ color: '#0284c7' }}></i>
                    <span>Referral source (e.g. Google search, direct link) — no personal data</span>
                  </li>
                  <li>
                    <i className="fa-solid fa-arrow-right" style={{ color: '#0284c7' }}></i>
                    <span>Country-level geographic data (not city or precise location)</span>
                  </li>
                  <li>
                    <i className="fa-solid fa-arrow-right" style={{ color: '#0284c7' }}></i>
                    <span>Browser / device type for compatibility analysis</span>
                  </li>
                </ul>
                <div className="policy-callout policy-callout--green">
                  <i className="fa-solid fa-circle-check"></i>
                  <span>
                    <strong>No data is linked to you personally.</strong> We do not use Google Analytics or
                    Meta Pixel. Any analytics we use are privacy-first tools (e.g. Plausible or similar).
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
                  <h2>7. Children's Privacy</h2>
                  <span>COPPA &amp; child safety compliance</span>
                </div>
              </div>
              <div className="policy-block__body">
                <p>
                  photremium.com does not knowingly collect any personal information from children under the age of 13
                  (or 16 in the European Union under GDPR). Since we collect no personal data from any user,
                  there is nothing special to do for younger users — the site is equally safe for everyone.
                </p>
                <p>
                  If you believe a child has somehow submitted personal information through our contact form,
                  please contact us immediately at{' '}
                  <a href={`mailto:${contactEmail}`} style={{ color: '#db2777' }}>{contactEmail}</a>{' '}
                  and we will promptly delete it.
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
                  <h2>8. Your Rights</h2>
                  <span>GDPR, CCPA, and global privacy rights</span>
                </div>
              </div>
              <div className="policy-block__body">
                <p>
                  Because photremium.com collects no personally identifiable information, most data-subject rights apply
                  trivially — there is no data about you to access, correct, or delete. Nevertheless, we fully
                  acknowledge and respect the following rights:
                </p>
                <ul className="policy-list">
                  <li>
                    <i className="fa-solid fa-eye" style={{ color: '#0d9488' }}></i>
                    <span><strong>Right to access</strong> — You may request a copy of any data we hold about
                    you. (There is none beyond anonymised logs.)</span>
                  </li>
                  <li>
                    <i className="fa-solid fa-pen-to-square" style={{ color: '#0d9488' }}></i>
                    <span><strong>Right to correction</strong> — You may request correction of inaccurate
                    personal data.</span>
                  </li>
                  <li>
                    <i className="fa-solid fa-trash-can" style={{ color: '#0d9488' }}></i>
                    <span><strong>Right to erasure ("Right to be forgotten")</strong> — You may request
                    deletion of any personal data we hold (GDPR Art. 17, CCPA).</span>
                  </li>
                  <li>
                    <i className="fa-solid fa-ban" style={{ color: '#0d9488' }}></i>
                    <span><strong>Right to object / opt-out</strong> — You may opt out of any future
                    analytics collection by using a browser-level opt-out or ad-block tool.</span>
                  </li>
                  <li>
                    <i className="fa-solid fa-box-archive" style={{ color: '#0d9488' }}></i>
                    <span><strong>Right to data portability</strong> — All your work is downloaded directly
                    to your device — no export request needed.</span>
                  </li>
                </ul>
                <div className="policy-callout policy-callout--purple">
                  <i className="fa-solid fa-globe"></i>
                  <span>
                    These rights apply to all users worldwide regardless of jurisdiction — we apply the highest
                    standard (GDPR) as our baseline.
                  </span>
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
                  <h2>9. Security</h2>
                  <span>How we protect your experience</span>
                </div>
              </div>
              <div className="policy-block__body">
                <p>
                  The most secure data is data that is never collected. photremium.com's client-side architecture means
                  a server breach cannot expose your files because your files are never on our servers.
                  Additional security measures include:
                </p>
                <ul className="policy-list">
                  <li>
                    <i className="fa-solid fa-lock" style={{ color: '#d97706' }}></i>
                    <span><strong>HTTPS enforcement</strong> — All traffic between your browser and our CDN is
                    encrypted via TLS 1.2+ with HSTS.</span>
                  </li>
                  <li>
                    <i className="fa-solid fa-shield-halved" style={{ color: '#d97706' }}></i>
                    <span><strong>Content Security Policy (CSP)</strong> — Strict headers prevent
                    cross-site scripting and inline script injection.</span>
                  </li>
                  <li>
                    <i className="fa-solid fa-code-branch" style={{ color: '#d97706' }}></i>
                    <span><strong>Regular dependency audits</strong> — We audit and update npm packages
                    regularly to patch known vulnerabilities.</span>
                  </li>
                  <li>
                    <i className="fa-solid fa-triangle-exclamation" style={{ color: '#d97706' }}></i>
                    <span><strong>Responsible disclosure</strong> — Found a security issue? Email us at{' '}
                    <a href={`mailto:${contactEmail}`} style={{ color: '#d97706' }}>{contactEmail}</a>{' '}
                    and we will respond within 48 hours.</span>
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
                  <h2>10. Changes to This Policy</h2>
                  <span>How we handle policy updates</span>
                </div>
              </div>
              <div className="policy-block__body">
                <p>
                  We may update this Privacy Policy from time to time to reflect changes in our practices, tools,
                  or legal requirements. When we do:
                </p>
                <ul className="policy-list">
                  <li>
                    <i className="fa-solid fa-calendar-check" style={{ color: '#7c3aed' }}></i>
                    <span>The <strong>"Last Updated"</strong> date at the top of this page will be revised.</span>
                  </li>
                  <li>
                    <i className="fa-solid fa-bell" style={{ color: '#7c3aed' }}></i>
                    <span>Material changes will be communicated via a prominent notice on the home page for
                    at least 30 days.</span>
                  </li>
                  <li>
                    <i className="fa-solid fa-scroll" style={{ color: '#7c3aed' }}></i>
                    <span>Previous versions of this policy will be archived and available upon request.</span>
                  </li>
                </ul>
                <p>
                  Continued use of photremium.com after changes are published constitutes acceptance of the updated policy.
                  We encourage you to review this page periodically.
                </p>
              </div>
            </article>

            {/* §11 Contact */}
            <article className="policy-block policy-block--emerald" id="contact">
              <div className="policy-block__header">
                <div className="policy-block__icon" style={{ background: '#ecfdf5', color: '#059669' }}>
                  <i className="fa-solid fa-envelope" aria-hidden="true"></i>
                </div>
                <div className="policy-block__header-text">
                  <h2>11. Contact &amp; Data Requests</h2>
                  <span>Get in touch about privacy</span>
                </div>
              </div>
              <div className="policy-block__body">
                <p>
                  For any questions, concerns, or formal data requests related to this Privacy Policy,
                  please contact us. We aim to respond to all privacy-related inquiries within
                  <strong> 5 business days</strong>.
                </p>
              </div>
            </article>

            {/* Footer Cards */}
            <div className="privacy-footer-box">
              <div className="privacy-contact-card">
                <h3><i className="fa-solid fa-envelope" style={{ marginRight: 8 }}></i> Privacy Questions?</h3>
                <p>
                  Send us your privacy questions, data requests, or concerns and we'll respond promptly.
                </p>
                <a href={`mailto:${contactEmail}`}>
                  <i className="fa-solid fa-paper-plane"></i> {contactEmail}
                </a>
              </div>

              <div className="privacy-updated-card">
                <h3><i className="fa-solid fa-clock-rotate-left" style={{ marginRight: 8 }}></i> Version History</h3>
                <ul>
                  <li><span>v2.0 — Major rewrite</span><span>March 11, 2026</span></li>
                  <li><span>v1.1 — Added CCPA rights</span><span>Sep 1, 2025</span></li>
                  <li><span>v1.0 — Initial policy</span><span>Jan 1, 2025</span></li>
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
