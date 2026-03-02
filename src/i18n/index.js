/*
 * Translation loader — lazy-loads translation files.
 * Only English is bundled eagerly; all others are loaded on demand.
 * Any missing key falls back to English automatically.
 */
import en from './translations/en';

/* ---- deep-merge helper (target wins) ---- */
function deepMerge(fallback, override) {
  const result = { ...fallback };
  for (const key of Object.keys(override)) {
    if (
      override[key] &&
      typeof override[key] === 'object' &&
      !Array.isArray(override[key]) &&
      fallback[key] &&
      typeof fallback[key] === 'object'
    ) {
      result[key] = deepMerge(fallback[key], override[key]);
    } else {
      result[key] = override[key];
    }
  }
  return result;
}

/* Map of lazy loaders. Add new languages here. */
const loaders = {
  en: () => Promise.resolve(en),
  es: () => import('./translations/es').then((m) => m.default),
  'pt-br': () => import('./translations/pt-br').then((m) => m.default),
  pt: () => import('./translations/pt').then((m) => m.default),
  fr: () => import('./translations/fr').then((m) => m.default),
  de: () => import('./translations/de').then((m) => m.default),
  hi: () => import('./translations/hi').then((m) => m.default),
  ur: () => import('./translations/ur').then((m) => m.default),
  ar: () => import('./translations/ar').then((m) => m.default),
};

/* Cache so we don't re-import */
const cache = { en };

/**
 * Load translations for a locale code.
 * Returns a merged object (loaded lang ← English fallback).
 */
export async function loadTranslations(code) {
  if (cache[code]) return cache[code];
  const loader = loaders[code];
  if (!loader) return en; // unknown → English
  try {
    const translations = await loader();
    const merged = deepMerge(en, translations);
    cache[code] = merged;
    return merged;
  } catch {
    return en;
  }
}

export { en as defaultTranslations };
