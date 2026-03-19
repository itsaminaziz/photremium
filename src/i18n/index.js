/*
 * Translation loader — ALL languages imported synchronously at bundle time.
 *
 * WHY SYNCHRONOUS: react-helmet-async sets <title> and <meta> tags on the
 * very first React render. If translations are loaded asynchronously (lazy
 * import), the first render always uses English — search-engine crawlers and
 * social-media link-preview bots that snapshot the page before JS finishes
 * see only English meta tags, no matter what language the URL prefix is.
 *
 * By bundling all language files eagerly, `getTranslationsSync(code)` can
 * return the correct merged translation object before the first render,
 * so the initial <title> and <meta> are already in the right language.
 *
 * Translation files are plain JS objects (~5-15 KB minified each) so the
 * bundle-size cost is minimal compared to the SEO benefit.
 */
import en    from './translations/en';
import es    from './translations/es';
import ptBr  from './translations/pt-br';
import pt    from './translations/pt';
import fr    from './translations/fr';
import de    from './translations/de';
import hi    from './translations/hi';
import ur    from './translations/ur';
import ar    from './translations/ar';
import id    from './translations/id';
import ru    from './translations/ru';
import ja    from './translations/ja';
import zh    from './translations/zh';
import it    from './translations/it';
import ko    from './translations/ko';
import zhTw  from './translations/zh-tw';
import ms    from './translations/ms';
import tr    from './translations/tr';
import vi    from './translations/vi';
import pl    from './translations/pl';
import nl    from './translations/nl';
import th    from './translations/th';
import uk    from './translations/uk';
import sv    from './translations/sv';
import bg    from './translations/bg';

/* ---- deep-merge helper (override wins over fallback) ---- */
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

/* Raw (non-merged) translation map */
const rawMap = {
  en,
  es,
  'pt-br': ptBr,
  pt,
  fr,
  de,
  hi,
  ur,
  ar,
  id,
  ru,
  ja,
  zh,
  it,
  ko,
  'zh-tw': zhTw,
  ms,
  tr,
  vi,
  pl,
  nl,
  th,
  uk,
  sv,
  bg,
};

/* Pre-build merged cache synchronously at module load time */
const cache = {};
for (const [code, raw] of Object.entries(rawMap)) {
  cache[code] = code === 'en' ? en : deepMerge(en, raw);
}

/**
 * getTranslationsSync — returns already-merged translations instantly.
 * Use this to initialise React state BEFORE the first render so that
 * SEO meta tags are correct on the very first paint.
 */
export function getTranslationsSync(code) {
  return cache[code] ?? en;
}

/**
 * loadTranslations — kept for API compatibility, now returns instantly
 * from the pre-built cache (no async import needed any more).
 */
export async function loadTranslations(code) {
  return cache[code] ?? en;
}

export { en as defaultTranslations };
