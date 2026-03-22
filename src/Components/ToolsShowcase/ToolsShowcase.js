import React, { useRef, useEffect, useLayoutEffect, useState } from 'react';
import './ToolsShowcase.css';

const IMG = (n) => `${process.env.PUBLIC_URL}/Images/Animation/${n}`;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const map   = (v, a, b, c, d) => c + (d - c) * clamp((v - a) / (b - a), 0, 1);

const NSEGS   = 6;          // 1 entry + 5 tools
const SEG     = 1 / NSEGS;
const TOTAL_H = '350vh';

/* ── Static badge data per segment (all right-side on desktop) ── */
const BADGE_DATA = [
  null, // seg 0 (entry)
  [
    { text:'AI Powered',       icon:'fa-microchip',   top:12 },
    { text:'Batch Processing', icon:'fa-layer-group', top:32 },
    { text:'Any Format',       icon:'fa-file-image',  top:52 },
    { text:'Browser Only',     icon:'fa-shield',      top:72 },
  ],
  [
    { text:'Instant Crop',     icon:'fa-bolt',          top:12 },
    { text:'No Server Upload', icon:'fa-shield-halved', top:32 },
    { text:'Optimized Output', icon:'fa-star',          top:52 },
    { text:'Batch Processing', icon:'fa-layer-group',   top:72 },
  ],
  [
    { text:'Privacy First',    icon:'fa-lock',                top:8  },
    { text:'No Server Upload', icon:'fa-shield-halved',       top:24 },
    { text:'No Pixel Damage',  icon:'fa-wand-magic-sparkles', top:40 },
    { text:'Fast Processing',  icon:'fa-bolt',                top:56 },
    { text:'Any Format',       icon:'fa-file-image',          top:72 },
  ],
  [
    { text:'Custom Position',    icon:'fa-crosshairs',  top:8  },
    { text:'Text or Logo',       icon:'fa-font',        top:24 },
    { text:'Adjustable Opacity', icon:'fa-sliders',     top:40 },
    { text:'Batch Support',      icon:'fa-layer-group', top:56 },
    { text:'Browser Only',       icon:'fa-shield',      top:72 },
  ],
  [
    { text:'Up to 90% Smaller', icon:'fa-arrow-down-wide-short', top:8  },
    { text:'No Quality Loss',   icon:'fa-star',                  top:24 },
    { text:'JPEG · PNG · WEBP', icon:'fa-file-image',            top:40 },
    { text:'Batch Support',     icon:'fa-layer-group',           top:56 },
    { text:'Browser Only',      icon:'fa-bolt',                  top:72 },
  ],
];

/* ────────────────────────────────────────────────────── */
/* Build element cache ONCE after mount — no more        */
/* querySelectorAll on every scroll/RAF tick             */
/* ────────────────────────────────────────────────────── */
function buildCache(container) {
  const screenEls = Array.from(container.querySelectorAll('.tsc-screen'));
  const hdrs      = screenEls.map(sc => sc.querySelector('.tsc-tool-hdr'));
  const badgeGroups = screenEls.map(sc => Array.from(sc.querySelectorAll('.tsc-badge')));
  return {
    screenEls,
    hdrs,
    badgeGroups,
    fill:         container.querySelector('.tsc-vprog__fill'),
    vdots:        Array.from(container.querySelectorAll('.tsc-vdot')),
    bgclip:       container.querySelector('.tsc-bgclip'),
    bgLine:       container.querySelector('.tsc-line'),
    cropPath:     container.querySelector('.tsc-crop-dim'),
    cropRect:     container.querySelector('.tsc-crop-rect'),
    cropCorners:  Array.from(container.querySelectorAll('.tsc-crop-corner')),
    cropOrigImg:  container.querySelector('.tsc-crop-orig'),
    cropResImg:   container.querySelector('.tsc-crop-res'),
    cropLbl:      container.querySelector('.tsc-crop-lbl'),
    blurImg:      container.querySelector('.tsc-blur-ov'),
    blurLblL:     container.querySelector('.tsc-blur-lbl-l'),
    blurLblR:     container.querySelector('.tsc-blur-lbl-r'),
    wmImg:        container.querySelector('.tsc-wm-ov'),
    wmLblL:       container.querySelector('.tsc-wm-lbl-l'),
    wmLblR:       container.querySelector('.tsc-wm-lbl-r'),
    compUI:       container.querySelector('.tsc-comp-ui'),
    compLvl:      container.querySelector('.tsc-comp-level'),
    compFill:     container.querySelector('.tsc-comp-fill'),
    compThumb:    container.querySelector('.tsc-comp-thumb'),
    compSzEl:     container.querySelector('.tsc-comp-sz'),
    compOverlay:  container.querySelector('.tsc-comp-overlay'),
    compDone:     container.querySelector('.tsc-comp-done'),
  };
}

