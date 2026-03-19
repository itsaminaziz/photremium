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
  { code: 'id',      name: 'Bahasa Indonesia',        countryCode: 'id' },
  { code: 'ru',      name: 'Русский',               countryCode: 'ru' },
  { code: 'ja',      name: '日本語',                  countryCode: 'jp' },
  { code: 'zh',      name: '中文（简体）',              countryCode: 'cn' },
  { code: 'it',    name: 'Italiano',              countryCode: 'it' },
  { code: 'ko',    name: '한국어',                  countryCode: 'kr' },
  { code: 'zh-tw', name: '中文（繁體）',              countryCode: 'tw' },
  { code: 'ms',    name: 'Bahasa Melayu',          countryCode: 'my' },
  { code: 'tr',    name: 'Türkçe',                countryCode: 'tr' },
  { code: 'vi',    name: 'Tiếng Việt',             countryCode: 'vn' },
  { code: 'pl',    name: 'Polski',                countryCode: 'pl' },
  { code: 'nl',    name: 'Nederlands',             countryCode: 'nl' },
  { code: 'th',    name: 'ภาษาไทย',                 countryCode: 'th' },
  { code: 'uk',    name: 'Українська',             countryCode: 'ua' },
  { code: 'sv',    name: 'Svenska',                countryCode: 'se' },
  { code: 'bg',    name: 'Български',              countryCode: 'bg' },
];

export default LANGUAGES;

/* Quick lookup map */
export const LANG_MAP = Object.fromEntries(LANGUAGES.map((l) => [l.code, l]));

/* Set of all valid language codes */
export const LANG_CODES = new Set(LANGUAGES.map((l) => l.code));

/* Default / fallback language */
export const DEFAULT_LANG = 'en';