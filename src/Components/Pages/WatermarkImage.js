import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import SEO from '../SEO/SEO';
import FAQ from '../FAQ/FAQ';
import MobileImportPopup from '../MobileImportPopup/MobileImportPopup';
import { useLanguage } from '../../context/LanguageContext';
import './WatermarkImage.css';

/* ---- helpers ---- */
const fmtSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};
const getExt = (name) => (name.match(/\.([^.]+)$/)?.[1] || 'img').toUpperCase();

const FONTS = [
  'Arial', 'Verdana', 'Georgia', 'Times New Roman', 'Courier New',
  'Impact', 'Comic Sans MS', 'Trebuchet MS', 'Palatino', 'Garamond',
  'Brush Script MT', 'Lucida Console',
];

const loadDimensions = (file) =>
  new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => { URL.revokeObjectURL(url); resolve({ w: img.naturalWidth, h: img.naturalHeight }); };
    img.onerror = () => { URL.revokeObjectURL(url); resolve({ w: 0, h: 0 }); };
    img.src = url;
  });

/* ID counter */
let _layerId = 0;
const nextLayerId = () => `layer-${++_layerId}`;

/* Default text layer */
const makeTextLayer = (canvasW, canvasH, scale) => ({
  id: nextLayerId(),
  type: 'text',
  text: 'Type here...',
  fontFamily: 'Arial',
  fontSize: window.innerWidth <= 900 ? 48 : 32,
  bold: false,
  italic: false,
  underline: false,
  color: '#ffffff',
  bgColor: 'transparent',
  strokeColor: '#000000',
  strokeWidth: 0,
  opacity: 100,
  align: 'left',
  rotation: 0,
  flipH: false,
  flipV: false,
  visible: true,
  locked: false,
  tile: 'none',
  tileSpacing: 40,
  x: Math.round((canvasW / scale) * 0.1),
  y: Math.round((canvasH / scale) * 0.3),
  width: Math.round((canvasW / scale) * 0.6),
  height: Math.round(60 / scale),
});

/* Default image layer */
const makeImageLayer = (file, imgW, imgH, canvasW, canvasH, scale) => {
  /* Scale to fit within 30% of canvas, maintaining aspect ratio (never upscale) */
  const areaW = canvasW / scale;
  const areaH = canvasH / scale;
  const maxW = areaW * 0.3;
  const maxH = areaH * 0.3;
  const ratio = Math.min(maxW / Math.max(1, imgW), maxH / Math.max(1, imgH), 1);
  const w = Math.round(imgW * ratio);
  const h = Math.round(imgH * ratio);
  return {
  id: nextLayerId(),
  type: 'image',
  file,
  name: file.name,
  preview: URL.createObjectURL(file),
  origW: imgW,
  origH: imgH,
  width: w,
  height: h,
  x: Math.round((areaW - w) / 2),
  y: Math.round((areaH - h) / 2),
  opacity: 100,
  rotation: 0,
  flipH: false,
  flipV: false,
  visible: true,
  locked: false,
  borderWidth: 0,
  borderColor: '#000000',
  borderStyle: 'solid',
  borderRadius: 0,
  borderRadiusTL: 0,
  borderRadiusTR: 0,
  borderRadiusBL: 0,
  borderRadiusBR: 0,
  separateCorners: false,
  tile: 'none',
  tileSpacing: 40,
};
};

/* roundRect helper (used in canvas export) */
const roundRect = (ctx, x, y, w, h, r) => {
  ctx.beginPath();
  ctx.moveTo(x + r.tl, y);
  ctx.lineTo(x + w - r.tr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r.tr);
  ctx.lineTo(x + w, y + h - r.br);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r.br, y + h);
  ctx.lineTo(x + r.bl, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r.bl);
  ctx.lineTo(x, y + r.tl);
  ctx.quadraticCurveTo(x, y, x + r.tl, y);
  ctx.closePath();
};