/* ────────────────────────────────────────────────────── */
/* All animation math lives here — runs every RAF tick   */
/* Uses pre-built cache — zero DOM queries per frame     */
/* ────────────────────────────────────────────────────── */
function updateFrame(cache, p) {
  if (!cache) return;
  const { screenEls, hdrs, badgeGroups, fill, vdots,
          bgclip, bgLine, cropPath, cropRect, cropCorners,
          cropOrigImg, cropResImg, cropLbl,
          blurImg, blurLblL, blurLblR,
          wmImg, wmLblL, wmLblR,
          compUI, compLvl, compFill, compThumb, compSzEl, compOverlay, compDone } = cache;

  const sp  = (s) => clamp((p - s * SEG) / SEG, 0, 1);
  const sOp = (s) => { const q = sp(s); return map(q,0,.15,0,1) * map(q,.90,1,1,0); };
  const sTy = (s) => { const q = sp(s); return map(q,0,.15,28,0) + map(q,.90,1,0,-28); };
  const tOp = (s) => { const q = sp(s); return map(q,0,.12,0,1) * map(q,.90,1,1,0); };
  const bOp = (s, i, n) => {
    const q = sp(s); const t0 = 0.18 + (i * 0.18) / Math.max(n,1);
    return map(q, t0, t0+.09, 0, 1) * map(q, .88, 1, 1, 0);
  };

  const isMob = window.innerWidth <= 600;

  /* ── Entry screen ── */
  const entryOp = map(p, 0, SEG*.08, 1, 1) * map(p, SEG*.75, SEG, 1, 0);
  if (screenEls[0]) {
    screenEls[0].style.opacity = entryOp;
    screenEls[0].style.pointerEvents = entryOp > 0.2 ? 'auto' : 'none';
  }

  /* ── Tool screens  ── */
  for (let s = 1; s <= 5; s++) {
    const sc = screenEls[s];
    if (!sc) continue;
    const op = sOp(s);
    sc.style.opacity = op;
    sc.style.transform = `translateY(${sTy(s)}px)`;
    sc.style.pointerEvents = op > 0.3 ? 'auto' : 'none';
    const hdr = hdrs[s];
    if (hdr) hdr.style.opacity = tOp(s);

    /* badges — using cached array */
    const badges = badgeGroups[s] || [];
    badges.forEach((badge, i) => {
      const n    = badges.length;
      const side = badge.dataset.side;
      const rot  = parseFloat(badge.dataset.rot) || 0;
      const q    = sp(s);
      const t0   = 0.18 + (i * 0.18) / Math.max(n, 1);
      const slideAmt = map(q, t0, t0+.08, 1, 0) * (isMob ? 18 : 26) + map(q, .88, 1, 0, 1) * (isMob ? 18 : 26);
      const dir  = isMob ? 0 : (side === 'left' ? -1 : 1);
      const dirV = isMob ? 1 : 0;
      badge.style.opacity   = bOp(s, i, n);
      badge.style.transform = `translate(${dir * slideAmt}px, ${dirV * slideAmt}px) rotate(${rot}deg)`;
    });
  }

  /* ── Vertical progress bar ── */
  if (fill) fill.style.height = `${p * 100}%`;
  vdots.forEach((dot, i) => {
    const active = p >= ((i + 1) / NSEGS - 0.01);
    dot.classList.toggle('tsc-vdot--on', active);
  });

  /* ── BG Remover (seg 1) ── */
  const bgSlider = map(sp(1), .40, .84, 1, 0);
  if (bgclip) {
    const wrap = bgclip.parentElement;
    const cW = wrap.offsetWidth, cH = wrap.offsetHeight;
    const visW = cW / cH > 1 ? cH : cW;
    const offX = (cW - visW) / 2;
    const leftPx  = offX + bgSlider * visW;
    const leftPct = (leftPx / cW) * 100;
    bgclip.style.clipPath = `inset(0 0 0 ${leftPct}%)`;
    if (bgLine) bgLine.style.left = `${leftPct}%`;
  }

  /* ── Crop (seg 2) ── */
  const cropDash   = map(sp(2), .40, .65, 1, 0);
  const dimOp      = map(sp(2), .50, .65, 0, 1);
  const cropOrigOp = map(sp(2), .65, .82, 1, 0);
  const cropResOp  = map(sp(2), .65, .82, 0, 1);
  const cropResSc  = map(sp(2), .65, .82, .88, 1);
  if (cropPath) cropPath.style.opacity = dimOp * cropOrigOp;
  if (cropRect) {
    const PERIM = 2 * (381 + 381);
    cropRect.style.strokeDashoffset = PERIM * cropDash;
    cropRect.style.opacity = cropOrigOp;
  }
  cropCorners.forEach(c => { c.style.opacity = (1 - cropDash) * cropOrigOp; });
  if (cropOrigImg) cropOrigImg.style.opacity = cropOrigOp;
  if (cropResImg) {
    cropResImg.style.opacity   = cropResOp;
    cropResImg.style.transform = `scale(${cropResSc})`;
  }
  if (cropLbl) {
    cropLbl.style.opacity = cropResOp;
    cropLbl.style.display = cropResOp > 0.02 ? '' : 'none';
  }

  /* ── Face Blur (seg 3) ── */
  const blurOp  = map(sp(3), .42, .82, 0, 1);
  if (blurImg)  blurImg.style.opacity  = blurOp;
  if (blurLblL) blurLblL.style.opacity = 1 - blurOp;
  if (blurLblR) blurLblR.style.opacity = blurOp;

  /* ── Watermark (seg 4) ── */
  const wmOp  = map(sp(4), .42, .82, 0, 1);
  if (wmImg)  wmImg.style.opacity  = wmOp;
  if (wmLblL) wmLblL.style.opacity = 1 - wmOp;
  if (wmLblR) wmLblR.style.opacity = wmOp;

  /* ── Compressor (seg 5) ── */
  const compVal  = Math.round(map(sp(5), .40, .68, 0, 80));
  const compSize = (33.2 - (33.2 - 11.4) * compVal / 80).toFixed(1);
  const compOvl  = map(sp(5), .70, .86, 0, 1);
  const compChk  = map(sp(5), .86, .96, 0, 1);
  if (compUI)      compUI.style.opacity      = 1 - compOvl;
  if (compLvl)     compLvl.textContent       = `${compVal}%`;
  if (compFill)    compFill.style.width      = `${compVal}%`;
  if (compThumb)   compThumb.style.left      = `${compVal}%`;
  if (compSzEl)    compSzEl.textContent      = `${compSize} KB`;
  if (compOverlay) compOverlay.style.opacity = compOvl;
  if (compDone) {
    compDone.style.opacity   = compChk;
    compDone.style.transform = `scale(${0.72 + compChk * 0.28})`;
    compDone.style.display   = compChk > 0.01 ? '' : 'none';
  }
}

