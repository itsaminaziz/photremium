import React, { useState, useRef, useEffect, useCallback } from 'react';
import SEO from '../SEO/SEO';
import FAQ from '../FAQ/FAQ';
import MobileImportPopup from '../MobileImportPopup/MobileImportPopup';
import { useLanguage } from '../../context/LanguageContext';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import './FaceBlur.css';

/* ---- helpers ---- */
const fmtSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};
const getExt = (name) => (name.match(/\.([^.]+)$/)?.[1] || 'img').toUpperCase();

const loadImage = (file) =>
  new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => { resolve({ img, url, w: img.naturalWidth, h: img.naturalHeight }); };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(null); };
    img.src = url;
  });

const EMOJIS = ['😀', '😎', '🤡', '👽', '🐱', '🐶', '🦊', '🐸', '💀', '🎭', '⭐', '❤️'];

/* ---- Apply blur / emoji to face regions on canvas (smooth CSS filter blur) ---- */
const applyBlurToCanvas = (srcCanvas, regions, defaultBlurMode, defaultEmoji) => {
  const w = srcCanvas.width, h = srcCanvas.height;
  const out = document.createElement('canvas');
  out.width = w; out.height = h;
  const ctx = out.getContext('2d');
  ctx.drawImage(srcCanvas, 0, 0);

  for (const r of regions) {
    const rx = Math.round(r.x * w);
    const ry = Math.round(r.y * h);
    const rw = Math.round(r.w * w);
    const rh = Math.round(r.h * h);
    if (rw < 2 || rh < 2) continue;
    const shape = r.shape || 'rectangle';
    const regionIntensity = r.intensity != null ? r.intensity : 40;
    const regionMode = r.blurMode || defaultBlurMode;
    const regionEmoji = r.emoji || defaultEmoji;

    if (regionMode === 'emoji' && regionEmoji) {
      const fontSize = Math.min(rw, rh) * 1.1;
      ctx.font = `${fontSize}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      if (shape === 'circle') {
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(rx + rw / 2, ry + rh / 2, rw / 2, rh / 2, 0, 0, Math.PI * 2);
        ctx.clip();
        ctx.fillText(regionEmoji, rx + rw / 2, ry + rh / 2);
        ctx.restore();
      } else {
        ctx.fillText(regionEmoji, rx + rw / 2, ry + rh / 2);
      }
    } else {
      /* Use CSS filter for smooth Gaussian blur */
      const blurRadius = Math.max(2, Math.round(Math.min(rw, rh) * regionIntensity / 100 * 0.15));
      /* Create a temp canvas for the region */
      const tmp = document.createElement('canvas');
      tmp.width = rw; tmp.height = rh;
      const tctx = tmp.getContext('2d');
      /* Draw the region onto temp */
      tctx.drawImage(srcCanvas, rx, ry, rw, rh, 0, 0, rw, rh);
      /* Apply CSS filter blur (smooth, GPU-accelerated) */
      const blurred = document.createElement('canvas');
      blurred.width = rw; blurred.height = rh;
      const bctx = blurred.getContext('2d');
      bctx.filter = `blur(${blurRadius}px)`;
      /* Draw slightly oversized to avoid edge darkening, then crop */
      const expand = blurRadius * 2;
      bctx.drawImage(tmp, -expand, -expand, rw + expand * 2, rh + expand * 2);
      bctx.filter = 'none';

      if (shape === 'circle') {
        /* Clip to ellipse */
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(rx + rw / 2, ry + rh / 2, rw / 2, rh / 2, 0, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(blurred, rx, ry);
        ctx.restore();
      } else {
        ctx.drawImage(blurred, rx, ry);
      }
    }
  }
  return out;
};

/* ============================================= */
/*          FACE BLUR PAGE                       */
/* ============================================= */
const FaceBlur = () => {
  const { t } = useLanguage();
  const [images, setImages] = useState([]);
  const [selectedImgId, setSelectedImgId] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false);
  const [downloadMode, setDownloadMode] = useState('zip');
  const [downloading, setDownloading] = useState(false);
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);

  /* Blur settings */
  const [blurIntensity, setBlurIntensity] = useState(40);
  const [blurShape, setBlurShape] = useState('rectangle'); // rectangle | circle
  const [blurMode, setBlurMode] = useState('blur'); // blur | emoji
  const [selectedEmoji, setSelectedEmoji] = useState('😀');

  /* Face regions (normalised 0-1 coords per image) */
  const regionsMapRef = useRef({}); // { imgId: [{x,y,w,h,auto:bool},...] }
  const [regions, setRegions] = useState([]); // current image regions

  /* Manual draw state */
  const [drawing, setDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState(null);
  const [drawCurrent, setDrawCurrent] = useState(null);
  const [selectedRegionIdx, setSelectedRegionIdx] = useState(null); // index of region being edited
  const [draggingRegion, setDraggingRegion] = useState(null); // {idx, startX, startY, origRegion}
  const [resizingRegion, setResizingRegion] = useState(null); // {idx, handle, startX, startY, origRegion}
  const [overlayCursor, setOverlayCursor] = useState('default');

  /* Refs */
  const fileInputRef = useRef(null);
  const addFileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const srcCanvasRef = useRef(null); // offscreen: holds original pixels
  const imgCacheRef = useRef({}); // { imgId: HTMLImageElement }
  const dragDepthRef = useRef(0);

  const selected = images.find((i) => i.id === selectedImgId) || null;
  const totalSize = images.reduce((s, i) => s + i.file.size, 0);
  const isMulti = images.length > 1;

  /* ---- Save / restore regions per image ---- */
  const saveRegions = useCallback(() => {
    if (selectedImgId) regionsMapRef.current[selectedImgId] = [...regions];
  }, [selectedImgId, regions]);

  const loadRegions = useCallback((id) => {
    return regionsMapRef.current[id] || [];
  }, []);

  /* ---- beforeunload ---- */
  useEffect(() => {
    const h = (e) => { if (images.length) { e.preventDefault(); e.returnValue = ''; } };
    window.addEventListener('beforeunload', h);
    return () => window.removeEventListener('beforeunload', h);
  }, [images.length]);

  /* ---- popstate guard ---- */
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

  /* ---- hide footer when workspace active ---- */
  useEffect(() => {
    if (images.length > 0) document.body.classList.add('fb-workspace-active');
    else document.body.classList.remove('fb-workspace-active');
    return () => document.body.classList.remove('fb-workspace-active');
  }, [images.length]);

  /* ---- add files ---- */
  const addFiles = useCallback(async (files) => {
    const valid = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (!valid.length) return;
    const newImgs = await Promise.all(
      valid.map(async (file) => {
        const result = await loadImage(file);
        if (!result) return null;
        return { id: crypto.randomUUID(), file, preview: result.url, origW: result.w, origH: result.h, imgEl: result.img };
      })
    );
    const goodImgs = newImgs.filter(Boolean);
    if (!goodImgs.length) return;
    goodImgs.forEach((im) => { imgCacheRef.current[im.id] = im.imgEl; });
    setImages((prev) => {
      const merged = [...prev, ...goodImgs];
      if (prev.length === 0 && goodImgs.length > 0) setSelectedImgId(goodImgs[0].id);
      return merged;
    });
  }, []);

  /* ---- paste ---- */
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

  /* ---- select image ---- */
  const selectImage = useCallback((id) => {
    if (id === selectedImgId) return;
    saveRegions();
    const loaded = loadRegions(id);
    setRegions(loaded);
    setSelectedImgId(id);
  }, [selectedImgId, saveRegions, loadRegions]);

  /* ---- remove image ---- */
  const removeImage = useCallback((id) => {
    const img = images.find((i) => i.id === id);
    if (img) URL.revokeObjectURL(img.preview);
    delete regionsMapRef.current[id];
    delete imgCacheRef.current[id];
    const remaining = images.filter((i) => i.id !== id);
    setImages(remaining);
    if (id === selectedImgId) {
      if (remaining.length > 0) {
        const next = remaining[0];
        setSelectedImgId(next.id);
        setRegions(loadRegions(next.id));
      } else {
        setSelectedImgId(null);
        setRegions([]);
      }
    }
  }, [images, selectedImgId, loadRegions]);

  /* ---- draw source to canvas ---- */
  const drawCanvas = useCallback(() => {
    if (!selected) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const imgEl = imgCacheRef.current[selected.id];
    if (!imgEl) return;

    const maxDisplayW = 800;
    const scale = Math.min(1, maxDisplayW / selected.origW);
    const dw = Math.round(selected.origW * scale);
    const dh = Math.round(selected.origH * scale);
    canvas.width = dw;
    canvas.height = dh;

    // Source canvas (full res for export)
    if (!srcCanvasRef.current) srcCanvasRef.current = document.createElement('canvas');
    const src = srcCanvasRef.current;
    src.width = selected.origW;
    src.height = selected.origH;
    const sctx = src.getContext('2d');
    sctx.drawImage(imgEl, 0, 0);

    // If we have regions, apply blur preview
    if (regions.length > 0) {
      const blurred = applyBlurToCanvas(src, regions, blurMode, selectedEmoji);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(blurred, 0, 0, dw, dh);
    } else {
      const ctx = canvas.getContext('2d');
      ctx.drawImage(imgEl, 0, 0, dw, dh);
    }
  }, [selected, regions, blurMode, selectedEmoji]);

  useEffect(() => { drawCanvas(); }, [drawCanvas]);

  /* Save regions whenever they change */
  useEffect(() => { saveRegions(); }, [regions, saveRegions]);

  /* ---- Resize handle hit detection ---- */
  const HANDLE_SIZE_NORM = 0.025; // normalized size of resize handle hit zone
  const getResizeHandle = (x, y, r) => {
    const hs = HANDLE_SIZE_NORM;
    const handles = [
      { name: 'nw', hx: r.x, hy: r.y },
      { name: 'ne', hx: r.x + r.w, hy: r.y },
      { name: 'sw', hx: r.x, hy: r.y + r.h },
      { name: 'se', hx: r.x + r.w, hy: r.y + r.h },
      { name: 'n', hx: r.x + r.w / 2, hy: r.y },
      { name: 's', hx: r.x + r.w / 2, hy: r.y + r.h },
      { name: 'w', hx: r.x, hy: r.y + r.h / 2 },
      { name: 'e', hx: r.x + r.w, hy: r.y + r.h / 2 },
    ];
    for (const h of handles) {
      if (Math.abs(x - h.hx) < hs && Math.abs(y - h.hy) < hs) return h.name;
    }
    return null;
  };

  /* ---- Manual region drawing handlers ---- */
  const getPointerPos = (e) => {
    if (e.touches && e.touches.length > 0) {
      return { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY };
    }
    return { clientX: e.clientX, clientY: e.clientY };
  };

  const handleDrawStart = (e) => {
    if (!canvasRef.current) return;
    const { clientX, clientY } = getPointerPos(e);
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (clientX - rect.left) / rect.width;
    const y = (clientY - rect.top) / rect.height;

    /* Check if clicking on a resize handle of selected region first */
    if (selectedRegionIdx != null && regions[selectedRegionIdx]) {
      const handle = getResizeHandle(x, y, regions[selectedRegionIdx]);
      if (handle) {
        setResizingRegion({ idx: selectedRegionIdx, handle, startX: x, startY: y, origRegion: { ...regions[selectedRegionIdx] } });
        return;
      }
    }

    /* Check if clicking on an existing region to drag it */
    for (let i = regions.length - 1; i >= 0; i--) {
      const r = regions[i];
      const rShape = r.shape || 'rectangle';
      if (rShape === 'circle') {
        const cx = r.x + r.w / 2, cy = r.y + r.h / 2;
        const dx = (x - cx) / (r.w / 2), dy = (y - cy) / (r.h / 2);
        if (dx * dx + dy * dy <= 1) {
          setSelectedRegionIdx(i);
          setDraggingRegion({ idx: i, startX: x, startY: y, origRegion: { ...r } });
          return;
        }
      } else {
        if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) {
          setSelectedRegionIdx(i);
          setDraggingRegion({ idx: i, startX: x, startY: y, origRegion: { ...r } });
          return;
        }
      }
    }

    /* Otherwise start new draw */
    setSelectedRegionIdx(null);
    setDrawing(true);
    setDrawStart({ x, y });
    setDrawCurrent({ x, y });
  };

  const handleDrawMove = (e) => {
    if (!canvasRef.current) return;
    const { clientX, clientY } = getPointerPos(e);
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));

    /* Resizing an existing region */
    if (resizingRegion) {
      const { handle, origRegion: o } = resizingRegion;
      let nx = o.x, ny = o.y, nw = o.w, nh = o.h;
      const MIN_SIZE = 0.02;
      if (handle.includes('w')) { nx = Math.min(x, o.x + o.w - MIN_SIZE); nw = o.x + o.w - nx; }
      if (handle.includes('e')) { nw = Math.max(MIN_SIZE, x - o.x); }
      if (handle.includes('n')) { ny = Math.min(y, o.y + o.h - MIN_SIZE); nh = o.y + o.h - ny; }
      if (handle.includes('s')) { nh = Math.max(MIN_SIZE, y - o.y); }
      // Clamp to canvas bounds
      nx = Math.max(0, nx); ny = Math.max(0, ny);
      nw = Math.min(nw, 1 - nx); nh = Math.min(nh, 1 - ny);
      setRegions((prev) => prev.map((r, i) =>
        i === resizingRegion.idx ? { ...r, x: nx, y: ny, w: nw, h: nh } : r
      ));
      return;
    }

    /* Dragging an existing region */
    if (draggingRegion) {
      const dx = x - draggingRegion.startX;
      const dy = y - draggingRegion.startY;
      const orig = draggingRegion.origRegion;
      const newX = Math.max(0, Math.min(1 - orig.w, orig.x + dx));
      const newY = Math.max(0, Math.min(1 - orig.h, orig.y + dy));
      setRegions((prev) => prev.map((r, i) =>
        i === draggingRegion.idx ? { ...r, x: newX, y: newY } : r
      ));
      return;
    }

    if (!drawing) {
      /* Update cursor based on what's under the mouse */
      const CURSOR_MAP = { nw: 'nw-resize', ne: 'ne-resize', sw: 'sw-resize', se: 'se-resize', n: 'n-resize', s: 's-resize', w: 'w-resize', e: 'e-resize' };
      if (selectedRegionIdx != null && regions[selectedRegionIdx]) {
        const handle = getResizeHandle(x, y, regions[selectedRegionIdx]);
        if (handle) { setOverlayCursor(CURSOR_MAP[handle]); return; }
      }
      // Check if over any region
      let overRegion = false;
      for (let i = regions.length - 1; i >= 0; i--) {
        const r = regions[i];
        const rShape = r.shape || 'rectangle';
        if (rShape === 'circle') {
          const cx = r.x + r.w / 2, cy = r.y + r.h / 2;
          const dx = (x - cx) / (r.w / 2), dy = (y - cy) / (r.h / 2);
          if (dx * dx + dy * dy <= 1) { overRegion = true; break; }
        } else {
          if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) { overRegion = true; break; }
        }
      }
      setOverlayCursor(overRegion ? 'move' : 'crosshair');
      return;
    }
    setDrawCurrent({ x, y });
  };

  const handleDrawEnd = () => {
    /* Finish resizing */
    if (resizingRegion) {
      setResizingRegion(null);
      return;
    }

    /* Finish dragging existing region */
    if (draggingRegion) {
      setDraggingRegion(null);
      return;
    }

    if (!drawing || !drawStart || !drawCurrent) { setDrawing(false); return; }

    if (blurShape === 'circle') {
      /* For circle: compute radius in CSS-pixel space so the stored region
         maps to an equal-pixel circle on both axes in the source image.
         (Normalising x and y separately by different canvas dimensions would
         make r.w * origW ≠ r.h * origH, producing a stretched ellipse.) */
      const rect = canvasRef.current.getBoundingClientRect();
      const cw = rect.width, ch = rect.height;

      const dxPx = Math.abs(drawCurrent.x - drawStart.x) * cw;
      const dyPx = Math.abs(drawCurrent.y - drawStart.y) * ch;
      const radiusPx = Math.max(dxPx, dyPx) / 2;

      const cx = (drawStart.x + drawCurrent.x) / 2;
      const cy = (drawStart.y + drawCurrent.y) / 2;

      /* Normalise the SAME pixel radius back per-axis so that
         r.w * cw == r.h * ch == radiusPx * 2 (circle in display space)
         AND r.w * origW == r.h * origH (circle in source image space) */
      const rw = (radiusPx * 2) / cw;
      const rh = (radiusPx * 2) / ch;

      if (radiusPx > 5) {
        setRegions((prev) => [...prev, {
          x: Math.max(0, cx - rw / 2),
          y: Math.max(0, cy - rh / 2),
          w: Math.min(1, rw),
          h: Math.min(1, rh),
          auto: false,
          shape: 'circle',
          intensity: blurIntensity,
          blurMode,
          emoji: selectedEmoji,
        }]);
      }
    } else {
      const x = Math.min(drawStart.x, drawCurrent.x);
      const y = Math.min(drawStart.y, drawCurrent.y);
      const w = Math.abs(drawCurrent.x - drawStart.x);
      const h = Math.abs(drawCurrent.y - drawStart.y);
      if (w > 0.02 && h > 0.02) {
        setRegions((prev) => [...prev, { x, y, w, h, auto: false, shape: 'rectangle', intensity: blurIntensity, blurMode, emoji: selectedEmoji }]);
      }
    }
    setDrawing(false);
    setDrawStart(null);
    setDrawCurrent(null);
  };

  const handleTouchStart = (e) => { e.preventDefault(); handleDrawStart(e); };
  const handleTouchMove = (e) => { e.preventDefault(); handleDrawMove(e); };
  const handleTouchEnd = (e) => { e.preventDefault(); handleDrawEnd(); };

  /* ---- Remove single region ---- */
  const removeRegion = (idx) => {
    setRegions((prev) => { const n = [...prev]; n.splice(idx, 1); return n; });
    setSelectedRegionIdx(null);
  };

  /* ---- Clear all regions ---- */
  const clearRegions = () => {
    setRegions([]);
    setSelectedRegionIdx(null);
  };

  /* ---- Export single image ---- */
  const exportImage = useCallback((imgObj) => {
    return new Promise((resolve) => {
      const imgEl = imgCacheRef.current[imgObj.id];
      if (!imgEl) { resolve(null); return; }
      const src = document.createElement('canvas');
      src.width = imgObj.origW; src.height = imgObj.origH;
      src.getContext('2d').drawImage(imgEl, 0, 0);
      const imgRegions = regionsMapRef.current[imgObj.id] || [];
      if (imgRegions.length === 0) {
        // No blur, just return original
        src.toBlob((blob) => resolve(blob), 'image/png');
        return;
      }
      const result = applyBlurToCanvas(src, imgRegions, blurMode, selectedEmoji);
      result.toBlob((blob) => resolve(blob), 'image/png');
    });
  }, [blurMode, selectedEmoji]);

  /* ---- Download ---- */
  const getEditedImages = useCallback(() => {
    saveRegions();
    return images.filter(img => (regionsMapRef.current[img.id] || []).length > 0);
  }, [images, saveRegions]);

  const performDownload = useCallback(async (imageList) => {
    if (!imageList.length) return;
    setDownloading(true);
    try {
      if (imageList.length === 1 || downloadMode === 'separate') {
        for (const img of imageList) {
          const blob = await exportImage(img);
          if (!blob) continue;
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          const name = img.file.name.replace(/\.[^.]+$/, '');
          a.download = `${name}_blurred.png`;
          a.click();
          URL.revokeObjectURL(url);
        }
      } else {
        const JSZip = (await import('jszip')).default;
        const zip = new JSZip();
        for (const img of imageList) {
          const blob = await exportImage(img);
          if (!blob) continue;
          const name = img.file.name.replace(/\.[^.]+$/, '');
          zip.file(`${name}_blurred.png`, blob);
        }
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(zipBlob);
        const a = document.createElement('a');
        a.href = url; a.download = 'blurred_images.zip'; a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Download error:', err);
    }
    setDownloading(false);
  }, [downloadMode, exportImage]);

  const handleDownload = useCallback(async () => {
    if (!images.length) return;
    saveRegions();
    const edited = getEditedImages();
    if (edited.length >= images.length) {
      // All edited — download directly
      await performDownload(images);
    } else {
      // Not all edited — show dialog
      setShowDownloadDialog(true);
    }
  }, [images, saveRegions, getEditedImages, performDownload]);

  const handleDownloadEdited = useCallback(async () => {
    setShowDownloadDialog(false);
    const edited = getEditedImages();
    await performDownload(edited);
  }, [getEditedImages, performDownload]);

  const handleDownloadAll = useCallback(async () => {
    setShowDownloadDialog(false);
    await performDownload(images);
  }, [images, performDownload]);

  /* ---- Download current image ---- */
  const handleDownloadCurrent = useCallback(async () => {
    if (!selected) return;
    saveRegions();
    setDownloading(true);
    try {
      const blob = await exportImage(selected);
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const name = selected.file.name.replace(/\.[^.]+$/, '');
        a.download = `${name}_blurred.png`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Download error:', err);
    }
    setDownloading(false);
  }, [selected, exportImage, saveRegions]);

  /* ---- Next image ---- */
  const handleNextImage = useCallback(() => {
    if (images.length < 2) return;
    const idx = images.findIndex((i) => i.id === selectedImgId);
    const nextIdx = (idx + 1) % images.length;
    selectImage(images[nextIdx].id);
  }, [images, selectedImgId, selectImage]);

  /* ---- Reset all ---- */
  const resetAll = () => {
    images.forEach((img) => URL.revokeObjectURL(img.preview));
    setImages([]);
    setSelectedImgId(null);
    setRegions([]);
    setMobileToolsOpen(false);
    regionsMapRef.current = {};
    imgCacheRef.current = {};
  };

  /* ---- Drop handlers ---- */
  const isFileDrag = (e) => Array.from(e.dataTransfer?.types || []).includes('Files');
  const onDrop = (e) => {
    if (!isFileDrag(e)) return;
    e.preventDefault();
    dragDepthRef.current = 0;
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  };
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

  /* ---- Draw rect/circle helper for manual mode ---- */
  const getDrawRect = () => {
    if (!drawing || !drawStart || !drawCurrent || !canvasRef.current) return null;
    const rect = canvasRef.current.getBoundingClientRect();

    if (blurShape === 'circle') {
      const cx = ((drawStart.x + drawCurrent.x) / 2) * rect.width;
      const cy = ((drawStart.y + drawCurrent.y) / 2) * rect.height;
      const radius = Math.max(
        Math.abs(drawCurrent.x - drawStart.x) * rect.width,
        Math.abs(drawCurrent.y - drawStart.y) * rect.height
      ) / 2;
      return { isCircle: true, cx, cy, radius };
    }

    const x = Math.min(drawStart.x, drawCurrent.x) * rect.width;
    const y = Math.min(drawStart.y, drawCurrent.y) * rect.height;
    const w = Math.abs(drawCurrent.x - drawStart.x) * rect.width;
    const h = Math.abs(drawCurrent.y - drawStart.y) * rect.height;
    return { isCircle: false, left: x, top: y, width: w, height: h };
  };
  const drawRect = getDrawRect();

  /* ============ UPLOAD VIEW ============ */
  if (images.length === 0) {
    return (
      <>
        <SEO
          title={t('faceBlur.seo.uploadTitle')}
          description={t('faceBlur.seo.uploadDesc')}
          keywords={t('faceBlur.seo.uploadKeywords')}
        />
        <section className="fb-upload">
          <h1 className="fb-upload__title"><i className="fa-solid fa-user-shield"></i> {t('faceBlur.title')}</h1>
          <p className="fb-upload__subtitle">
            {t('faceBlur.desc')}
          </p>

          <div
            className={`fb-dropzone ${dragOver ? 'fb-dropzone--active' : ''}`}
            onDragEnter={onDragEnter}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
          >
            <div className="fb-dropzone__cloud">
              <i className="fa-solid fa-cloud-arrow-up"></i>
            </div>
            <h3>{t('common.dropHere')}</h3>
            <p>{t('common.or')} <span className="fb-dropzone__browse" onClick={() => fileInputRef.current?.click()}>{t('common.browseFiles')}</span> {t('faceBlur.toBlurFaces')}</p>
            <p className="fb-dropzone__hint">
              <i className="fa-regular fa-keyboard"></i> {t('common.pasteHint')} <kbd>Ctrl</kbd> + <kbd>V</kbd>
            </p>
            <div style={{ marginTop: 20, display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              <button className="fb-dropzone__btn" onClick={() => fileInputRef.current?.click()} style={{ marginTop: 0 }}>
                <i className="fa-solid fa-folder-open"></i> {t('common.chooseFiles')}
              </button>
              <MobileImportPopup onImportFiles={addFiles} />
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }}
            />
          </div>

          <div className="fb-upload__features">
            <div className="fb-feature">
              <div className="fb-feature__icon"><i className="fa-solid fa-sliders"></i></div>
              <div className="fb-feature__title">{t('faceBlur.customBlur')}</div>
              <div className="fb-feature__desc">{t('faceBlur.customBlurDesc')}</div>
            </div>
            <div className="fb-feature">
              <div className="fb-feature__icon"><i className="fa-solid fa-hand-pointer"></i></div>
              <div className="fb-feature__title">{t('faceBlur.manualSelect')}</div>
              <div className="fb-feature__desc">{t('faceBlur.manualHint')}</div>
            </div>
            <div className="fb-feature">
              <div className="fb-feature__icon"><i className="fa-solid fa-lock"></i></div>
              <div className="fb-feature__title">{t('faceBlur.private100')}</div>
              <div className="fb-feature__desc">{t('faceBlur.private100Desc')}</div>
            </div>
          </div>
        </section>

        <FAQ faqKey="faceBlur" />
      </>
    );
  }

  /* ============ WORKSPACE VIEW ============ */
  return (
    <>
      <SEO
        title={t('faceBlur.seo.workspaceTitle')}
        description={t('faceBlur.seo.workspaceDesc')}
        keywords={t('faceBlur.seo.workspaceKeywords')}
      />

      <section
        className={`fb-workspace ${dragOver ? 'fb-workspace--dragover' : ''}`}
        onDragEnter={onDragEnter}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        {/* Mobile toggle */}
        <button className="fb-settings-toggle" onClick={() => setMobileToolsOpen((p) => !p)} aria-label={t('common.toggleToolsPanel') || 'Toggle tools panel'}>
          <i className={mobileToolsOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-gear'}></i>
        </button>
        {mobileToolsOpen && <div className="fb-overlay" onClick={() => setMobileToolsOpen(false)} />}

        {/* ---------- PREVIEW PANEL ---------- */}
        {isMulti && (
          <div className="fb-preview">
            <div className="fb-preview__stat">
              <span className="fb-preview__stat-value">{images.length} {t('common.images')}</span>
              <span className="fb-preview__stat-label">{fmtSize(totalSize)}</span>
            </div>
            <div className="fb-preview__list">
              {images.map((img) => (
                <div key={img.id} className={`fb-preview__item ${img.id === selectedImgId ? 'fb-preview__item--active' : ''}`} onClick={() => selectImage(img.id)}>
                  <button className="fb-preview__remove" onClick={(e) => { e.stopPropagation(); removeImage(img.id); }} title={t('common.remove')}>
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                  <img src={img.preview} alt="" draggable={false} />
                  <div className="fb-preview__meta">
                    <span className="fb-preview__size">{fmtSize(img.file.size)}</span>
                    <span className="fb-preview__type">{getExt(img.file.name)}</span>
                  </div>
                </div>
              ))}
              {/* +Add Image box */}
              <div className="fb-preview__add" onClick={() => addFileInputRef.current?.click()} title={t('common.addMoreImages')}>
                <i className="fa-solid fa-plus"></i>
                <span>{t('common.addImage')}</span>
              </div>
            </div>
          </div>
        )}

        {/* ---------- LEFT PANEL (canvas) ---------- */}
        <div className="fb-left">
          <div className="fb-canvas-scroll">
            {selected && (
              <div className="fb-canvas" style={{ position: 'relative' }}>
                <canvas ref={canvasRef} />

                {/* Face region indicators (visual overlay, clickable) */}
                {regions.map((r, i) => {
                  const canvas = canvasRef.current;
                  if (!canvas) return null;
                  const cw = canvas.clientWidth, ch = canvas.clientHeight;
                  const isSelected = selectedRegionIdx === i;
                  const rShape = r.shape || 'rectangle';
                  return (
                    <div
                      key={i}
                      className={`fb-face-indicator ${rShape === 'circle' ? 'fb-face-indicator--circle' : ''} ${isSelected ? 'fb-face-indicator--selected' : ''}`}
                      style={{
                        left: r.x * cw,
                        top: r.y * ch,
                        width: r.w * cw,
                        height: r.h * ch,
                        borderColor: isSelected ? '#3b82f6' : 'transparent',
                        cursor: 'move',
                        pointerEvents: 'auto',
                        zIndex: isSelected ? 6 : 5,
                      }}
                      onClick={(e) => { e.stopPropagation(); setSelectedRegionIdx(selectedRegionIdx === i ? null : i); }}
                    >
                      <span className="fb-face-indicator__label">
                        {(r.blurMode === 'emoji' ? (t('faceBlur.emoji') || 'Emoji') : (t('faceBlur.blur') || 'Blur')) + ' ' + (i + 1)}
                      </span>
                      {isSelected && (
                        <>
                          <div className="fb-resize-handle fb-resize-handle--nw" />
                          <div className="fb-resize-handle fb-resize-handle--ne" />
                          <div className="fb-resize-handle fb-resize-handle--sw" />
                          <div className="fb-resize-handle fb-resize-handle--se" />
                          <div className="fb-resize-handle fb-resize-handle--n" />
                          <div className="fb-resize-handle fb-resize-handle--s" />
                          <div className="fb-resize-handle fb-resize-handle--w" />
                          <div className="fb-resize-handle fb-resize-handle--e" />
                        </>
                      )}
                    </div>
                  );
                })}

                {/* Interactive overlay: always present for region dragging, crosshair in manual mode */}
                <div
                  className="fb-draw-overlay"
                  style={{ cursor: overlayCursor }}
                  onMouseDown={handleDrawStart}
                  onMouseMove={handleDrawMove}
                  onMouseUp={handleDrawEnd}
                  onMouseLeave={handleDrawEnd}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  {drawRect && !drawRect.isCircle && (
                    <div className="fb-draw-rect" style={{ left: drawRect.left, top: drawRect.top, width: drawRect.width, height: drawRect.height }} />
                  )}
                  {drawRect && drawRect.isCircle && (
                    <div className="fb-draw-circle" style={{
                      left: drawRect.cx - drawRect.radius,
                      top: drawRect.cy - drawRect.radius,
                      width: drawRect.radius * 2,
                      height: drawRect.radius * 2,
                    }} />
                  )}
                </div>
              </div>
            )}

            {/* Action buttons below image */}
            {selected && (
              <div className="fb-left__actions">
                <button
                  className="fb-left__download"
                  onClick={handleDownloadCurrent}
                  disabled={downloading || regions.length === 0}
                >
                  <i className="fa-solid fa-download"></i> {t('common.download')}
                </button>
                {isMulti && (
                  <button className="fb-left__next" onClick={handleNextImage}>
                    <i className="fa-solid fa-forward"></i> {t('removeBg.nextImage') || 'Next Image'}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ---------- RIGHT PANEL (tools) ---------- */}
        <div className={`fb-right ${mobileToolsOpen ? 'fb-right--open' : ''}`}>
          <div className="fb-right__sticky">
            {/* Header */}
            <div className="fb-right__header">
              <h3><i className="fa-solid fa-user-shield"></i> {t('faceBlur.blurTools')}</h3>
              <div className="fb-right__header-actions">
                <button className="fb-right__close" onClick={() => setMobileToolsOpen(false)}>
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
            </div>

            {/* Stats */}
            {selected && (
              <div className="fb-right__stats">
                <div className="fb-stat"><span className="fb-stat__label">{t('common.width')}</span><span className="fb-stat__value">{selected.origW}px</span></div>
                <div className="fb-stat"><span className="fb-stat__label">{t('common.height')}</span><span className="fb-stat__value">{selected.origH}px</span></div>
                <div className="fb-stat"><span className="fb-stat__label">{t('common.size')}</span><span className="fb-stat__value">{fmtSize(selected.file.size)}</span></div>
                <div className="fb-stat"><span className="fb-stat__label">{t('faceBlur.faces')}</span><span className="fb-stat__value">{regions.length}</span></div>
              </div>
            )}

            <div className="fb-separator" />

            {/* ---- Blur Settings ---- */}
            {(() => {
              const sr = selectedRegionIdx != null ? regions[selectedRegionIdx] : null;
              const effectiveMode = sr ? (sr.blurMode || blurMode) : blurMode;
              const effectiveEmoji = sr ? (sr.emoji || selectedEmoji) : selectedEmoji;
              return (
              <>
            <div className="fb-section">
              <span className="fb-section__label">{t('faceBlur.blurType')}</span>
              <div className="fb-shape-options">
                <button className={`fb-shape-btn ${effectiveMode === 'blur' ? 'active' : ''}`} onClick={() => {
                  setBlurMode('blur');
                  if (selectedRegionIdx != null) {
                    setRegions((prev) => prev.map((r, i) => i === selectedRegionIdx ? { ...r, blurMode: 'blur' } : r));
                  }
                }}>
                  <i className="fa-solid fa-eye-slash"></i> {t('faceBlur.blur')}
                </button>
                <button className={`fb-shape-btn ${effectiveMode === 'emoji' ? 'active' : ''}`} onClick={() => {
                  setBlurMode('emoji');
                  if (selectedRegionIdx != null) {
                    setRegions((prev) => prev.map((r, i) => i === selectedRegionIdx ? { ...r, blurMode: 'emoji' } : r));
                  }
                }}>
                  <i className="fa-solid fa-face-grin"></i> {t('faceBlur.emoji')}
                </button>
              </div>
            </div>

            {effectiveMode === 'blur' && (
              <>
                <div className="fb-section">
                  <span className="fb-section__label">{t('faceBlur.blurIntensity')}{selectedRegionIdx != null ? ` (Region ${selectedRegionIdx + 1})` : ''}</span>
                  <div className="fb-slider-row">
                    <div className="fb-slider-row__top">
                      <span className="fb-slider-row__label">{t('faceBlur.strength')}</span>
                      <span className="fb-slider-row__value">{selectedRegionIdx != null && regions[selectedRegionIdx] ? (regions[selectedRegionIdx].intensity != null ? regions[selectedRegionIdx].intensity : blurIntensity) : blurIntensity}%</span>
                    </div>
                    <input type="range" className="fb-slider" min={5} max={100}
                      value={selectedRegionIdx != null && regions[selectedRegionIdx] ? (regions[selectedRegionIdx].intensity != null ? regions[selectedRegionIdx].intensity : blurIntensity) : blurIntensity}
                      onChange={(e) => {
                        const val = +e.target.value;
                        setBlurIntensity(val);
                        if (selectedRegionIdx != null) {
                          setRegions((prev) => prev.map((r, i) => i === selectedRegionIdx ? { ...r, intensity: val } : r));
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="fb-section">
                  <span className="fb-section__label">{t('faceBlur.blurShape')}</span>
                  <div className="fb-shape-options">
                    <button className={`fb-shape-btn ${blurShape === 'rectangle' ? 'active' : ''}`} onClick={() => {
                      setBlurShape('rectangle');
                      if (selectedRegionIdx != null) {
                        setRegions((prev) => prev.map((r, i) => i === selectedRegionIdx ? { ...r, shape: 'rectangle' } : r));
                      }
                    }}>
                      <i className="fa-regular fa-square"></i> {t('faceBlur.rectangle')}
                    </button>
                    <button className={`fb-shape-btn ${blurShape === 'circle' ? 'active' : ''}`} onClick={() => {
                      setBlurShape('circle');
                      if (selectedRegionIdx != null) {
                        setRegions((prev) => prev.map((r, i) => i === selectedRegionIdx ? { ...r, shape: 'circle' } : r));
                      }
                    }}>
                      <i className="fa-regular fa-circle"></i> {t('faceBlur.circle')}
                    </button>
                  </div>
                </div>
              </>
            )}

            {effectiveMode === 'emoji' && (
              <div className="fb-emoji-section">
                <span className="fb-section__label">{t('faceBlur.chooseEmoji')}</span>
                <div className="fb-emoji-grid">
                  {EMOJIS.map((em) => (
                    <button
                      key={em}
                      className={`fb-emoji-btn ${effectiveEmoji === em ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedEmoji(em);
                        if (selectedRegionIdx != null) {
                          setRegions((prev) => prev.map((r, i) => i === selectedRegionIdx ? { ...r, emoji: em, blurMode: 'emoji' } : r));
                        }
                      }}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>
            )}
              </>
              );
            })()}

            <div className="fb-separator" />

            {/* ---- Regions list ---- */}
            {regions.length > 0 && (
              <div className="fb-section">
                <span className="fb-section__label">{t('faceBlur.blurRegionsN').replace('{n}', regions.length)}</span>
                <div className="fb-region-list">
                  {regions.map((r, i) => (
                    <div
                      key={i}
                      className={`fb-region-item ${selectedRegionIdx === i ? 'fb-region-item--selected' : ''}`}
                      onClick={() => setSelectedRegionIdx(selectedRegionIdx === i ? null : i)}
                      style={{ cursor: 'pointer' }}
                    >
                      <i className={`fb-region-item__icon fa-solid ${r.blurMode === 'emoji' ? 'fa-face-grin' : 'fa-eye-slash'}`}></i>
                      <span className="fb-region-item__label">{(r.blurMode === 'emoji' ? 'Emoji' : 'Blur') + ' ' + (i + 1)}</span>
                      <button className="fb-region-item__remove" onClick={(e) => { e.stopPropagation(); removeRegion(i); }} title={t('faceBlur.removeRegion') || 'Remove region'}>
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  ))}
                </div>
                <div style={{ height: 4 }} />
                <button className="fb-detect-btn fb-detect-btn--secondary" onClick={clearRegions} style={{ fontSize: '0.8rem', padding: '8px 12px' }}>
                  <i className="fa-solid fa-trash-can"></i> {t('faceBlur.clearAllRegions')}
                </button>
              </div>
            )}

            <div className="fb-separator" />

            {/* Add more */}
            <button className="fb-right__add" onClick={() => addFileInputRef.current?.click()}>
              <i className="fa-solid fa-plus"></i> {t('common.addMoreImages')}
            </button>
            <input
              ref={addFileInputRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }}
            />

            {/* Reset */}
            <button className="fb-right__reset" onClick={resetAll}>
              <i className="fa-solid fa-rotate-left"></i> {t('common.startOver')}
            </button>

            {/* ---- Download mode toggle (above download button if multi) ---- */}
            {isMulti && (
              <div className="fb-dl-toggle">
                <button className={`fb-dl-toggle__btn ${downloadMode === 'zip' ? 'active' : ''}`} onClick={() => setDownloadMode('zip')}>
                  <i className="fa-solid fa-file-zipper"></i> {t('common.zip')}
                </button>
                <button className={`fb-dl-toggle__btn ${downloadMode === 'separate' ? 'active' : ''}`} onClick={() => setDownloadMode('separate')}>
                  <i className="fa-solid fa-download"></i> {t('common.separate')}
                </button>
              </div>
            )}

            {/* ---- Download ---- */}
            <div className="fb-right__actions">
              <button className="fb-right__download" onClick={handleDownload} disabled={downloading || regions.length === 0}>
                {downloading ? (
                  <><span className="fb-download-spinner" /> {t('faceBlur.processingDots')}</>
                ) : (
                  <><i className="fa-solid fa-download"></i> {t('common.download') || 'Download'}</>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Download confirmation dialog ---- */}
      {showDownloadDialog && (
        <div className="fb-dialog-overlay" onClick={() => setShowDownloadDialog(false)}>
          <div className="fb-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="fb-dialog__icon">
              <i className="fa-solid fa-circle-info"></i>
            </div>
            <div className="fb-dialog__title">{t('faceBlur.notAllEdited') || 'Not all images edited'}</div>
            <div className="fb-dialog__text">
              {(t('faceBlur.editedXofY') || 'You have edited {edited} of {total} images.').replace('{edited}', getEditedImages().length).replace('{total}', images.length)}
            </div>
            <div className="fb-dialog__actions">
              <button className="fb-dialog__btn fb-dialog__btn--primary" onClick={handleDownloadEdited}>
                <i className="fa-solid fa-download"></i> {t('common.download')} ({getEditedImages().length})
              </button>
              <button className="fb-dialog__btn fb-dialog__btn--secondary" onClick={handleDownloadAll}>
                <i className="fa-solid fa-download"></i> {t('faceBlur.downloadAll') || 'Download All'}
              </button>
              <button className="fb-dialog__btn fb-dialog__btn--cancel" onClick={() => setShowDownloadDialog(false)}>
                {t('common.cancel') || 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FaceBlur;