/* ============================================= */
/*          WATERMARK IMAGE PAGE                 */
/* ============================================= */
const WatermarkImage = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const [images, setImages] = useState([]);
  const [selectedImgId, setSelectedImgId] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false);
  const [downloadMode, setDownloadMode] = useState('zip');
  const [processing, setProcessing] = useState(false);
  const [dimWarning, setDimWarning] = useState(null);

  /* Layers = watermark objects */
  const [layers, setLayers] = useState([]);
  const [selectedLayerId, setSelectedLayerId] = useState(null);
  const [mode, setMode] = useState('text'); // eslint-disable-line no-unused-vars
  const [showGuides, setShowGuides] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  /* Canvas scale (zoom level) */
  const [scale, setScale] = useState(1);
  const [naturalDims, setNaturalDims] = useState({ w: 0, h: 0 });

  /* Guides */
  const [guideH, setGuideH] = useState(false);
  const [guideV, setGuideV] = useState(false);

  /* Refs */
  const fileInputRef = useRef(null);
  const addFileInputRef = useRef(null);
  const wmImageInputRef = useRef(null);
  const canvasRef = useRef(null);
  const bgImgRef = useRef(null);
  const layersRef = useRef(layers);
  const didPrefillFromStateRef = useRef(false);
  const dragDepthRef = useRef(0);
  layersRef.current = layers;
  const selected = images.find((i) => i.id === selectedImgId) || null;
  const totalSize = images.reduce((s, i) => s + i.file.size, 0);
  const selectedLayer = layers.find((l) => l.id === selectedLayerId) || null;

  /* Close dropdown when selection changes */
  useEffect(() => { setOpenDropdown(null); }, [selectedLayerId]);

  /* --- beforeunload --- */
  useEffect(() => {
    const h = (e) => {
      if (images.length) { e.preventDefault(); e.returnValue = ''; }
    };
    window.addEventListener('beforeunload', h);
    return () => window.removeEventListener('beforeunload', h);
  }, [images.length]);

  /* --- popstate (back button) guard --- */
  useEffect(() => {
    if (!images.length) return;
    const handler = () => {
      if (!window.confirm(t('common.unsavedEdits'))) {
        window.history.pushState(null, '', window.location.href);
      }
    };
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, [images.length]);

  /* --- hide footer when workspace is active --- */
  useEffect(() => {
    if (images.length > 0) {
      document.body.classList.add('wm-workspace-active');
    } else {
      document.body.classList.remove('wm-workspace-active');
    }
    return () => document.body.classList.remove('wm-workspace-active');
  }, [images.length]);

  /* --- add files --- */
  const addFiles = useCallback(async (files) => {
    const valid = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (!valid.length) return;
    const newImgs = await Promise.all(
      valid.map(async (file) => {
        const dims = await loadDimensions(file);
        return { id: crypto.randomUUID(), file, preview: URL.createObjectURL(file), origW: dims.w, origH: dims.h };
      })
    );
    setImages((prev) => {
      const merged = [...prev, ...newImgs];
      if (prev.length === 0 && newImgs.length > 0) setSelectedImgId(newImgs[0].id);

      /* Resolution consistency check (5% tolerance) */
      if (merged.length > 1) {
        const refW = merged[0].origW;
        const refH = merged[0].origH;
        const threshold = 0.05;
        const mismatch = merged.some((img) => {
          const dw = Math.abs(img.origW - refW) / Math.max(1, refW);
          const dh = Math.abs(img.origH - refH) / Math.max(1, refH);
          return dw > threshold || dh > threshold;
        });
        if (mismatch) {
          setDimWarning('mismatch');
        } else {
          setDimWarning(null);
        }
      } else {
        setDimWarning(null);
      }

      return merged;
    });
  }, []);

  /* --- prefill from Home paste popup --- */
  useEffect(() => {
    if (didPrefillFromStateRef.current) return;
    const incoming = location.state?.pastedImages;
    if (!Array.isArray(incoming) || incoming.length === 0) return;
    didPrefillFromStateRef.current = true;
    addFiles(incoming);
  }, [location.state, addFiles]);

  /* --- Ctrl+V paste --- */
  useEffect(() => {
    const handler = (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      const files = [];
      for (const item of items) { if (item.kind === 'file' && item.type.startsWith('image/')) files.push(item.getAsFile()); }
      if (files.length) { e.preventDefault(); addFiles(files); }
    };
    document.addEventListener('paste', handler);
    return () => document.removeEventListener('paste', handler);
  }, [addFiles]);

  /* --- select image (save/restore per-image layers for private images) --- */
  const selectImage = (id) => {
    if (id === selectedImgId) return;
    setSelectedLayerId(null);
    setSelectedImgId(id);
  };

  /* --- remove image --- */
  const removeImage = (id) => {
    const img = images.find((i) => i.id === id);
    if (img) URL.revokeObjectURL(img.preview);
    const remaining = images.filter((i) => i.id !== id);
    setImages(remaining);
    if (id === selectedImgId && remaining.length > 0) {
      setSelectedLayerId(null);
      setSelectedImgId(remaining[0].id);
    }
    if (remaining.length === 0) { setLayers([]); setSelectedLayerId(null); setDimWarning(null); }
  };

  /* --- image load (compute fit zoom) --- */
  const handleBgLoad = useCallback(() => {
    const img = bgImgRef.current;
    if (!img) return;
    setNaturalDims({ w: img.naturalWidth, h: img.naturalHeight });
    /* Compute zoom-to-fit based on scroll container width */
    const scrollEl = img.closest('.wm-canvas-scroll');
    if (scrollEl && img.naturalWidth) {
      const availW = scrollEl.clientWidth - 56;
      const fit = availW / img.naturalWidth;
      setScale(Math.min(fit, 1));
    }
  }, []);

  useEffect(() => {
    const img = bgImgRef.current;
    if (!img) return;
    if (img.naturalWidth) setNaturalDims({ w: img.naturalWidth, h: img.naturalHeight });
  }, [selected]);

  /* --- guide detection --- */
  const checkGuides = useCallback((layer) => {
    const img = bgImgRef.current;
    if (!img) return layer;
    const cw = img.naturalWidth;
    const ch = img.naturalHeight;
    const cx = layer.x + layer.width / 2;
    const cy = layer.y + layer.height / 2;
    const thresh = 5;
    const nearH = Math.abs(cy - ch / 2) < thresh;
    const nearV = Math.abs(cx - cw / 2) < thresh;
    setGuideH(nearH);
    setGuideV(nearV);
    /* Snap */
    const snapped = { ...layer };
    if (nearH) snapped.y = Math.round(ch / 2 - layer.height / 2);
    if (nearV) snapped.x = Math.round(cw / 2 - layer.width / 2);
    return snapped;
  }, []);

  /* --- update layer --- */
  const updateLayer = useCallback((id, patch) => {
    setLayers((prev) => prev.map((l) => l.id === id ? { ...l, ...patch } : l));
  }, []);

  /* --- delete layer --- */
  const deleteLayer = useCallback((id) => {
    const l = layersRef.current.find((la) => la.id === id);
    if (l?.type === 'image' && l.preview) URL.revokeObjectURL(l.preview);
    setLayers((prev) => prev.filter((la) => la.id !== id));
    setSelectedLayerId((prev) => prev === id ? null : prev);
  }, []);

  /* --- duplicate layer --- */
  const duplicateLayer = useCallback((id) => {
    const l = layersRef.current.find((la) => la.id === id);
    if (!l) return;
    const copy = { ...l, id: nextLayerId(), x: l.x + 20, y: l.y + 20 };
    setLayers((prev) => [...prev, copy]);
    setSelectedLayerId(copy.id);
  }, []);

  /* --- keyboard move --- */
  useEffect(() => {
    if (!openDropdown) return;
    const handler = (e) => {
      if (!e.target.closest('.wm-top-toolbar__dropdown-wrap')) setOpenDropdown(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [openDropdown]);

  useEffect(() => {
    const handler = (e) => {
      if (!selectedLayerId) return;
      const tag = e.target.tagName.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select' || e.target.contentEditable === 'true') return;
      const step = e.shiftKey ? 10 : 1;
      let dx = 0, dy = 0;
      if (e.key === 'ArrowLeft') dx = -step;
      else if (e.key === 'ArrowRight') dx = step;
      else if (e.key === 'ArrowUp') dy = -step;
      else if (e.key === 'ArrowDown') dy = step;
      else if (e.key === 'Delete') { deleteLayer(selectedLayerId); return; }
      else return;
      e.preventDefault();
      setShowGuides(true);
      setLayers((prev) => prev.map((l) => l.id === selectedLayerId ? checkGuides({ ...l, x: l.x + dx, y: l.y + dy }) : l));
      setTimeout(() => { setShowGuides(false); setGuideH(false); setGuideV(false); }, 400);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selectedLayerId, checkGuides, deleteLayer]);

  /* --- add text layer --- */
  const addTextLayer = () => {
    const el = canvasRef.current;
    if (!el) return;
    const cw = el.clientWidth;
    const ch = el.clientHeight;
    const nl = makeTextLayer(cw, ch, scale);
    setLayers((prev) => [...prev, nl]);
    setSelectedLayerId(nl.id);
    setMode('text');
    // Close mobile tools panel
    if (window.innerWidth <= 900) {
      setMobileToolsOpen(false);
    }
    // Focus the text box and select placeholder text after render
    setTimeout(() => {
      const layerDiv = canvasRef.current?.querySelector(`[data-layer-id="${nl.id}"]`);
      const textEl = layerDiv?.querySelector('.wm-layer__text');
      if (textEl) {
        textEl.focus();
        const sel = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(textEl);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }, 120);
  };

  /* --- add image layer --- */
  const addImageLayer = async (file) => {
    const dims = await loadDimensions(file);
    const el = canvasRef.current;
    if (!el) return;
    const cw = el.clientWidth;
    const ch = el.clientHeight;
    const nl = makeImageLayer(file, dims.w, dims.h, cw, ch, scale);
    setLayers((prev) => [...prev, nl]);
    setSelectedLayerId(nl.id);
    setMode('image');
    // Close mobile tools panel
    if (window.innerWidth <= 900) {
      setMobileToolsOpen(false);
    }
  };

  /* --- drag layer (move) --- */
  const startLayerDrag = (e, layerId) => {
    if (e.target.closest('.wm-layer__handle') || e.target.closest('.wm-layer__rotate')) return;
    const layer = layersRef.current.find((l) => l.id === layerId);
    if (!layer || layer.locked) return;
    // If text layer is already in edit mode, don't drag
    if (layer.type === 'text' && e.target.contentEditable === 'true' && document.activeElement === e.target) return;
    e.preventDefault();
    const wasAlreadySelected = layerId === selectedLayerId;
    setSelectedLayerId(layerId);
    setMode(layer.type || 'text');
    setShowGuides(true);
    const startX = e.clientX ?? e.touches?.[0]?.clientX;
    const startY = e.clientY ?? e.touches?.[0]?.clientY;
    const startLayer = { ...layer };
    let moved = false;
    const textTarget = layer.type === 'text' ? (e.target.closest('.wm-layer__text') || (e.target.contentEditable === 'true' ? e.target : null)) : null;

    const onMove = (ev) => {
      ev.preventDefault();
      const cx = ev.clientX ?? ev.touches?.[0]?.clientX;
      const cy = ev.clientY ?? ev.touches?.[0]?.clientY;
      if (!moved && Math.abs(cx - startX) < 3 && Math.abs(cy - startY) < 3) return;
      moved = true;
      const dx = (cx - startX) / scale;
      const dy = (cy - startY) / scale;
      setLayers((prev) => prev.map((l) => l.id === layerId ? checkGuides({ ...l, x: Math.round(startLayer.x + dx), y: Math.round(startLayer.y + dy) }) : l));
    };

    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onUp);
      if (!moved && textTarget && wasAlreadySelected) {
        // Click on already-selected text layer without dragging → enter edit mode
        textTarget.focus();
      }
      setShowGuides(false); setGuideH(false); setGuideV(false);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend', onUp);
  };

  /* --- resize layer (rotation-aware) --- */
  const startLayerResize = (e, layerId, handle) => {
    e.preventDefault();
    e.stopPropagation();
    const startLayer = layersRef.current.find((l) => l.id === layerId);
    if (!startLayer || startLayer.locked) return;
    const startX = e.clientX ?? e.touches?.[0]?.clientX;
    const startY = e.clientY ?? e.touches?.[0]?.clientY;
    const isCorner = ['nw', 'ne', 'sw', 'se'].includes(handle);
    const aspect = startLayer.width / Math.max(1, startLayer.height);
    const angleRad = (startLayer.rotation * Math.PI) / 180;
    const cosA = Math.cos(angleRad);
    const sinA = Math.sin(angleRad);

    const onMove = (ev) => {
      ev.preventDefault();
      const cx = ev.clientX ?? ev.touches?.[0]?.clientX;
      const cy = ev.clientY ?? ev.touches?.[0]?.clientY;
      const rawDx = (cx - startX) / scale;
      const rawDy = (cy - startY) / scale;
      // Rotate mouse delta into the element's local coordinate space
      const dx = rawDx * cosA + rawDy * sinA;
      const dy = -rawDx * sinA + rawDy * cosA;
      let { x, y, width: w, height: h } = startLayer;

      if (isCorner) {
        if (handle === 'se') { w += dx; h = w / aspect; }
        else if (handle === 'sw') { w -= dx; h = w / aspect; x = startLayer.x + startLayer.width - w; }
        else if (handle === 'ne') { w += dx; h = w / aspect; y = startLayer.y + startLayer.height - h; }
        else if (handle === 'nw') { w -= dx; h = w / aspect; x = startLayer.x + startLayer.width - w; y = startLayer.y + startLayer.height - h; }
        w = Math.max(20, w);
        h = Math.max(20, w / aspect);
      } else {
        if (handle === 'e') w += dx;
        else if (handle === 'w') { w -= dx; x += dx; }
        else if (handle === 's') h += dy;
        else if (handle === 'n') { h -= dy; y += dy; }
        w = Math.max(20, w);
        h = Math.max(20, h);
      }

      setLayers((prev) => prev.map((l) => l.id === layerId ? { ...l, x: Math.round(x), y: Math.round(y), width: Math.round(w), height: Math.round(h) } : l));
    };

    setShowGuides(true);
    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onUp);
      setShowGuides(false);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend', onUp);
  };

  /* --- rotate layer (via cursor, rAF for smooth mobile, snap at 90°) --- */
  const startLayerRotate = (e, layerId) => {
    e.preventDefault();
    e.stopPropagation();
    const layer = layersRef.current.find((l) => l.id === layerId);
    if (!layer || layer.locked) return;
    const el = canvasRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + (layer.x + layer.width / 2) * scale;
    const centerY = rect.top + (layer.y + layer.height / 2) * scale;
    let rafId = null;
    setShowGuides(true);
    const SNAP_ANGLES = [0, 90, 180, 270, 360, -90, -180, -270];
    const SNAP_THRESHOLD = 5;

    const onMove = (ev) => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const cx = ev.clientX ?? ev.touches?.[0]?.clientX;
        const cy = ev.clientY ?? ev.touches?.[0]?.clientY;
        let angle = Math.atan2(cy - centerY, cx - centerX) * (180 / Math.PI) + 90;
        // Snap to 90° increments
        for (const snap of SNAP_ANGLES) {
          if (Math.abs(angle - snap) < SNAP_THRESHOLD) { angle = snap; break; }
        }
        updateLayer(layerId, { rotation: Math.round(angle) });
      });
    };

    const onUp = () => {
      if (rafId) cancelAnimationFrame(rafId);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onUp);
      setShowGuides(false);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend', onUp);
  };

  /* --- click outside layers deselects --- */
  const handleCanvasClick = (e) => {
    if (e.target === canvasRef.current || e.target === bgImgRef.current) {
      setSelectedLayerId(null);
    }
  };

  /* --- render watermark to canvas and get blob --- */
  const renderWatermark = useCallback(async (imgObj, customLayers, refDims) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    const url = imgObj.preview;
    await new Promise((r, rej) => { img.onload = r; img.onerror = rej; img.src = url; });

    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    /* Helper: draw a single layer instance at given offset */
    const drawLayerAt = async (layer, ox, oy) => {
      ctx.save();
      ctx.globalAlpha = layer.opacity / 100;

      const cx = ox + layer.width / 2;
      const cy = oy + layer.height / 2;
      ctx.translate(cx, cy);
      ctx.rotate((layer.rotation * Math.PI) / 180);
      if (layer.flipH) ctx.scale(-1, 1);
      if (layer.flipV) ctx.scale(1, -1);
      ctx.translate(-cx, -cy);

      if (layer.type === 'text') {
        if (layer.bgColor && layer.bgColor !== 'transparent') {
          ctx.fillStyle = layer.bgColor;
          ctx.fillRect(ox, oy, layer.width, layer.height);
        }
        const style = `${layer.italic ? 'italic ' : ''}${layer.bold ? 'bold ' : ''}`;
        ctx.font = `${style}${layer.fontSize}px "${layer.fontFamily}"`;
        ctx.fillStyle = layer.color;
        ctx.textAlign = layer.align;
        ctx.textBaseline = 'top';

        let tx = ox;
        if (layer.align === 'center') tx = ox + layer.width / 2;
        else if (layer.align === 'right') tx = ox + layer.width;

        const text = layer.text || '';
        if (!text) { ctx.restore(); return; }
        const lines = text.split('\n');
        const lineHeight = layer.fontSize * 1.3;

        lines.forEach((line, idx) => {
          const ly = oy + idx * lineHeight;
          if (layer.strokeWidth > 0) {
            ctx.strokeStyle = layer.strokeColor;
            ctx.lineWidth = layer.strokeWidth;
            ctx.strokeText(line, tx, ly);
          }
          ctx.fillText(line, tx, ly);
          if (layer.underline) {
            const metrics = ctx.measureText(line);
            let ux = tx;
            if (layer.align === 'center') ux -= metrics.width / 2;
            else if (layer.align === 'right') ux -= metrics.width;
            const prevFill = ctx.fillStyle;
            if (layer.strokeWidth > 0) ctx.fillStyle = layer.strokeColor;
            ctx.fillRect(ux, ly + layer.fontSize + 2, metrics.width, Math.max(1, layer.fontSize / 16));
            ctx.fillStyle = prevFill;
          }
        });
      } else if (layer.type === 'image') {
        const wmImg = new Image();
        wmImg.crossOrigin = 'anonymous';
        await new Promise((r, rej) => { wmImg.onload = r; wmImg.onerror = rej; wmImg.src = layer.preview; });

        if (layer.borderWidth > 0) {
          ctx.strokeStyle = layer.borderColor;
          ctx.lineWidth = layer.borderWidth;
          const br = layer.separateCorners
            ? { tl: layer.borderRadiusTL, tr: layer.borderRadiusTR, bl: layer.borderRadiusBL, br: layer.borderRadiusBR }
            : { tl: layer.borderRadius, tr: layer.borderRadius, bl: layer.borderRadius, br: layer.borderRadius };
          roundRect(ctx, ox, oy, layer.width, layer.height, br);
          ctx.stroke();
        }
        ctx.beginPath();
        const br2 = layer.separateCorners
          ? { tl: layer.borderRadiusTL, tr: layer.borderRadiusTR, bl: layer.borderRadiusBL, br: layer.borderRadiusBR }
          : { tl: layer.borderRadius, tr: layer.borderRadius, bl: layer.borderRadius, br: layer.borderRadius };
        roundRect(ctx, ox, oy, layer.width, layer.height, br2);
        ctx.clip();
        ctx.drawImage(wmImg, ox, oy, layer.width, layer.height);
      }
      ctx.restore();
    };

    /* Reposition & resize watermark for a different-sized target image.
       Algorithm:
       1. Find center of gravity of the layer on the reference image.
       2. Express its horizontal offset from center as a fraction of refW.
       3. Express its vertical offset from center as a fraction of refH.
       4. Scale the layer size proportionally (maintain aspect ratio).
       5. Apply the same proportional offsets on the target image.
       6. Clamp so no part of the watermark goes outside the image. */
    const repositionLayer = (rawLayer) => {
      if (!refDims || (canvas.width === refDims.w && canvas.height === refDims.h)) return rawLayer;
      const refW = refDims.w;
      const refH = refDims.h;
      const tgtW = canvas.width;
      const tgtH = canvas.height;

      /* Step 1: center of gravity on the reference image */
      const cogX = rawLayer.x + rawLayer.width / 2;
      const cogY = rawLayer.y + rawLayer.height / 2;

      /* Step 2-3: proportional offset from ref image center */
      const offsetPctX = (cogX - refW / 2) / refW;   // -0.5 .. +0.5
      const offsetPctY = (cogY - refH / 2) / refH;

      /* Step 4: scale watermark size to maintain same visual proportion.
         Use the smaller scale factor to preserve aspect ratio. */
      const scaleX = tgtW / refW;
      const scaleY = tgtH / refH;
      const layerScale = Math.min(scaleX, scaleY);

      let newW, newH, newFontSize;
      if (rawLayer.type === 'text') {
        newFontSize = Math.round(rawLayer.fontSize * layerScale);
        newW = Math.round(rawLayer.width * layerScale);
        newH = rawLayer.height ? Math.round(rawLayer.height * layerScale) : rawLayer.height;
      } else {
        /* Image layer: scale maintaining aspect ratio */
        newW = Math.round(rawLayer.width * layerScale);
        newH = Math.round(rawLayer.height * layerScale);
      }

      /* Step 5: place center of gravity at the same proportional offset on target */
      const newCogX = tgtW / 2 + offsetPctX * tgtW;
      const newCogY = tgtH / 2 + offsetPctY * tgtH;
      let newX = Math.round(newCogX - newW / 2);
      let newY = Math.round(newCogY - newH / 2);

      /* Step 6: clamp — watermark must never go outside the image */
      if (newX < 0) newX = 0;
      if (newY < 0) newY = 0;
      if (newX + newW > tgtW) newX = tgtW - newW;
      if (newY + newH > tgtH) newY = tgtH - newH;
      /* If watermark is larger than the target, shrink to fit */
      if (newW > tgtW) {
        const fit = tgtW / newW;
        newW = tgtW;
        newH = Math.round(newH * fit);
        newX = 0;
        if (rawLayer.type === 'text') newFontSize = Math.round(newFontSize * fit);
      }
      if (newH > tgtH) {
        const fit = tgtH / newH;
        newH = tgtH;
        newW = Math.round(newW * fit);
        newY = 0;
        if (rawLayer.type === 'text') newFontSize = Math.round(newFontSize * fit);
      }

      const result = { ...rawLayer, x: newX, y: newY, width: newW, height: newH };
      if (rawLayer.type === 'text') result.fontSize = newFontSize;
      return result;
    };

    /* Draw each layer (with optional tiling) */
    for (const rawLayer of (customLayers || layersRef.current)) {
      if (!rawLayer.visible) continue;

      const layer = repositionLayer(rawLayer);

      if (layer.tile && layer.tile !== 'none') {
        /* Tile: evenly distribute copies across the canvas.
           grid4 = 2×2, grid9 = 3×3.  Step = canvas / gridCount + spacing.
           Original position anchors the grid so all tiles shift with it. */
        const cols = layer.tile === 'grid4' ? 2 : 3;
        const rows = cols;
        const spacing = layer.tileSpacing || 0;
        const stepX = Math.max(canvas.width / cols + spacing, layer.width + 1);
        const stepY = Math.max(canvas.height / rows + spacing, layer.height + 1);
        /* Find col/row range that covers the canvas from the anchor position */
        const startCol = Math.floor((-layer.x - layer.width) / stepX);
        const endCol   = Math.ceil((canvas.width - layer.x) / stepX);
        const startRow = Math.floor((-layer.y - layer.height) / stepY);
        const endRow   = Math.ceil((canvas.height - layer.y) / stepY);
        const positions = [];
        for (let row = startRow; row <= endRow; row++) {
          for (let col = startCol; col <= endCol; col++) {
            const ox = layer.x + col * stepX;
            const oy = layer.y + row * stepY;
            if (ox + layer.width > 0 && ox < canvas.width && oy + layer.height > 0 && oy < canvas.height) {
              positions.push({ ox, oy });
            }
          }
        }
        for (const { ox, oy } of positions) {
          await drawLayerAt(layer, ox, oy);
        }
      } else {
        await drawLayerAt(layer, layer.x, layer.y);
      }
    }

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), imgObj.file.type === 'image/png' ? 'image/png' : 'image/jpeg', 0.95);
    });
  }, []);

  /* --- download single --- */
  const downloadSingle = async (imgObj) => {
    setProcessing(true);
    try {
      const blob = await renderWatermark(imgObj);
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      const baseName = imgObj.file.name.replace(/\.[^.]+$/, '');
      const ext = imgObj.file.name.match(/\.[^.]+$/)?.[0] || '.png';
      a.download = `${baseName}-watermarked${ext}`;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch (err) { console.error('Watermark error:', err); }
    setProcessing(false);
  };

  /* --- download all --- */
  const downloadAll = async () => {
    setProcessing(true);
    try {
      // Reference dimensions: the currently selected image where layers were authored
      const refImg = bgImgRef.current;
      const refDims = refImg ? { w: refImg.naturalWidth, h: refImg.naturalHeight } : null;
      const results = await Promise.all(images.map(async (img) => {
        const blob = await renderWatermark(img, layersRef.current, refDims);
        return { img, blob };
      }));

      if (results.length === 1) {
        const { img, blob } = results[0];
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        const baseName = img.file.name.replace(/\.[^.]+$/, '');
        const ext = img.file.name.match(/\.[^.]+$/)?.[0] || '.png';
        a.download = `${baseName}-watermarked${ext}`;
        a.click();
        URL.revokeObjectURL(a.href);
      } else if (downloadMode === 'zip') {
        if (!window.JSZip) {
          const s = document.createElement('script');
          s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
          document.head.appendChild(s);
          await new Promise((r) => { s.onload = r; });
        }
        const zip = new window.JSZip();
        results.forEach(({ img, blob }) => {
          const baseName = img.file.name.replace(/\.[^.]+$/, '');
          const ext = img.file.name.match(/\.[^.]+$/)?.[0] || '.png';
          zip.file(`${baseName}-watermarked${ext}`, blob);
        });
        const content = await zip.generateAsync({ type: 'blob' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(content);
        a.download = 'watermarked-images.zip';
        a.click();
        URL.revokeObjectURL(a.href);
      } else {
        for (const { img, blob } of results) {
          const a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          const baseName = img.file.name.replace(/\.[^.]+$/, '');
          const ext = img.file.name.match(/\.[^.]+$/)?.[0] || '.png';
          a.download = `${baseName}-watermarked${ext}`;
          a.click();
          URL.revokeObjectURL(a.href);
          await new Promise((r) => setTimeout(r, 300));
        }
      }
    } catch (err) { console.error('Watermark error:', err); }
    setProcessing(false);
  };

  /* --- start over --- */
  const handleStartOver = () => {
    if (!window.confirm(t('watermark.removeAllConfirm'))) return;
    images.forEach((i) => URL.revokeObjectURL(i.preview));
    layersRef.current.forEach((l) => { if (l.type === 'image' && l.preview) URL.revokeObjectURL(l.preview); });
    setImages([]);
    setLayers([]);
    setSelectedImgId(null);
    setSelectedLayerId(null);
  };

  /* --- drag & drop --- */
  const isFileDrag = (e) => Array.from(e.dataTransfer?.types || []).includes('Files');
  const onDragEnter = (e) => {
    if (!isFileDrag(e)) return;
    e.preventDefault();
    dragDepthRef.current += 1;
    setDragOver(true);
  };
  const onDragOver = (e) => {
    if (!isFileDrag(e)) return;
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
    if (!dragOver) setDragOver(true);
  };
  const onDragLeave = (e) => {
    if (!isFileDrag(e)) return;
    e.preventDefault();
    dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);
    if (dragDepthRef.current === 0) setDragOver(false);
  };
  const onDrop = (e) => {
    if (!isFileDrag(e)) return;
    e.preventDefault();
    dragDepthRef.current = 0;
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  };

  /* ========================= UPLOAD VIEW ========================= */
  if (!images.length) {
    return (
      <>
        <SEO
          title={t('watermark.seo.uploadTitle')}
          description={t('watermark.seo.uploadDesc')}
          keywords={t('watermark.seo.uploadKeywords')}
        />
        <section className="wm-upload">
          <div className="wm-upload__inner">
            <h1 className="wm-upload__title">{t('watermark.title')}</h1>
            <p className="wm-upload__desc">
              {t('watermark.desc')}
            </p>
            <div
              className={`wm-dropzone ${dragOver ? 'wm-dropzone--active' : ''}`}
              onDragEnter={onDragEnter}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
            >
              <div className="wm-dropzone__cloud"><i className="fa-solid fa-cloud-arrow-up"></i></div>
              <h3>{t('common.dropHere')}</h3>
              <p>{t('common.or')} <span className="wm-dropzone__browse" onClick={() => fileInputRef.current?.click()}>{t('common.browseFiles')}</span> {t('watermark.toWatermark')}</p>
              <p className="wm-dropzone__hint">
                <i className="fa-regular fa-keyboard"></i> {t('common.pasteHint')} <kbd>Ctrl</kbd> + <kbd>V</kbd>
              </p>
              <div style={{ marginTop: 20, display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                <button className="wm-dropzone__btn" onClick={() => fileInputRef.current?.click()} style={{ marginTop: 0 }}>
                  <i className="fa-solid fa-folder-open"></i> {t('common.chooseFiles')}
                </button>
                <MobileImportPopup onImportFiles={addFiles} />
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" multiple hidden onChange={(e) => addFiles(e.target.files)} />
            </div>
          </div>
        </section>

        <FAQ faqKey="watermarkImage" />
      </>
    );
  }

  /* ========================= WORKSPACE ========================= */
  const isMulti = images.length > 1;

  /* Style for a layer element */
  const layerStyle = (layer) => ({
    left: layer.x * scale,
    top: layer.y * scale,
    width: layer.width * scale,
    height: layer.type === 'text' ? 'auto' : layer.height * scale,
    minHeight: layer.type === 'text' ? 20 * scale : undefined,
    transform: `rotate(${layer.rotation}deg) scaleX(${layer.flipH ? -1 : 1}) scaleY(${layer.flipV ? -1 : 1})`,
  });

  /* Text layer inline style */
  const textStyle = (layer) => ({
    fontFamily: `"${layer.fontFamily}", sans-serif`,
    fontSize: layer.fontSize * scale,
    fontWeight: layer.bold ? 'bold' : 'normal',
    fontStyle: layer.italic ? 'italic' : 'normal',
    textDecoration: layer.underline ? 'underline' : 'none',
    textDecorationColor: layer.underline && layer.strokeWidth > 0 ? layer.strokeColor : undefined,
    color: layer.color,
    backgroundColor: layer.bgColor && layer.bgColor !== 'transparent' ? layer.bgColor : undefined,
    textAlign: layer.align,
    WebkitTextStroke: layer.strokeWidth > 0 ? `${layer.strokeWidth}px ${layer.strokeColor}` : undefined,
    opacity: layer.opacity / 100,
  });

  /* Image layer inline style */
  const imgLayerStyle = (layer) => {
    const br = layer.separateCorners
      ? `${layer.borderRadiusTL}px ${layer.borderRadiusTR}px ${layer.borderRadiusBR}px ${layer.borderRadiusBL}px`
      : `${layer.borderRadius}px`;
    return {
      width: '100%',
      height: '100%',
      objectFit: 'fill',
      borderRadius: br,
      border: layer.borderWidth > 0 ? `${layer.borderWidth}px ${layer.borderStyle} ${layer.borderColor}` : 'none',
      opacity: layer.opacity / 100,
    };
  };

  return (
    <>
      <SEO
        title={t('watermark.seo.workspaceTitle')}
        description={t('watermark.seo.workspaceDesc')}
        keywords={t('watermark.seo.workspaceKeywords')}
      />

      <section
        className={`wm-workspace ${dragOver ? 'wm-workspace--dragover' : ''}`}
        onDragEnter={onDragEnter}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        {/* Dimension mismatch warning */}
        {dimWarning === 'mismatch' && (
          <div className="wm-dim-warning">
            <i className="fa-solid fa-triangle-exclamation"></i>
            <span>{t('watermark.dimMismatch')}</span>
            <button className="wm-dim-warning__close" onClick={() => setDimWarning(null)} aria-label={t('common.close')}>
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        )}
        {/* Mobile toggle */}
        <button className="wm-settings-toggle" onClick={() => setMobileToolsOpen((p) => !p)} aria-label={t('common.toggleToolsPanel') || 'Toggle tools panel'}>
          <i className={mobileToolsOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-gear'}></i>
        </button>
        {mobileToolsOpen && <div className="wm-overlay" onClick={() => setMobileToolsOpen(false)} />}

        {/* ---------- PREVIEW PANEL (multi-image) ---------- */}
        {isMulti && (
          <div className="wm-preview">
            <div className="wm-preview__stat">
              <span className="wm-preview__stat-value">{images.length} {t('common.images')}</span>
              <span className="wm-preview__stat-label">{fmtSize(totalSize)}</span>
            </div>
            <div className="wm-preview__list">
              {images.map((img) => (
                <div key={img.id} className={`wm-preview__item ${img.id === selectedImgId ? 'wm-preview__item--active' : ''}`} onClick={() => selectImage(img.id)}>
                  <button className="wm-preview__remove" onClick={(e) => { e.stopPropagation(); removeImage(img.id); }} title={t('common.remove')}>
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                  <img src={img.preview} alt="" draggable={false} />
                  <div className="wm-preview__meta">
                    <span className="wm-preview__size">{fmtSize(img.file.size)}</span>
                    <span className="wm-preview__type">{getExt(img.file.name)}</span>
                  </div>
                </div>
              ))}
              {/* +Add Image box */}
              <div className="wm-preview__add" onClick={() => addFileInputRef.current?.click()} title={t('common.addMoreImages')}>
                <i className="fa-solid fa-plus"></i>
                <span>{t('common.addImage')}</span>
              </div>
            </div>
          </div>
        )}

        {/* ---------- LEFT PANEL (canvas area) ---------- */}
        <div className="wm-left">
          {selected && (
            <>
              {/* Top toolbar: tools only (mode toggle moved to right panel) */}
              <div className="wm-top-toolbar">
                {/* Text layer tools */}
                {selectedLayer?.type === 'text' && (
                  <div className="wm-top-toolbar__tools">
                    <select className="wm-top-toolbar__select" value={selectedLayer.fontFamily} onChange={(e) => updateLayer(selectedLayer.id, { fontFamily: e.target.value })}>
                      {FONTS.map((f) => <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>)}
                    </select>
                    <select className="wm-top-toolbar__select wm-top-toolbar__select--sm" value={selectedLayer.fontSize} onChange={(e) => updateLayer(selectedLayer.id, { fontSize: +e.target.value })}>
                      {[8,10,12,14,16,18,20,24,28,32,36,40,48,56,64,72,80,96,120,150,200].map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <div className="wm-top-toolbar__sep" />
                    <button className={`wm-top-toolbar__btn ${selectedLayer.bold ? 'active' : ''}`} onClick={() => updateLayer(selectedLayer.id, { bold: !selectedLayer.bold })} title={t('watermark.bold')}><b>B</b></button>
                    <button className={`wm-top-toolbar__btn ${selectedLayer.italic ? 'active' : ''}`} onClick={() => updateLayer(selectedLayer.id, { italic: !selectedLayer.italic })} title={t('watermark.italic')}><i>I</i></button>
                    <button className={`wm-top-toolbar__btn ${selectedLayer.underline ? 'active' : ''}`} onClick={() => updateLayer(selectedLayer.id, { underline: !selectedLayer.underline })} title={t('watermark.underline')}><u>U</u></button>
                    <div className="wm-top-toolbar__sep" />
                    <label className="wm-top-toolbar__color" title={t('watermark.bgColor')}>
                      <i className="fa-solid fa-fill-drip"></i>
                      <input type="color" value={selectedLayer.bgColor === 'transparent' ? '#ffffff' : selectedLayer.bgColor} onChange={(e) => updateLayer(selectedLayer.id, { bgColor: e.target.value })} />
                      {selectedLayer.bgColor !== 'transparent' && <span className="wm-top-toolbar__color-dot" style={{ background: selectedLayer.bgColor }} />}
                    </label>
                    {selectedLayer.bgColor !== 'transparent' && (
                      <button className="wm-top-toolbar__btn wm-top-toolbar__btn--xs" onClick={() => updateLayer(selectedLayer.id, { bgColor: 'transparent' })} title={t('watermark.clearBackground') || 'Clear Background'}><i className="fa-solid fa-xmark"></i></button>
                    )}
                    <label className="wm-top-toolbar__color" title={t('watermark.textColor')}>
                      <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>A</span>
                      <input type="color" value={selectedLayer.color} onChange={(e) => updateLayer(selectedLayer.id, { color: e.target.value })} />
                      <span className="wm-top-toolbar__color-dot" style={{ background: selectedLayer.color }} />
                    </label>
                    <div className="wm-top-toolbar__sep" />
                    <button className={`wm-top-toolbar__btn ${selectedLayer.align === 'left' ? 'active' : ''}`} onClick={() => updateLayer(selectedLayer.id, { align: 'left' })} title={t('watermark.alignLeft')}><i className="fa-solid fa-align-left"></i></button>
                    <button className={`wm-top-toolbar__btn ${selectedLayer.align === 'center' ? 'active' : ''}`} onClick={() => updateLayer(selectedLayer.id, { align: 'center' })} title={t('watermark.alignCenter')}><i className="fa-solid fa-align-center"></i></button>
                    <button className={`wm-top-toolbar__btn ${selectedLayer.align === 'right' ? 'active' : ''}`} onClick={() => updateLayer(selectedLayer.id, { align: 'right' })} title={t('watermark.alignRight')}><i className="fa-solid fa-align-right"></i></button>
                    <div className="wm-top-toolbar__sep" />
                    {/* Opacity dropdown */}
                    <div className="wm-top-toolbar__dropdown-wrap">
                      <button className={`wm-top-toolbar__btn ${openDropdown === 'opacity' ? 'active' : ''}`} onClick={() => setOpenDropdown(openDropdown === 'opacity' ? null : 'opacity')} title="Opacity"><i className="fa-solid fa-droplet-slash"></i></button>
                      {openDropdown === 'opacity' && (
                        <div className="wm-top-toolbar__dropdown">
                          <label className="wm-top-toolbar__dropdown-label">Opacity</label>
                          <div className="wm-top-toolbar__dropdown-row">
                            <input type="range" className="wm-top-toolbar__range" min={0} max={100} value={selectedLayer.opacity} onChange={(e) => updateLayer(selectedLayer.id, { opacity: +e.target.value })} />
                            <span className="wm-top-toolbar__dropdown-val">{selectedLayer.opacity}%</span>
                          </div>
                        </div>
                      )}
                    </div>
                    {/* Stroke dropdown */}
                    <div className="wm-top-toolbar__dropdown-wrap">
                      <button className={`wm-top-toolbar__btn ${openDropdown === 'stroke' ? 'active' : ''}`} onClick={() => setOpenDropdown(openDropdown === 'stroke' ? null : 'stroke')} title={t('watermark.stroke')}><i className="fa-solid fa-pen-nib"></i></button>
                      {openDropdown === 'stroke' && (
                        <div className="wm-top-toolbar__dropdown">
                          <label className="wm-top-toolbar__dropdown-label">{t('watermark.strokeWidth')}</label>
                          <div className="wm-top-toolbar__dropdown-row">
                            <input type="range" className="wm-top-toolbar__range" min={0} max={10} value={selectedLayer.strokeWidth} onChange={(e) => updateLayer(selectedLayer.id, { strokeWidth: +e.target.value })} />
                            <span className="wm-top-toolbar__dropdown-val">{selectedLayer.strokeWidth}px</span>
                          </div>
                          {selectedLayer.strokeWidth > 0 && (
                            <div className="wm-top-toolbar__dropdown-row">
                              <label className="wm-top-toolbar__dropdown-label">{t('watermark.strokeColor')}</label>
                              <input type="color" className="wm-top-toolbar__dropdown-color" value={selectedLayer.strokeColor} onChange={(e) => updateLayer(selectedLayer.id, { strokeColor: e.target.value })} />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="wm-top-toolbar__sep" />
                    {/* Tile dropdown */}
                    <div className="wm-top-toolbar__dropdown-wrap">
                      <button className={`wm-top-toolbar__btn ${openDropdown === 'tile' ? 'active' : ''} ${selectedLayer.tile !== 'none' ? 'active' : ''}`} onClick={() => setOpenDropdown(openDropdown === 'tile' ? null : 'tile')} title={t('watermark.tileRepeat')}><i className="fa-solid fa-table-cells"></i></button>
                      {openDropdown === 'tile' && (
                        <div className="wm-top-toolbar__dropdown">
                          <label className="wm-top-toolbar__dropdown-label">{t('watermark.tilePattern')}</label>
                          <div className="wm-tile-options">
                            <button className={`wm-tile-opt ${selectedLayer.tile === 'none' ? 'active' : ''}`} onClick={() => updateLayer(selectedLayer.id, { tile: 'none' })} title={t('watermark.tileSingle')}>
                              <span className="wm-tile-dots wm-tile-dots--1"><span></span></span>
                            </button>
                            <button className={`wm-tile-opt ${selectedLayer.tile === 'grid4' ? 'active' : ''}`} onClick={() => updateLayer(selectedLayer.id, { tile: 'grid4' })} title={t('watermark.tile2x2')}>
                              <span className="wm-tile-dots wm-tile-dots--4"><span></span><span></span><span></span><span></span></span>
                            </button>
                            <button className={`wm-tile-opt ${selectedLayer.tile === 'grid9' ? 'active' : ''}`} onClick={() => updateLayer(selectedLayer.id, { tile: 'grid9' })} title={t('watermark.tile3x3')}>
                              <span className="wm-tile-dots wm-tile-dots--9"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></span>
                            </button>
                          </div>
                          {selectedLayer.tile !== 'none' && (
                            <>
                              <label className="wm-top-toolbar__dropdown-label">{t('watermark.spacing')}</label>
                              <div className="wm-top-toolbar__dropdown-row">
                                <input type="range" className="wm-top-toolbar__range" min={0} max={200} value={selectedLayer.tileSpacing} onChange={(e) => updateLayer(selectedLayer.id, { tileSpacing: +e.target.value })} />
                                <span className="wm-top-toolbar__dropdown-val">{selectedLayer.tileSpacing}px</span>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="wm-top-toolbar__sep" />
                    <button className="wm-top-toolbar__btn" onClick={() => { const img = bgImgRef.current; if (!img) return; const cw = img.naturalWidth; const ch = img.naturalHeight; updateLayer(selectedLayer.id, { x: Math.round(cw / 2 - selectedLayer.width / 2), y: Math.round(ch / 2 - selectedLayer.height / 2) }); }} title={t('watermark.snapToCenter')}><i className="fa-solid fa-crosshairs"></i></button>
                    <button className="wm-top-toolbar__btn" onClick={() => duplicateLayer(selectedLayer.id)} title={t('watermark.duplicate')}><i className="fa-regular fa-copy"></i></button>
                    <button className="wm-top-toolbar__btn wm-top-toolbar__btn--danger" onClick={() => deleteLayer(selectedLayer.id)} title={t('watermark.delete')}><i className="fa-solid fa-trash"></i></button>
                  </div>
                )}

                {/* Image layer tools */}
                {selectedLayer?.type === 'image' && (
                  <div className="wm-top-toolbar__tools">
                    <button className={`wm-top-toolbar__btn ${selectedLayer.flipH ? 'active' : ''}`} onClick={() => updateLayer(selectedLayer.id, { flipH: !selectedLayer.flipH })} title={t('watermark.flipHorizontal')}><i className="fa-solid fa-arrows-left-right"></i></button>
                    <button className={`wm-top-toolbar__btn ${selectedLayer.flipV ? 'active' : ''}`} onClick={() => updateLayer(selectedLayer.id, { flipV: !selectedLayer.flipV })} title={t('watermark.flipVertical')}><i className="fa-solid fa-arrows-up-down"></i></button>
                    <button className="wm-top-toolbar__btn" onClick={() => updateLayer(selectedLayer.id, { rotation: selectedLayer.rotation - 90 })} title={t('watermark.rotateLeft')}><i className="fa-solid fa-rotate-left"></i></button>
                    <button className="wm-top-toolbar__btn" onClick={() => updateLayer(selectedLayer.id, { rotation: selectedLayer.rotation + 90 })} title={t('watermark.rotateRight')}><i className="fa-solid fa-rotate-right"></i></button>
                    <div className="wm-top-toolbar__sep" />
                    {/* Opacity dropdown */}
                    <div className="wm-top-toolbar__dropdown-wrap">
                      <button className={`wm-top-toolbar__btn ${openDropdown === 'opacity' ? 'active' : ''}`} onClick={() => setOpenDropdown(openDropdown === 'opacity' ? null : 'opacity')} title={t('watermark.opacity')}><i className="fa-solid fa-droplet-slash"></i></button>
                      {openDropdown === 'opacity' && (
                        <div className="wm-top-toolbar__dropdown">
                          <label className="wm-top-toolbar__dropdown-label">{t('watermark.opacity')}</label>
                          <div className="wm-top-toolbar__dropdown-row">
                            <input type="range" className="wm-top-toolbar__range" min={0} max={100} value={selectedLayer.opacity} onChange={(e) => updateLayer(selectedLayer.id, { opacity: +e.target.value })} />
                            <span className="wm-top-toolbar__dropdown-val">{selectedLayer.opacity}%</span>
                          </div>
                        </div>
                      )}
                    </div>
                    {/* Corner radius dropdown */}
                    <div className="wm-top-toolbar__dropdown-wrap">
                      <button className={`wm-top-toolbar__btn ${openDropdown === 'radius' ? 'active' : ''}`} onClick={() => setOpenDropdown(openDropdown === 'radius' ? null : 'radius')} title={t('watermark.cornerRadius')}><i className="fa-solid fa-vector-square"></i></button>
                      {openDropdown === 'radius' && (
                        <div className="wm-top-toolbar__dropdown wm-top-toolbar__dropdown--wide">
                          <div className="wm-top-toolbar__dropdown-row">
                            <label className="wm-top-toolbar__dropdown-label">{t('watermark.cornerRadius')}</label>
                            <button className={`wm-top-toolbar__btn ${selectedLayer.separateCorners ? 'active' : ''}`} onClick={() => updateLayer(selectedLayer.id, { separateCorners: !selectedLayer.separateCorners })} title={selectedLayer.separateCorners ? (t('watermark.linkCorners') || 'Link corners') : (t('watermark.separateCorners') || 'Separate corners')} style={{ marginLeft: 'auto' }}>
                              <i className={`fa-solid ${selectedLayer.separateCorners ? 'fa-link' : 'fa-link-slash'}`}></i>
                            </button>
                          </div>
                          {!selectedLayer.separateCorners ? (
                            <div className="wm-top-toolbar__dropdown-row">
                              <input type="range" className="wm-top-toolbar__range" min={0} max={200} value={selectedLayer.borderRadius} onChange={(e) => updateLayer(selectedLayer.id, { borderRadius: +e.target.value, separateCorners: false })} />
                              <span className="wm-top-toolbar__dropdown-val">{selectedLayer.borderRadius}px</span>
                            </div>
                          ) : (
                            <div className="wm-top-toolbar__dropdown-corners">
                              <div className="wm-top-toolbar__dropdown-row"><span className="wm-top-toolbar__dropdown-label">TL</span><input type="number" className="wm-top-toolbar__input" value={selectedLayer.borderRadiusTL} min={0} onChange={(e) => updateLayer(selectedLayer.id, { borderRadiusTL: +e.target.value })} /></div>
                              <div className="wm-top-toolbar__dropdown-row"><span className="wm-top-toolbar__dropdown-label">TR</span><input type="number" className="wm-top-toolbar__input" value={selectedLayer.borderRadiusTR} min={0} onChange={(e) => updateLayer(selectedLayer.id, { borderRadiusTR: +e.target.value })} /></div>
                              <div className="wm-top-toolbar__dropdown-row"><span className="wm-top-toolbar__dropdown-label">BL</span><input type="number" className="wm-top-toolbar__input" value={selectedLayer.borderRadiusBL} min={0} onChange={(e) => updateLayer(selectedLayer.id, { borderRadiusBL: +e.target.value })} /></div>
                              <div className="wm-top-toolbar__dropdown-row"><span className="wm-top-toolbar__dropdown-label">BR</span><input type="number" className="wm-top-toolbar__input" value={selectedLayer.borderRadiusBR} min={0} onChange={(e) => updateLayer(selectedLayer.id, { borderRadiusBR: +e.target.value })} /></div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    {/* Stroke / Border dropdown */}
                    <div className="wm-top-toolbar__dropdown-wrap">
                      <button className={`wm-top-toolbar__btn ${openDropdown === 'border' ? 'active' : ''}`} onClick={() => setOpenDropdown(openDropdown === 'border' ? null : 'border')} title={t('watermark.borderStroke')}><i className="fa-solid fa-border-top-left"></i></button>
                      {openDropdown === 'border' && (
                        <div className="wm-top-toolbar__dropdown wm-top-toolbar__dropdown--wide">
                          <label className="wm-top-toolbar__dropdown-label">{t('watermark.borderWidth')}</label>
                          <div className="wm-top-toolbar__dropdown-row">
                            <input type="range" className="wm-top-toolbar__range" min={0} max={20} value={selectedLayer.borderWidth} onChange={(e) => updateLayer(selectedLayer.id, { borderWidth: +e.target.value })} />
                            <span className="wm-top-toolbar__dropdown-val">{selectedLayer.borderWidth}px</span>
                          </div>
                          {selectedLayer.borderWidth > 0 && (
                            <>
                              <div className="wm-top-toolbar__dropdown-row">
                                <label className="wm-top-toolbar__dropdown-label">{t('watermark.color')}</label>
                                <input type="color" className="wm-top-toolbar__dropdown-color" value={selectedLayer.borderColor} onChange={(e) => updateLayer(selectedLayer.id, { borderColor: e.target.value })} />
                              </div>
                              <div className="wm-top-toolbar__dropdown-row">
                                <label className="wm-top-toolbar__dropdown-label">{t('watermark.style')}</label>
                                <select className="wm-top-toolbar__select" value={selectedLayer.borderStyle} onChange={(e) => updateLayer(selectedLayer.id, { borderStyle: e.target.value })}>
                                  <option value="solid">{t('watermark.solid')}</option>
                                  <option value="dashed">{t('watermark.dashed')}</option>
                                  <option value="dotted">{t('watermark.dotted')}</option>
                                  <option value="double">{t('watermark.double')}</option>
                                </select>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                    {/* Tile dropdown */}
                    <div className="wm-top-toolbar__dropdown-wrap">
                      <button className={`wm-top-toolbar__btn ${openDropdown === 'tile' ? 'active' : ''} ${selectedLayer.tile !== 'none' ? 'active' : ''}`} onClick={() => setOpenDropdown(openDropdown === 'tile' ? null : 'tile')} title={t('watermark.tileRepeat')}><i className="fa-solid fa-table-cells"></i></button>
                      {openDropdown === 'tile' && (
                        <div className="wm-top-toolbar__dropdown">
                          <label className="wm-top-toolbar__dropdown-label">{t('watermark.tilePattern')}</label>
                          <div className="wm-tile-options">
                            <button className={`wm-tile-opt ${selectedLayer.tile === 'none' ? 'active' : ''}`} onClick={() => updateLayer(selectedLayer.id, { tile: 'none' })} title={t('watermark.tileSingle')}>
                              <span className="wm-tile-dots wm-tile-dots--1"><span></span></span>
                            </button>
                            <button className={`wm-tile-opt ${selectedLayer.tile === 'grid4' ? 'active' : ''}`} onClick={() => updateLayer(selectedLayer.id, { tile: 'grid4' })} title={t('watermark.tile2x2')}>
                              <span className="wm-tile-dots wm-tile-dots--4"><span></span><span></span><span></span><span></span></span>
                            </button>
                            <button className={`wm-tile-opt ${selectedLayer.tile === 'grid9' ? 'active' : ''}`} onClick={() => updateLayer(selectedLayer.id, { tile: 'grid9' })} title={t('watermark.tile3x3')}>
                              <span className="wm-tile-dots wm-tile-dots--9"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></span>
                            </button>
                          </div>
                          {selectedLayer.tile !== 'none' && (
                            <>
                              <label className="wm-top-toolbar__dropdown-label">{t('watermark.spacing')}</label>
                              <div className="wm-top-toolbar__dropdown-row">
                                <input type="range" className="wm-top-toolbar__range" min={0} max={200} value={selectedLayer.tileSpacing} onChange={(e) => updateLayer(selectedLayer.id, { tileSpacing: +e.target.value })} />
                                <span className="wm-top-toolbar__dropdown-val">{selectedLayer.tileSpacing}px</span>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="wm-top-toolbar__sep" />
                    <button className="wm-top-toolbar__btn" onClick={() => { const img = bgImgRef.current; if (!img) return; const cw = img.naturalWidth; const ch = img.naturalHeight; updateLayer(selectedLayer.id, { x: Math.round(cw / 2 - selectedLayer.width / 2), y: Math.round(ch / 2 - selectedLayer.height / 2) }); }} title={t('watermark.snapToCenter')}><i className="fa-solid fa-crosshairs"></i></button>
                    <button className="wm-top-toolbar__btn" onClick={() => duplicateLayer(selectedLayer.id)} title={t('watermark.duplicate')}><i className="fa-regular fa-copy"></i></button>
                    <button className="wm-top-toolbar__btn wm-top-toolbar__btn--danger" onClick={() => deleteLayer(selectedLayer.id)} title={t('watermark.delete')}><i className="fa-solid fa-trash"></i></button>
                  </div>
                )}

                {/* Nothing selected placeholder */}
                {!selectedLayer && (
                  <div className="wm-top-toolbar__placeholder">
                    <i className="fa-solid fa-mouse-pointer"></i> {t('watermark.selectToEdit')}
                  </div>
                )}
              </div>
              <input ref={wmImageInputRef} type="file" accept="image/*" hidden onChange={(e) => { if (e.target.files[0]) addImageLayer(e.target.files[0]); e.target.value = ''; }} />

              {/* Zoom toolbar */}
              <div className="wm-zoom-toolbar">
                <button className="wm-zoom-btn" onClick={() => setScale(s => Math.max(s * 0.8, 0.05))} title={t('common.zoomOut') || 'Zoom Out'}><i className="fa-solid fa-minus"></i></button>
                <span className="wm-zoom-level">{Math.round(scale * 100)}%</span>
                <button className="wm-zoom-btn" onClick={() => setScale(s => Math.min(s * 1.25, 3))} title={t('common.zoomIn') || 'Zoom In'}><i className="fa-solid fa-plus"></i></button>
                <button className="wm-zoom-btn" onClick={() => { const img = bgImgRef.current; const scrollEl = canvasRef.current?.closest('.wm-canvas-scroll'); if (img && scrollEl) { const fit = (scrollEl.clientWidth - 56) / img.naturalWidth; setScale(Math.min(fit, 1)); } }} title={t('common.fit') || 'Fit'}><i className="fa-solid fa-expand"></i></button>
              </div>

              {/* Scrollable canvas area */}
              <div className="wm-canvas-scroll">
                <div className="wm-canvas-wrap">
                  <div className="wm-canvas" ref={canvasRef} onClick={handleCanvasClick} style={{ width: naturalDims.w ? naturalDims.w * scale : '100%' }}>
                    <img ref={bgImgRef} className="wm-canvas__bg" src={selected.preview} alt="" onLoad={handleBgLoad} draggable={false} />

                    {/* Center guides */}
                    <div className={`wm-guide wm-guide--h ${guideH && showGuides ? 'wm-guide--visible' : ''}`} />
                    <div className={`wm-guide wm-guide--v ${guideV && showGuides ? 'wm-guide--visible' : ''}`} />

                    {/* Layers */}
                    {layers.map((layer) => {
                      /* Compute tile positions radiating from the original watermark */
                      const tilePositions = [];
                      if (layer.tile && layer.tile !== 'none' && naturalDims.w && naturalDims.h) {
                        const cols = layer.tile === 'grid4' ? 2 : 3;
                        const rows = cols;
                        const spacing = layer.tileSpacing || 0;
                        const stepX = Math.max(naturalDims.w / cols + spacing, layer.width + 1);
                        const stepY = Math.max(naturalDims.h / rows + spacing, layer.height + 1);
                        const startCol = Math.floor((-layer.x - layer.width) / stepX);
                        const endCol   = Math.ceil((naturalDims.w - layer.x) / stepX);
                        const startRow = Math.floor((-layer.y - layer.height) / stepY);
                        const endRow   = Math.ceil((naturalDims.h - layer.y) / stepY);
                        for (let row = startRow; row <= endRow; row++) {
                          for (let col = startCol; col <= endCol; col++) {
                            if (row === 0 && col === 0) continue; /* skip original */
                            const ox = layer.x + col * stepX;
                            const oy = layer.y + row * stepY;
                            if (ox + layer.width > 0 && ox < naturalDims.w && oy + layer.height > 0 && oy < naturalDims.h) {
                              tilePositions.push({ x: ox, y: oy });
                            }
                          }
                        }
                      }
                      const showTile = tilePositions.length > 0;

                      return (
                      <React.Fragment key={layer.id}>
                      {/* Main draggable layer */}
                      <div
                        data-layer-id={layer.id}
                        className={`wm-layer ${layer.id === selectedLayerId ? 'wm-layer--selected' : ''} ${!layer.visible ? 'wm-layer--hidden' : ''} ${layer.locked ? 'wm-layer--locked' : ''}`}
                        style={layerStyle(layer)}
                        onMouseDown={(e) => startLayerDrag(e, layer.id)}
                        onTouchStart={(e) => startLayerDrag(e, layer.id)}
                        onClick={(e) => { e.stopPropagation(); setSelectedLayerId(layer.id); setMode(layer.type); }}
                      >
                        {layer.type === 'text' ? (
                          <span
                            key={`${layer.id}-${layer.fontFamily}-${layer.bold}-${layer.italic}-${layer.underline}`}
                            className="wm-layer__text"
                            contentEditable={!layer.locked}
                            suppressContentEditableWarning
                            style={textStyle(layer)}
                            ref={(el) => { if (el && !el.dataset.inited) { el.textContent = layer.text || ''; el.dataset.inited = '1'; } }}
                            onInput={(e) => { updateLayer(layer.id, { text: e.currentTarget.textContent }); }}
                            onFocus={() => setSelectedLayerId(layer.id)}
                          />
                        ) : (
                          <img className="wm-layer__img" src={layer.preview} alt="" style={imgLayerStyle(layer)} draggable={false} />
                        )}

                        {/* Resize handles */}
                        <div className="wm-layer__handle wm-layer__handle--nw" onMouseDown={(e) => startLayerResize(e, layer.id, 'nw')} onTouchStart={(e) => startLayerResize(e, layer.id, 'nw')} />
                        <div className="wm-layer__handle wm-layer__handle--ne" onMouseDown={(e) => startLayerResize(e, layer.id, 'ne')} onTouchStart={(e) => startLayerResize(e, layer.id, 'ne')} />
                        <div className="wm-layer__handle wm-layer__handle--sw" onMouseDown={(e) => startLayerResize(e, layer.id, 'sw')} onTouchStart={(e) => startLayerResize(e, layer.id, 'sw')} />
                        <div className="wm-layer__handle wm-layer__handle--se" onMouseDown={(e) => startLayerResize(e, layer.id, 'se')} onTouchStart={(e) => startLayerResize(e, layer.id, 'se')} />
                        <div className="wm-layer__handle wm-layer__handle--n" onMouseDown={(e) => startLayerResize(e, layer.id, 'n')} onTouchStart={(e) => startLayerResize(e, layer.id, 'n')} />
                        <div className="wm-layer__handle wm-layer__handle--s" onMouseDown={(e) => startLayerResize(e, layer.id, 's')} onTouchStart={(e) => startLayerResize(e, layer.id, 's')} />
                        <div className="wm-layer__handle wm-layer__handle--e" onMouseDown={(e) => startLayerResize(e, layer.id, 'e')} onTouchStart={(e) => startLayerResize(e, layer.id, 'e')} />
                        <div className="wm-layer__handle wm-layer__handle--w" onMouseDown={(e) => startLayerResize(e, layer.id, 'w')} onTouchStart={(e) => startLayerResize(e, layer.id, 'w')} />

                        {/* Rotate handle */}
                        <div className="wm-layer__rotate" onMouseDown={(e) => startLayerRotate(e, layer.id)} onTouchStart={(e) => startLayerRotate(e, layer.id)}>
                          <i className="fa-solid fa-rotate"></i>
                        </div>
                        <div className="wm-layer__rotate-line" />

                        {/* Picker/move handle (top-right) */}
                        <div className="wm-layer__picker">
                          <i className="fa-solid fa-up-down-left-right"></i>
                        </div>
                      </div>

                      {/* Tile ghost clones (visual preview only, not interactive) */}
                      {showTile && tilePositions.map((pos, idx) => (
                        <div
                          key={`${layer.id}-tile-${idx}`}
                          className={`wm-layer wm-layer--tile-ghost ${!layer.visible ? 'wm-layer--hidden' : ''}`}
                          style={{
                            left: pos.x * scale,
                            top: pos.y * scale,
                            width: layer.width * scale,
                            height: layer.type === 'text' ? 'auto' : layer.height * scale,
                            minHeight: layer.type === 'text' ? 20 * scale : undefined,
                            transform: `rotate(${layer.rotation}deg) scaleX(${layer.flipH ? -1 : 1}) scaleY(${layer.flipV ? -1 : 1})`,
                            pointerEvents: 'none',
                          }}
                        >
                          {layer.type === 'text' ? (
                            <span className="wm-layer__text" style={textStyle(layer)}>
                              {layer.text || t('watermark.typeHere') || 'Type here...'}
                            </span>
                          ) : (
                            <img className="wm-layer__img" src={layer.preview} alt="" style={imgLayerStyle(layer)} draggable={false} />
                          )}
                        </div>
                      ))}
                      </React.Fragment>
                    );
                    })}
                  </div>

                  {/* Actions below image */}
                  <div className="wm-left__actions">
                    <button className="wm-left__download" onClick={() => downloadSingle(selected)} disabled={processing}>
                      <i className="fa-solid fa-download"></i> {t('common.download')}
                    </button>
                    {isMulti && (
                      <button className="wm-left__next" onClick={() => {
                        const idx = images.findIndex((i) => i.id === selectedImgId);
                        const nextId = images[(idx + 1) % images.length].id;
                        setSelectedLayerId(null);
                        setSelectedImgId(nextId);
                      }}>
                        <i className="fa-solid fa-forward"></i> {t('watermark.nextImage')}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* ---------- RIGHT PANEL (tools) ---------- */}
        <div className={`wm-right ${mobileToolsOpen ? 'wm-right--open' : ''}`}>
          <div className="wm-right__sticky">
            <div className="wm-right__header">
              <h3><i className="fa-solid fa-stamp"></i> {t('watermark.watermarkTools')}</h3>
              <button className="wm-right__close" onClick={() => setMobileToolsOpen(false)} aria-label={t('common.close')}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {/* Stats */}
            <div className="wm-right__stats">
              <div className="wm-stat">
                <span className="wm-stat__label">{t('common.images')}</span>
                <span className="wm-stat__value">{images.length}</span>
              </div>
              <div className="wm-stat">
                <span className="wm-stat__label">{t('common.size')}</span>
                <span className="wm-stat__value">{fmtSize(totalSize)}</span>
              </div>
            </div>

            {/* Add Text / Add Image buttons */}
            <div className="wm-right__mode-add">
              <button className="wm-right__add-layer wm-right__add-layer--text" onClick={addTextLayer} title={t('watermark.addText')}>
                <i className="fa-solid fa-font"></i> {t('watermark.addText')}
              </button>
              <button className="wm-right__add-layer wm-right__add-layer--image" onClick={() => wmImageInputRef.current?.click()} title={t('watermark.addImage')}>
                <i className="fa-solid fa-image"></i> {t('watermark.addImage')}
              </button>
            </div>

            {/* Layer List */}
            <div className="wm-layer-list">
              <label className="wm-section__label">{t('watermark.layersN').replace('{n}', layers.length)}</label>
              {layers.length === 0 && (
                <div className="wm-no-layers-mini">{t('watermark.noLayers')}</div>
              )}
              {layers.map((layer) => (
                <div key={layer.id} className={`wm-layer-item ${layer.id === selectedLayerId ? 'wm-layer-item--active' : ''}`}
                  onClick={() => { setSelectedLayerId(layer.id); setMode(layer.type); }}>
                  <span className="wm-layer-item__icon">
                    <i className={`fa-solid ${layer.type === 'text' ? 'fa-font' : 'fa-image'}`}></i>
                  </span>
                  <span className="wm-layer-item__name">
                    {layer.type === 'text' ? (layer.text || t('watermark.textLayer')) : (layer.name || t('watermark.imageLayer'))}
                  </span>
                  <button className={`wm-layer-item__btn ${!layer.visible ? 'active' : ''}`}
                    onClick={(e) => { e.stopPropagation(); updateLayer(layer.id, { visible: !layer.visible }); }}
                    title={layer.visible ? t('watermark.hide') : t('watermark.show')}>
                    <i className={`fa-solid ${layer.visible ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                  </button>
                  <button className={`wm-layer-item__btn ${layer.locked ? 'active' : ''}`}
                    onClick={(e) => { e.stopPropagation(); updateLayer(layer.id, { locked: !layer.locked }); }}
                    title={layer.locked ? t('watermark.unlock') : t('watermark.lock')}>
                    <i className={`fa-solid ${layer.locked ? 'fa-lock' : 'fa-lock-open'}`}></i>
                  </button>
                  <button className="wm-layer-item__btn wm-layer-item__btn--danger"
                    onClick={(e) => { e.stopPropagation(); deleteLayer(layer.id); }}
                    title={t('watermark.delete')}>
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              ))}
            </div>

            {/* Add more images */}
            <button className="wm-right__add" onClick={() => addFileInputRef.current?.click()}>
              <i className="fa-solid fa-plus"></i> {t('common.addMoreImages')}
            </button>
            <input ref={addFileInputRef} type="file" accept="image/*" multiple hidden onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }} />

            {/* Download mode (multi) */}
            {isMulti && (
              <div>
                <label style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600, marginBottom: 8, display: 'block' }}>{t('common.downloadAs')}</label>
                <div className="wm-dl-toggle">
                  <button className={`wm-dl-toggle__btn ${downloadMode === 'zip' ? 'active' : ''}`} onClick={() => setDownloadMode('zip')}>
                    <i className="fa-solid fa-file-zipper"></i> {t('common.zip')}
                  </button>
                  <button className={`wm-dl-toggle__btn ${downloadMode === 'separate' ? 'active' : ''}`} onClick={() => setDownloadMode('separate')}>
                    <i className="fa-regular fa-copy"></i> {t('common.separate')}
                  </button>
                </div>
              </div>
            )}

            {/* Start Over */}
            <button className="wm-right__reset" onClick={handleStartOver}>
              <i className="fa-solid fa-arrow-rotate-left"></i> {t('common.startOver')}
            </button>

            {/* Sticky download */}
            <div className="wm-right__actions">
              <button className="wm-right__download" onClick={downloadAll} disabled={processing || layers.length === 0}>
                {processing ? (
                  <><span className="wm-download-spinner"></span> {t('common.processing')}</>
                ) : (
                  <><i className="fa-solid fa-stamp"></i> {isMulti ? t('watermark.watermarkDownloadAll') : t('watermark.watermarkDownload')}</>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Apply-to-all confirmation dialog removed */}
      </section>
    </>
  );
};

export default WatermarkImage;
