/* 
 * Language definitions — controls dropdown order & metadata.
 * `name` is NEVER translated, always shown in native script.
 * `code` is the URL prefix (e.g. /es, /ur).
 * `flag` is a country flag emoji for the dropdown.
 */

const LANGUAGES = [
  { code: 'en',      name: 'English',              countryCode: 'us' },
  { code: 'es',      name: 'Español',               countryCode: 'es' },
  { code: 'pt-br',   name: 'Português (Brasil)',    countryCode: 'br' },
  { code: 'pt',      name: 'Português (Portugal)',   countryCode: 'pt' },
  { code: 'fr',      name: 'Français',              countryCode: 'fr' },
  { code: 'de',      name: 'Deutsch',               countryCode: 'de' },
  { code: 'hi',      name: 'हिन्दी',                  countryCode: 'in' },
  { code: 'ur',      name: 'اردو',                   countryCode: 'pk' },
  { code: 'ar',      name: 'العربية',                countryCode: 'sa' },
];

export default LANGUAGES;

/* Quick lookup map */
export const LANG_MAP = Object.fromEntries(LANGUAGES.map((l) => [l.code, l]));

/* Set of all valid language codes */
export const LANG_CODES = new Set(LANGUAGES.map((l) => l.code));

/* Default / fallback language */
export const DEFAULT_LANG = 'en';
