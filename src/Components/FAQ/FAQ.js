import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import './FAQ.css';

const FAQ = ({ faqs, faqKey }) => {
  const [openIndex, setOpenIndex] = useState(null);
  const { t, localePath } = useLanguage();

  /* Use translated FAQ data when faqKey is provided, otherwise fall back to raw faqs prop */
  const items = faqKey ? (t(`faqData.${faqKey}`) || []) : (faqs || []);

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

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
          <tbody>
            {items.map((item, i) => (
              <React.Fragment key={i}>
                {/* Question row */}
                <tr
                  className={`faq-table__row${openIndex === i ? ' faq-table__row--active' : ''}`}
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
                      <span className={`faq-table__q-icon${openIndex === i ? ' faq-table__q-icon--open' : ''}`}>
                        <i className="fa-solid fa-chevron-down"></i>
                      </span>
                    </div>
                  </td>
                </tr>
                {/* Expandable answer row */}
                {openIndex === i && (
                  <tr className="faq-table__expand-row faq-table__expand-row--open">
                    <td className="faq-table__expand-cell" colSpan="2">
                      <div className="faq-table__expand-content">
                        {item.a}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Contact CTA */}
      <div className="faq-contact">
        <p className="faq-contact__text">
          {t('faq.stillHaveQuestions')}
        </p>
        <Link to={localePath('/')} className="faq-contact__btn">
          <i className="fa-solid fa-headset"></i>
          <span>{t('faq.reachOut')}</span>
        </Link>
      </div>
    </section>
  );
};

export default FAQ;