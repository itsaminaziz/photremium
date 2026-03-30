import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useContact } from '../../context/ContactContext';
import './FAQ.css';

const FAQ = ({ faqs, faqKey }) => {
  const [openIndex, setOpenIndex] = useState(null);
  const { t } = useLanguage();
  const { openContact } = useContact();

  /* Use translated FAQ data when faqKey is provided, otherwise fall back to raw faqs prop */
  const items = faqKey ? (t(`faqData.${faqKey}`) || []) : (faqs || []);

  const toggle = (i) => {
    setOpenIndex((prev) => (prev === i ? null : i));
  };

  const renderInlineTextWithLinks = (text) => {
    const parts = text.split(/(https?:\/\/[^\s]+)/gi);
    return parts.map((part, index) => {
      if (/^https?:\/\//i.test(part)) {
        return (
          <a
            key={`link-${index}`}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="faq-table__answer-link"
          >
            {part}
          </a>
        );
      }
      return <React.Fragment key={`text-${index}`}>{part}</React.Fragment>;
    });
  };

  const renderAnswer = (answer) => {
    if (typeof answer !== 'string') return answer;

    const clean = answer.trim();
    const lines = clean
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    const emojiHeadingLines = lines.filter((line) => /^[✅❌].*?:/.test(line));
    if (emojiHeadingLines.length >= 2 && emojiHeadingLines.length === lines.length) {
      return (
        <>
          {lines.map((line, index) => {
            const colonIndex = line.indexOf(':');
            if (colonIndex > 0) {
              const heading = line.slice(0, colonIndex + 1);
              const rest = line.slice(colonIndex + 1).trim();
              return (
                <p className="faq-table__answer-text" key={`emoji-line-${index}`}>
                  <strong>{heading}</strong>{' '}
                  {renderInlineTextWithLinks(rest)}
                </p>
              );
            }
            return <p className="faq-table__answer-text" key={`emoji-line-${index}`}>{renderInlineTextWithLinks(line)}</p>;
          })}
        </>
      );
    }

    if (lines.length >= 2) {
      const intro = lines[0];
      const formatsLine = lines.slice(1).join(' ').trim();
      const isFormatsOnly = /^\.[a-z0-9]+(?:\s+\.[a-z0-9]+)*$/i.test(formatsLine);

      if (isFormatsOnly) {
        const formatTags = formatsLine.split(/\s+/).filter(Boolean);

        return (
          <>
            <p className="faq-table__answer-text">{renderInlineTextWithLinks(intro)}</p>
            <div className="faq-table__answer-tags" aria-label="Supported formats">
              {formatTags.map((formatTag, index) => (
                <span className="faq-table__answer-tag" key={`fmt-${index}`}>
                  {formatTag}
                </span>
              ))}
            </div>
          </>
        );
      }
    }

    const firstRomanIndex = clean.search(/\b(?:i|ii|iii|iv|v|vi|vii|viii|ix|x)\.\s+/i);

    if (firstRomanIndex > 0) {
      const intro = clean.slice(0, firstRomanIndex).trim();
      const pointsChunk = clean.slice(firstRomanIndex).trim();
      const points = pointsChunk
        .split(/\s+(?=(?:i|ii|iii|iv|v|vi|vii|viii|ix|x)\.\s+)/i)
        .map((point) => point.replace(/^(?:i|ii|iii|iv|v|vi|vii|viii|ix|x)\.\s+/i, '').trim())
        .filter(Boolean);

      return (
        <>
          {intro && <p className="faq-table__answer-text">{renderInlineTextWithLinks(intro)}</p>}
          {points.length > 0 && (
            <ul className="faq-table__answer-list">
              {points.map((point, index) => {
                const colonIndex = point.indexOf(':');
                const hasHeading = colonIndex > 0;
                const heading = hasHeading ? point.slice(0, colonIndex).trim() : '';
                const rest = hasHeading ? point.slice(colonIndex + 1).trim() : point;

                return (
                  <li key={`pt-${index}`}>
                    {hasHeading ? (
                      <>
                        <strong>{heading}:</strong>{' '}
                        {renderInlineTextWithLinks(rest)}
                      </>
                    ) : (
                      renderInlineTextWithLinks(rest)
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </>
      );
    }

    const leadingBoldMatch = clean.match(/^\*\*([^*]+)\*\*([,:-]?)\s*(.*)$/);
    if (leadingBoldMatch) {
      const [, label, punctuation, rest] = leadingBoldMatch;
      return (
        <p className="faq-table__answer-text">
          <strong>{`${label}${punctuation}`}</strong>
          {rest ? <> {renderInlineTextWithLinks(rest)}</> : null}
        </p>
      );
    }

    return <p className="faq-table__answer-text">{renderInlineTextWithLinks(clean)}</p>;
  };

  if (!items.length) return null;

  return (
    <section className="faq-section">
      {/* Header */}
      <div className="faq-header">
        <span className="faq-header__badge">
          <i className="fa-solid fa-circle-question"></i> {t('faq.badge')}
        </span>
        <h2 className="faq-header__title">{t('faq.heading')}</h2>
        <p className="faq-header__subtitle">
          {t('faq.subheading')}
        </p>
      </div>

      {/* FAQ Table */}
      <div className="faq-table-wrapper">
        <table className="faq-table">
          <thead>
            <tr>
              <th className="faq-table__th faq-table__th--num">#</th>
              <th className="faq-table__th faq-table__th--question">{t('faq.questionHeader')}</th>
            </tr>
          </thead>
          {items.map((item, i) => {
            const isOpen = openIndex === i;

            return (
              <tbody key={i}>
                <tr
                  className={`faq-table__row${isOpen ? ' faq-table__row--active' : ''}`}
                  onClick={() => toggle(i)}
                >
                  <td className="faq-table__cell faq-table__cell--num">
                    <span className="faq-table__num-badge">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </td>
                  <td className="faq-table__cell faq-table__cell--question">
                    <div className="faq-table__q-btn">
                      <span className="faq-table__q-text">{item.q}</span>
                      <span className={`faq-table__q-icon${isOpen ? ' faq-table__q-icon--open' : ''}`}>
                        <i className="fa-solid fa-chevron-down"></i>
                      </span>
                    </div>
                  </td>
                </tr>

                {isOpen && (
                  <tr className="faq-table__expand-row faq-table__expand-row--open">
                    <td className="faq-table__expand-cell" colSpan="2">
                      <div className="faq-table__expand-content">
                        {renderAnswer(item.a)}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            );
          })}
        </table>
      </div>

      {/* Contact CTA */}
      <div className="faq-contact">
        <p className="faq-contact__text">
          {t('faq.stillHaveQuestions')}
        </p>
        <button className="faq-contact__btn" onClick={openContact}>
          <i className="fa-solid fa-headset"></i>
          <span>{t('faq.reachOut')}</span>
        </button>
      </div>
    </section>
  );
};

export default FAQ;