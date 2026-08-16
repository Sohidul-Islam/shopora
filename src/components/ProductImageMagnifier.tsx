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
  magnifierSize = 160,
  zoomLevel = 2.5,
}: ProductImageMagnifierProps) {
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [[x, y], setXY] = useState([0, 0]);
  const [[imgWidth, imgHeight], setSize] = useState([0, 0]);
  
  // Fullscreen Lightbox state
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxZoom, setLightboxZoom] = useState(1);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = (e: MouseEvent<HTMLDivElement>) => {
    const elem = e.currentTarget;
    const { width, height } = elem.getBoundingClientRect();
    setSize([width, height]);
    setShowMagnifier(true);
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const elem = e.currentTarget;
    const { top, left } = elem.getBoundingClientRect();
    const cursorX = e.clientX - left;
    const cursorY = e.clientY - top;
    setXY([cursorX, cursorY]);
  };

  const handleMouseLeave = () => {
    setShowMagnifier(false);
  };

  // Keyboard shortcut ESC to close lightbox modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsLightboxOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Main Image Viewport with Hover Listener */}
        <div
          ref={containerRef}
          className="relative w-full flex-1 aspect-square bg-white dark:bg-white/5 rounded-2xl flex items-center justify-center p-8 border border-black/5 dark:border-white/10 cursor-crosshair overflow-hidden group transition-all"
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={() => {
            setLightboxZoom(1);
            setIsLightboxOpen(true);
          }}
        >
          <img
            src={src}
            alt={alt}
            className="max-h-[360px] w-auto object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.05)] dark:drop-shadow-[0_10px_20px_rgba(0,0,0,0.35)] select-none transition-transform duration-200"
          />

          {/* Hover to Zoom Floating Indicator Badge */}
          <div className="absolute top-4 right-4 bg-slate-900/80 dark:bg-slate-950/80 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[11px] font-bold flex items-center gap-1.5 pointer-events-none shadow-md border border-white/10 opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all">
            <ZoomIn className="w-3.5 h-3.5 text-purple-400" />
            <span>Hover / Click to zoom</span>
          </div>

          {/* Circular Magnifying Glass Lens */}
          {showMagnifier && (
            <div
              style={{
                position: 'absolute',
                pointerEvents: 'none',
                height: `${magnifierSize}px`,
                width: `${magnifierSize}px`,
                top: `${y - magnifierSize / 2}px`,
                left: `${x - magnifierSize / 2}px`,
                opacity: 1,
                border: '2px solid rgba(168, 85, 247, 0.85)',
                borderRadius: '50%',
                backgroundColor: 'white',
                backgroundImage: `url('${src}')`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: `${imgWidth * zoomLevel}px ${imgHeight * zoomLevel}px`,
                backgroundPositionX: `${-x * zoomLevel + magnifierSize / 2}px`,
                backgroundPositionY: `${-y * zoomLevel + magnifierSize / 2}px`,
                boxShadow: '0 20px 30px -10px rgba(0,0,0,0.5), 0 0 0 4px rgba(255,255,255,0.4)',
                zIndex: 40,
              }}
            />
          )}
        </div>
      </div>

      {/* Fullscreen Magnifying Lightbox Modal */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-between p-6 animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsLightboxOpen(false);
          }}
        >
          {/* Header Controls Bar */}
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

          {/* Lightbox Zoom Area */}
          <div className="flex-1 w-full flex items-center justify-center overflow-auto p-4 cursor-grab active:cursor-grabbing">
            <img
              src={src}
              alt={alt}
              style={{ transform: `scale(${lightboxZoom})` }}
              className="max-h-[75vh] max-w-[85vw] object-contain transition-transform duration-200 select-none drop-shadow-2xl"
            />
          </div>

          {/* Lightbox Footer Instruction */}
          <div className="text-xs text-slate-400 z-10 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full backdrop-blur-md">
            Click controls or press <kbd className="px-1.5 py-0.5 bg-white/10 rounded font-mono text-[10px]">ESC</kbd> to exit full zoom
          </div>
        </div>
      )}
    </>
  );
}
