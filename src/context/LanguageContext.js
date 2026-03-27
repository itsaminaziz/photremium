import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getTranslationsSync } from '../i18n';
import LANGUAGES, { LANG_CODES, DEFAULT_LANG } from '../i18n/languages';

const LanguageContext = createContext();

/**
 * Extract language code from the current path.
 * e.g. "/es/about" → "es",  "/about" → "en"
 */
function langFromPath(pathname) {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length > 0 && LANG_CODES.has(segments[0])) {
    return segments[0];
  }
  return DEFAULT_LANG;
}

/**
 * Strip the language prefix from a path so we get the "real" route.
 * "/es/about" → "/about",  "/about" → "/about"
 */
function stripLang(pathname) {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length > 0 && LANG_CODES.has(segments[0])) {
    const rest = segments.slice(1).join('/');
    return '/' + rest;
  }
  return pathname || '/';
}

/**
 * Build a path with language prefix.
 * For English (default) there's no prefix.
 */
function buildPath(lang, route) {
  const clean = route.startsWith('/') ? route : '/' + route;
  if (lang === DEFAULT_LANG) {
    return clean;
  }
  return '/' + lang + clean;
}

export function LanguageProvider({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [lang, setLangState] = useState(() => langFromPath(location.pathname));

  // Derive translations SYNCHRONOUSLY from lang — no async state needed.
  // All language files are bundled eagerly so getTranslationsSync() is instant.
  // This means:
  //   • First render → correct language meta tags (critical for SEO crawlers)
  //   • Language switch → correct meta tags in the same render (no flash)
  const translations = getTranslationsSync(lang);

  // Keep document language in sync with active locale
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  /* Sync lang from URL when location changes (e.g. back button) */
  useEffect(() => {
    const detected = langFromPath(location.pathname);
    if (detected !== lang) {
      setLangState(detected);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  /* Change language and navigate */
  const setLanguage = useCallback((newLang) => {
    if (newLang === lang) return;
    const route = stripLang(location.pathname);
    const newPath = buildPath(newLang, route);
    setLangState(newLang);
    navigate(newPath);
  }, [lang, location.pathname, navigate]);

  /* Helper: build a <Link to> path keeping current lang */
  const localePath = useCallback((route) => {
    return buildPath(lang, route);
  }, [lang]);

  /* t() accessor — supports dot notation: t('nav.home') */
  const t = useCallback((key) => {
    const parts = key.split('.');
    let val = translations;
    for (const p of parts) {
      if (val == null) return key; // fallback to key itself
      val = val[p];
    }
    return val ?? key;
  }, [translations]);

  return (
    <LanguageContext.Provider value={{ lang, setLanguage, t, localePath, translations, loading: false, languages: LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}

export default LanguageContext;
