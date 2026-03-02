import React, { useState, useRef, useCallback } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import './LanguageSwitcher.css';

const LanguageSwitcher = ({ variant }) => {
  const { lang, setLanguage, languages } = useLanguage();
  const [open, setOpen] = useState(false);
  const closeTimer = useRef(null);

  const current = languages.find((l) => l.code === lang) || languages[0];

  const handleEnter = useCallback(() => {
    clearTimeout(closeTimer.current);
    setOpen(true);
  }, []);

  const handleLeave = useCallback(() => {
    closeTimer.current = setTimeout(() => setOpen(false), 200);
  }, []);

  const cls = `lang-switch${variant === 'footer' ? ' lang-switch--footer' : ''}${open ? ' lang-switch--open' : ''}`;

  return (
    <div
      className={cls}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <button className="lang-switch__btn" aria-label="Select language">
        <span className={`fi fi-${current.countryCode} lang-switch__flag`}></span>
        <span className="lang-switch__current">{current.name}</span>
        <i className="fa-solid fa-chevron-down lang-switch__chevron"></i>
      </button>

      <ul className="lang-switch__menu">
        {languages.map((l) => (
          <li key={l.code}>
            <button
              className={`lang-switch__option ${l.code === lang ? 'lang-switch__option--active' : ''}`}
              onClick={() => { setLanguage(l.code); setOpen(false); }}
            >
              <span className={`fi fi-${l.countryCode} lang-switch__option-flag`}></span>
              <span className="lang-switch__option-name">{l.name}</span>
              {l.code === lang && <i className="fa-solid fa-check lang-switch__check"></i>}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LanguageSwitcher;