/* ═══════════════════════════════════════════════════════ */
export default function ToolsShowcase() {
  const outerRef  = useRef(null);
  const stickyRef = useRef(null);
  const rafRef    = useRef(null);
  const hintTimer = useRef(null);
  const hintShownRef = useRef(false);
  const cacheRef  = useRef(null);   // DOM element cache
  const lastPRef  = useRef(0);      // last scroll progress — needed for resize redraws
  const [showHint, setShowHint] = useState(false);

  /* ── Build DOM cache and paint initial frame BEFORE first paint ── */
  /* useLayoutEffect fires synchronously after DOM mutations but before     */
  /* the browser has painted. This means all screen opacities are set to   */
  /* their correct values (entry screen = 1, others = 0) before the user   */
  /* sees anything — eliminating the blank-flash on mount / remount.       */
  useLayoutEffect(() => {
    const container = stickyRef.current;
    if (!container) return;
    cacheRef.current = buildCache(container);
    updateFrame(cacheRef.current, 0);
  }, []);

  /* ── Imperative scroll animation (listeners only — no initial draw) ── */
  useEffect(() => {
    const container = stickyRef.current;
    if (!container) return;

    const getP = () => {
      if (!outerRef.current) return lastPRef.current;
      const { top, height } = outerRef.current.getBoundingClientRect();
      const scrollable = height - window.innerHeight;
      return scrollable > 0 ? clamp(-top / scrollable, 0, 1) : 0;
    };

    const onScroll = () => {
      if (hintShownRef.current) {
        hintShownRef.current = false;
        setShowHint(false);
      }
      clearTimeout(hintTimer.current);
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const p = getP();
        lastPRef.current = p;
        updateFrame(cacheRef.current, p);
        if (p > 0.03 && p < 0.96) {
          hintTimer.current = setTimeout(() => {
            hintShownRef.current = true;
            setShowHint(true);
          }, 3000);
        }
      });
    };

    /* Resize / orientation — re-draw at current scroll position */
    const onResize = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        updateFrame(cacheRef.current, lastPRef.current);
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('orientationchange', onResize, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
      cancelAnimationFrame(rafRef.current);
      clearTimeout(hintTimer.current);
    };
  }, []);

  const skip = () => {
    if (!outerRef.current) return;
    window.scrollTo({ top: outerRef.current.offsetTop + outerRef.current.offsetHeight, behavior: 'smooth' });
  };

  /* ── Static badge renderer (uniform style, all right-side) ── */
  const renderBadges = (seg) =>
    (BADGE_DATA[seg] || []).map((b, i) => (
      <div key={i}
        className="tsc-badge tsc-badge--right"
        data-side="right"
        data-rot="0"
        style={{ top: `${b.top}%`, opacity: 0 }}
      >
        <i className={`fa-solid ${b.icon}`}/> {b.text}
      </div>
    ));

  /* ════════════════════════════════════════════════════════ */
  return (
    <div ref={outerRef} style={{ height: TOTAL_H, position: 'relative' }}>
      <div
        ref={stickyRef}
        className="tsc-sticky"
        style={{
          backgroundImage: 'url(/Images/showcase-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Skip */}
        <button className="tsc-skip" onClick={skip}>
          Skip <i className="fa-solid fa-forward-step"/>
        </button>

        {/* Vertical progress bar */}
        <div className="tsc-vprog">
          <div className="tsc-vprog__fill"/>
          {[1,2,3,4,5].map(i => (
            <div key={i} className="tsc-vdot" style={{ top:`${(i / NSEGS) * 100}%` }}>
              <span className="tsc-vdot__lbl">
                {['BG Remove','Crop','Face Blur','Watermark','Compress'][i - 1]}
              </span>
            </div>
          ))}
        </div>

        {/* ══ Entry (seg 0) ══ */}
        <div className="tsc-screen" style={{ opacity: 0 }}>
          <h2 className="tsc-wcu">Why Choose Us</h2>
          <p className="tsc-wcu-sub">Scroll to explore what makes photremium.com the smartest choice</p>
          <div className="tsc-entry-cta">
            <div className="tsc-entry-ring tsc-entry-ring--3"/>
            <div className="tsc-entry-ring tsc-entry-ring--2"/>
            <div className="tsc-entry-ring tsc-entry-ring--1"/>
            <div className="tsc-entry-core">
              <i className="fa-solid fa-angles-down"/>
              <span>Scroll</span>
            </div>
          </div>
          <div className="tsc-wcu-pills">
            {['BG Remover','Crop','Face Blur','Watermark','Compressor'].map((t, i) => (
              <span key={i} className="tsc-wcu-pill">{t}</span>
            ))}
          </div>
        </div>

        {/* ══ BG Remover (seg 1) ══ */}
        <div className="tsc-screen" style={{ opacity: 0 }}>
          <div className="tsc-tool-hdr" style={{ opacity: 0 }}>
            <i className="fa-solid fa-eraser"/><span>Background Remover</span>
          </div>
          <div className="tsc-stage">
            {renderBadges(1)}
            <div className="tsc-imgwrap">
              {/* LEFT: original always visible */}
              <img src={IMG('bag.jpg')} className="tsc-img" alt="original"/>
              {/* RIGHT of slider: removed bg — clip from left edge */}
              <div className="tsc-bgclip" style={{ clipPath:'inset(0 0 0 100%)' }}>
                <img src={IMG('bag-removed.png')} className="tsc-img" alt="removed"/>
              </div>
              <div className="tsc-line" style={{ left:'100%' }}>
                <div className="tsc-handle"><i className="fa-solid fa-left-right"/></div>
              </div>
              <span className="tsc-lbl tsc-lbl--l">ORIGINAL</span>
              <span className="tsc-lbl tsc-lbl--r">REMOVED</span>
            </div>
          </div>
        </div>

        {/* ══ Crop (seg 2) ══ */}
        <div className="tsc-screen" style={{ opacity: 0 }}>
          <div className="tsc-tool-hdr" style={{ opacity: 0 }}>
            <i className="fa-solid fa-crop-simple"/><span>Crop Image</span>
          </div>
          <div className="tsc-stage">
            {renderBadges(2)}
            <div className="tsc-imgwrap">
              <img src={IMG('car.jpg')} className="tsc-img tsc-crop-orig" alt="car"/>
              {/* SVG viewBox matches car.jpg natural size (700×700) for pixel-perfect crop overlay */}
              <svg className="tsc-svg" viewBox="0 0 700 700" preserveAspectRatio="xMidYMid meet">
                {/* Dim overlay with crop hole */}
                <path className="tsc-crop-dim"
                  d="M0,0 H700 V700 H0Z M162.5,198.5 H543.5 V579.5 H162.5Z"
                  fill="rgba(0,0,0,0.54)" fillRule="evenodd"
                  style={{ opacity: 0 }}
                />
                {/* Crop border */}
                <rect className="tsc-crop-rect"
                  x="162.5" y="198.5" width="381" height="381"
                  fill="none" stroke="#fff" strokeWidth="4"
                  strokeDasharray="1524" strokeDashoffset="1524"
                  style={{ opacity: 0 }}
                />
                {/* Corner markers */}
                {[[162.5,198.5],[543.5,198.5],[162.5,579.5],[543.5,579.5]].map(([cx,cy],ci) => (
                  <rect key={ci} className="tsc-crop-corner"
                    x={cx - 12} y={cy - 12} width={24} height={24} fill="#fff"
                    style={{ opacity: 0 }}
                  />
                ))}
              </svg>
              <img src={IMG('car-cropped.jpg')} className="tsc-img tsc-abs tsc-crop-res" alt="cropped"
                style={{ opacity: 0, transform:'scale(0.88)' }}/>
              <span className="tsc-lbl tsc-lbl--r tsc-crop-lbl" style={{ opacity:0, display:'none' }}>CROPPED</span>
            </div>
          </div>
        </div>

        {/* ══ Face Blur (seg 3) ══ */}
        <div className="tsc-screen" style={{ opacity: 0 }}>
          <div className="tsc-tool-hdr" style={{ opacity: 0 }}>
            <i className="fa-solid fa-user-shield"/><span>Face Blur</span>
          </div>
          <div className="tsc-stage">
            {renderBadges(3)}
            <div className="tsc-imgwrap">
              <img src={IMG('blur.jpg')} className="tsc-img" alt="original"/>
              <img src={IMG('blur_blurred.png')} className="tsc-img tsc-abs tsc-blur-ov"
                style={{ opacity: 0 }} alt="blurred"/>
              <span className="tsc-lbl tsc-lbl--l tsc-blur-lbl-l">ORIGINAL</span>
              <span className="tsc-lbl tsc-lbl--r tsc-blur-lbl-r" style={{ opacity:0 }}>BLURRED</span>
            </div>
          </div>
        </div>

        {/* ══ Watermark (seg 4) ══ */}
        <div className="tsc-screen" style={{ opacity: 0 }}>
          <div className="tsc-tool-hdr" style={{ opacity: 0 }}>
            <i className="fa-solid fa-stamp"/><span>Watermark Image</span>
          </div>
          <div className="tsc-stage">
            {renderBadges(4)}
            <div className="tsc-imgwrap">
              <img src={IMG('watermark.jpg')} className="tsc-img" alt="original"/>
              <img src={IMG('watermark-watermarked.jpg')} className="tsc-img tsc-abs tsc-wm-ov"
                style={{ opacity: 0 }} alt="watermarked"/>
              <span className="tsc-lbl tsc-lbl--l tsc-wm-lbl-l">ORIGINAL</span>
              <span className="tsc-lbl tsc-lbl--r tsc-wm-lbl-r" style={{ opacity:0 }}>WATERMARKED</span>
            </div>
          </div>
        </div>

        {/* ══ Compressor (seg 5) ══ */}
        <div className="tsc-screen" style={{ opacity: 0 }}>
          <div className="tsc-tool-hdr" style={{ opacity: 0 }}>
            <i className="fa-solid fa-compress"/><span>Image Compressor</span>
          </div>
          <div className="tsc-stage">
            {renderBadges(5)}
            <div className="tsc-imgwrap">
              <img src={IMG('compress.jpg')} className="tsc-img" alt="compress"/>
              <div className="tsc-comp-ui">
                <div className="tsc-comp-row">
                  <span>Compression Level</span>
                  <strong className="tsc-comp-level">0%</strong>
                </div>
                <div className="tsc-comp-track">
                  <div className="tsc-comp-fill" style={{ width:'0%' }}/>
                  <div className="tsc-comp-thumb" style={{ left:'0%' }}/>
                </div>
                <div className="tsc-comp-row tsc-comp-sizes">
                  <span>Original: <b>33.2 KB</b></span>
                  <span>Result: <b className="tsc-green tsc-comp-sz">33.2 KB</b></span>
                </div>
              </div>
              <div className="tsc-comp-overlay" style={{ opacity:0 }}/>
              <div className="tsc-comp-done" style={{ opacity:0, transform:'scale(0.72)', display:'none' }}>
                <i className="fa-solid fa-circle-check"/>
                <span>Compressed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        {showHint && (
          <div className="tsc-hint">
            <div className="tsc-hint__mouse"><div className="tsc-hint__wheel"/></div>
            <span>Scroll down</span>
          </div>
        )}

      </div>
    </div>
  );
}