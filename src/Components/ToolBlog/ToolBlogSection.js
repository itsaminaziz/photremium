import React from 'react';
import { toolBlogContent } from './toolBlogContent';
import './ToolBlogSection.css';

const ToolBlogSection = ({ toolKey }) => {
  const content = toolBlogContent[toolKey];

  if (!content || !Array.isArray(content.sections) || content.sections.length === 0) {
    return null;
  }

  return (
    <section className="tool-blog" aria-label={`${toolKey} blog section`}>
      <div className="tool-blog__card">
        {content.badge ? (
          <span className="tool-blog__badge">
            <i className="fa-solid fa-feather-pointed"></i> {content.badge}
          </span>
        ) : null}

        <h2 className="tool-blog__title">{content.title}</h2>
        {content.intro ? <p className="tool-blog__intro">{content.intro}</p> : null}

        <div className="tool-blog__grid">
          {content.sections.map((section) => (
            <article className="tool-blog__item" key={section.heading}>
              <h3>{section.heading}</h3>
              <p>{section.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ToolBlogSection;
