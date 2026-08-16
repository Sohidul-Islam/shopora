'use client';

import { useState, useRef, useEffect, MouseEvent } from 'react';
import { ZoomIn, ZoomOut, Maximize2, X, RefreshCw } from 'lucide-react';

interface ProductImageMagnifierProps {
  src: string;
  alt: string;
  magnifierSize?: number;
  zoomLevel?: number;
}

export function ProductImageMagnifier({
  src,
  alt,
  magnifierSize = 180,
  zoomLevel = 3,
}: ProductImageMagnifierProps) {
  const [showMagnifier, setShowMagnifier] = useState(false);
  
  // Mouse position relative to container
  const [[cursorX, cursorY], setCursorPos] = useState([0, 0]);

  // Exact image bounds & percentage coordinates
  const [imgDetails, setImgDetails] = useState({
    width: 0,
    height: 0,
    imgX: 0,
    imgY: 0,
    percentX: 50,
    percentY: 50,
  });

  // Zoom mode: 'lens' (magnifying glass follow cursor) or 'side' (side preview window)
  const [zoomMode, setZoomMode] = useState<'lens' | 'side'>('lens');

  // Lightbox Modal
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxZoom, setLightboxZoom] = useState(1);

  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const updatePosition = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !imgRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const imgRect = imgRef.current.getBoundingClientRect();

    // Container relative mouse position (for lens top/left)
    const cX = e.clientX - containerRect.left;
    const cY = e.clientY - containerRect.top;
    setCursorPos([cX, cY]);

    // Exact image relative position
    const relX = Math.max(0, Math.min(e.clientX - imgRect.left, imgRect.width));
    const relY = Math.max(0, Math.min(e.clientY - imgRect.top, imgRect.height));

    const pX = (relX / imgRect.width) * 100;
    const pY = (relY / imgRect.height) * 100;

    setImgDetails({
      width: imgRect.width,
      height: imgRect.height,
      imgX: relX,
      imgY: relY,
      percentX: pX,
      percentY: pY,
    });
  };

  const handleMouseEnter = (e: MouseEvent<HTMLDivElement>) => {
    updatePosition(e);
    setShowMagnifier(true);
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    updatePosition(e);
  };

  const handleMouseLeave = () => {
    setShowMagnifier(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsLightboxOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <div className="relative w-full h-full flex flex-col gap-3">
        {/* Mode Toggle Controls Bar */}
        <div className="flex items-center justify-between text-xs px-1 text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-bold uppercase tracking-wider text-[10px]">Zoom Mode:</span>
            <button
              type="button"
              onClick={() => setZoomMode('lens')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition ${
                zoomMode === 'lens'
                  ? 'bg-purple-650 dark:bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10'
              }`}
            >
              Magnifying Glass Lens
            </button>
            <button
              type="button"
              onClick={() => setZoomMode('side')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition ${
                zoomMode === 'side'
                  ? 'bg-purple-650 dark:bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10'
              }`}
            >
              Side Preview Window
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsLightboxOpen(true)}
            className="flex items-center gap-1 hover:text-purple-600 dark:hover:text-purple-400 transition font-semibold"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Fullscreen</span>
          </button>
        </div>

        {/* Main Showcase Container */}
        <div className="relative w-full flex gap-4 items-start">
          <div
            ref={containerRef}
            className="relative w-full flex-1 aspect-square bg-white dark:bg-white/5 rounded-2xl flex items-center justify-center p-8 border border-black/5 dark:border-white/10 cursor-crosshair overflow-hidden group select-none"
            onMouseEnter={handleMouseEnter}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
              setLightboxZoom(1);
              setIsLightboxOpen(true);
            }}
          >
            <img
              ref={imgRef}
              src={src}
              alt={alt}
              className="max-h-[360px] w-auto object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.05)] dark:drop-shadow-[0_10px_20px_rgba(0,0,0,0.35)] transition-transform duration-150"
            />

            {/* Hover Indicator Badge */}
            <div className="absolute top-3 right-3 bg-slate-900/80 dark:bg-slate-950/80 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[11px] font-bold flex items-center gap-1.5 pointer-events-none shadow-md border border-white/10 opacity-80 group-hover:opacity-100 transition-all">
              <ZoomIn className="w-3.5 h-3.5 text-purple-400" />
              <span>Hover mouse over section to zoom</span>
            </div>

            {/* MODE 1: MAGNIFYING GLASS LENS (Follows Cursor with Precise Image Alignment) */}
            {showMagnifier && zoomMode === 'lens' && (
              <div
                style={{
                  position: 'absolute',
                  pointerEvents: 'none',
                  height: `${magnifierSize}px`,
                  width: `${magnifierSize}px`,
                  top: `${cursorY - magnifierSize / 2}px`,
                  left: `${cursorX - magnifierSize / 2}px`,
                  opacity: 1,
                  border: '3px solid rgba(168, 85, 247, 0.9)',
                  borderRadius: '50%',
                  backgroundColor: 'white',
                  backgroundImage: `url('${src}')`,
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: `${imgDetails.width * zoomLevel}px ${imgDetails.height * zoomLevel}px`,
                  backgroundPositionX: `${-imgDetails.imgX * zoomLevel + magnifierSize / 2}px`,
                  backgroundPositionY: `${-imgDetails.imgY * zoomLevel + magnifierSize / 2}px`,
                  boxShadow: '0 20px 30px -10px rgba(0,0,0,0.5), 0 0 0 4px rgba(255,255,255,0.4)',
                  zIndex: 40,
                }}
              />
            )}

            {/* MODE 2: LENS HIGHLIGHT BOX FOR SIDE PREVIEW MODE */}
            {showMagnifier && zoomMode === 'side' && (
              <div
                style={{
                  position: 'absolute',
                  pointerEvents: 'none',
                  width: '120px',
                  height: '120px',
                  top: `${cursorY - 60}px`,
                  left: `${cursorX - 60}px`,
                  border: '2px solid #a855f7',
                  backgroundColor: 'rgba(168, 85, 247, 0.15)',
                  boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.25)',
                  borderRadius: '12px',
                  zIndex: 30,
                }}
              />
            )}
          </div>

          {/* MODE 2 SIDE PREVIEW WINDOW */}
          {showMagnifier && zoomMode === 'side' && (
            <div className="hidden lg:block absolute left-full top-0 ml-4 w-[420px] h-[420px] bg-white dark:bg-slate-900 border-2 border-purple-500 rounded-2xl overflow-hidden shadow-2xl z-50 p-2">
              <div
                className="w-full h-full rounded-xl"
                style={{
                  backgroundImage: `url('${src}')`,
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: `${imgDetails.width * (zoomLevel * 1.2)}px ${imgDetails.height * (zoomLevel * 1.2)}px`,
                  backgroundPosition: `${imgDetails.percentX}% ${imgDetails.percentY}%`,
                }}
              />
              <div className="absolute bottom-3 left-3 bg-black/70 text-white px-2.5 py-1 rounded-lg text-[10px] font-mono backdrop-blur-sm">
                Hover Position: {Math.round(imgDetails.percentX)}% X, {Math.round(imgDetails.percentY)}% Y
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-between p-6 animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsLightboxOpen(false);
          }}
        >
          <div className="w-full flex items-center justify-between z-10 max-w-6xl">
            <div className="flex items-center gap-2 text-white">
              <Maximize2 className="w-5 h-5 text-purple-400" />
              <span className="font-extrabold text-sm tracking-tight">{alt}</span>
              <span className="text-xs text-slate-400 font-mono">({Math.round(lightboxZoom * 100)}%)</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setLightboxZoom((prev) => Math.min(prev + 0.5, 4))}
                className="p-2.5 bg-white/10 hover:bg-purple-600 text-white rounded-xl transition shadow"
                title="Zoom In (+)"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
              <button
                onClick={() => setLightboxZoom((prev) => Math.max(prev - 0.5, 0.75))}
                className="p-2.5 bg-white/10 hover:bg-purple-600 text-white rounded-xl transition shadow"
                title="Zoom Out (-)"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <button
                onClick={() => setLightboxZoom(1)}
                className="p-2.5 bg-white/10 hover:bg-purple-600 text-white rounded-xl transition shadow"
                title="Reset Zoom (1:1)"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <div className="w-px h-6 bg-white/20 mx-1" />
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="p-2.5 bg-rose-500/20 hover:bg-rose-600 text-white rounded-xl transition shadow"
                title="Close (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 w-full flex items-center justify-center overflow-auto p-4 cursor-grab active:cursor-grabbing">
            <img
              src={src}
              alt={alt}
              style={{ transform: `scale(${lightboxZoom})` }}
              className="max-h-[75vh] max-w-[85vw] object-contain transition-transform duration-200 select-none drop-shadow-2xl"
            />
          </div>

          <div className="text-xs text-slate-400 z-10 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full backdrop-blur-md">
            Click controls or press <kbd className="px-1.5 py-0.5 bg-white/10 rounded font-mono text-[10px]">ESC</kbd> to exit full zoom
          </div>
        </div>
      )}
    </>
  );
}
