import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { LANG_CODES } from '../i18n/languages';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  // Strip the language prefix so scroll-to-top only fires on actual PAGE
  // changes and NOT on language switches (e.g. /es/about → /fr/about keeps
  // the user at their current scroll position, which is the expected UX).
  const segments = pathname.split('/').filter(Boolean);
  const strippedPathname =
    segments.length > 0 && LANG_CODES.has(segments[0])
      ? '/' + segments.slice(1).join('/')
      : pathname || '/';

  /* useLayoutEffect fires synchronously after the DOM is updated but BEFORE
     the browser paints. This means the scroll resets to 0 before the user
     ever sees a single pixel of the new page. */
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [strippedPathname]); // only react to page changes, not lang changes

  return null;
};

export default ScrollToTop;