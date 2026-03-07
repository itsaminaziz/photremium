import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import './ShowcaseSection.css';

const TOOLS = [
  { key: 'compressImage',    image: 'image-compressor.webp',   link: '/image-compressor'   },
  { key: 'resizeImage',      image: 'image-resizer.webp',      link: '/resize-image'        },
  { key: 'cropImage',        image: 'image-croper.webp',       link: '/crop-image'          },
  { key: 'convertToJpg',     image: 'convert-to-jpg.webp',     link: '/image-converter'     },
  { key: 'convertFromJpg',   image: 'convert-from-jpg.webp',   link: '/image-converter'     },
  { key: 'qrCodeGenerator',  image: 'qr-code-generator.webp',  link: '/qr-code-generator'   },
  { key: 'qrCodeScanner',    image: 'qr-code-scanner.webp',    link: '/qr-code-scanner'     },
  { key: 'blurFace',         image: 'blur-face.webp',          link: '/face-blur'           },
  { key: 'removeBackground', image: 'background-remover.webp', link: '/remove-background'   },
  { key: 'watermarkImage',   image: 'watermark-image.webp',    link: '/watermark-image'     },
];

const DOUBLED      = [...TOOLS, ...TOOLS]; // seamless loop
const ITEM_H       = 92;                   // px — slot height in track
const SPEED        = 0.55;                 // px / frame
const TOTAL        = TOOLS.length * ITEM_H; // one full cycle

const ShowcaseSection = () => {
  const { t, localePath } = useLanguage();
  const trackRef  = useRef(null);
  const clipRef   = useRef(null);
  const posRef    = useRef(0);
  const rafRef    = useRef(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    const tick = () => {
      if (!pausedRef.current && trackRef.current && clipRef.current) {
        posRef.current += SPEED;
        if (posRef.current >= TOTAL) posRef.current -= TOTAL;

        trackRef.current.style.transform = `translateY(-${posRef.current}px)`;

        // Scale + opacity based on distance from clip centre
        const containerH = clipRef.current.clientHeight;
        const centerY    = containerH / 2;
        const items      = trackRef.current.children;

        for (let i = 0; i < items.length; i++) {
          const itemCenterY = i * ITEM_H + ITEM_H / 2 - posRef.current;
          const dist        = Math.abs(itemCenterY - centerY);
          const norm        = Math.min(1, dist / (containerH * 0.44));
          const scale       = (1 - 0.32 * norm).toFixed(3);
          const opacity     = (1 - 0.70 * norm).toFixed(3);
          items[i].style.transform = `scale(${scale})`;
          items[i].style.opacity   = opacity;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <section className="sc-section">
      <div className="sc-card">

        {/* ══ LEFT — vertical carousel ══ */}
        <div
          className="sc-left"
          onMouseEnter={() => { pausedRef.current = true;  }}
          onMouseLeave={() => { pausedRef.current = false; }}
        >
          <div className="sc-clip" ref={clipRef}>
            <div className="sc-track" ref={trackRef}>
              {DOUBLED.map((tool, i) => {
                const data = t(`tools.${tool.key}`) || {};
                return (
                  <div key={i} className="sc-tool">
                    <img
                      src={`${process.env.PUBLIC_URL}/Images/${tool.image}`}
                      alt={data.title || tool.key}
                      className="sc-tool__img"
                      draggable={false}
                    />
                    <span className="sc-tool__name">{data.title || tool.key}</span>
                    <Link
                      to={localePath(tool.link)}
                      className="sc-tool__try"
                    >
                      Try Now <i className="fa-solid fa-arrow-right"></i>
                    </Link>
                  </div>
                );
              })}
            </div>
            <div className="sc-fade sc-fade--top"    aria-hidden="true" />
            <div className="sc-fade sc-fade--bottom" aria-hidden="true" />
          </div>
        </div>

        {/* ══ CENTER — text ══ */}
        <div className="sc-center">
          <p className="sc-eyebrow">
            <i className="fa-solid fa-wand-magic-sparkles"></i>&nbsp; All-in-One Image Suite
          </p>

          <h2 className="sc-heading">
            Every Image Tool<br />
            <span className="sc-heading--accent">You'll Ever Need</span>
          </h2>

          <p className="sc-desc">
            Convert, compress, resize, crop, watermark, remove backgrounds
            and blur faces — entirely in your browser. Zero uploads,
            zero storage, zero limits.
          </p>

          <ul className="sc-list">
            <li><i className="fa-solid fa-bolt"></i>        Instant results — no waiting</li>
            <li><i className="fa-solid fa-lock"></i>        100% private — files stay on your device</li>
            <li><i className="fa-solid fa-infinity"></i>    Completely free — no account required</li>
            <li><i className="fa-solid fa-layer-group"></i> Batch processing for multiple files</li>
          </ul>

          <div className="sc-stats">
            <div className="sc-stat"><strong>5M+</strong><span>Images Processed</span></div>
            <div className="sc-stat"><strong>120+</strong><span>Countries</span></div>
            <div className="sc-stat"><strong>10+</strong><span>Free Tools</span></div>
          </div>

          <Link to={localePath('/image-converter')} className="sc-cta">
            <i className="fa-solid fa-rocket"></i> Start Editing — It's Free
          </Link>
        </div>

        {/* ══ RIGHT — infograph image ══ */}
        <div className="sc-right">
          <img
            src={`${process.env.PUBLIC_URL}/Images/home-infograph.png`}
            alt="favIMG platform overview"
            className="sc-infograph"
            draggable={false}
          />
        </div>

      </div>
    </section>
  );
};

export default ShowcaseSection;
