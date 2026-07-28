import { useState, useEffect, useCallback, useRef } from 'react';
import { Skeleton } from './Skeleton';

// title: [regular, italic] — avoids dangerouslySetInnerHTML
const sampleSlides = [
  {
    id: 1,
    image: 'https://picsum.photos/seed/spiritual-wellness/1200/600',
    title: ['Eleva tu ', 'consciencia'],
    subtitle: 'Jabones artesanales y esencias florales para tu transformación personal.',
    cta: 'Explorar tienda',
    badge: 'ARTESANAL',
  },
  {
    id: 2,
    image: 'https://picsum.photos/seed/marisol-mentor/1200/600',
    title: ['Mentoría ', 'personal'],
    subtitle: 'Acompañamiento íntimo con Marisol Núñez hacia tu mejor versión.',
    cta: 'Agendar sesión',
    badge: 'MENTORÍAS',
  },
  {
    id: 3,
    image: 'https://picsum.photos/seed/botanical-magic/1200/600',
    title: ['Esencias que ', 'sanan'],
    subtitle: 'Rituales de bienestar con ingredientes naturales y conciencia plena.',
    cta: 'Descubrir',
    badge: 'BIENESTAR',
  },
];

function CarouselArrow({ direction, onClick, disabled }) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      disabled={disabled}
      className={`
        absolute top-1/2 -translate-y-1/2 z-30
        w-12 h-12 rounded-full
        bg-fm-carbon/50 backdrop-blur-md hover:bg-fm-carbon/70
        shadow-lg border border-white/20
        flex items-center justify-center
        transition-all duration-300
        disabled:opacity-40 disabled:cursor-not-allowed hover:scale-110 active:scale-95
        ${direction === 'left' ? 'left-4' : 'right-4'}
      `}
    >
      <svg className={`w-5 h-5 text-white ${direction === 'right' ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </button>
  );
}

export function BannerCarousel({ slides = sampleSlides, autoPlay = true, interval = 5000, loading = false, className = '' }) {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [progress, setProgress] = useState(0);
  const containerRef = useRef(null);

  const next = useCallback(() => { setCurrent(p => (p + 1) % slides.length); setProgress(0); }, [slides.length]);
  const prev = useCallback(() => { setCurrent(p => (p - 1 + slides.length) % slides.length); setProgress(0); }, [slides.length]);
  const goTo = useCallback((i) => { setCurrent(i); setProgress(0); }, []);

  useEffect(() => {
    if (!autoPlay || isHovered || loading || isDragging) { setProgress(0); return; }
    const timer = setInterval(next, interval);
    const prog  = setInterval(() => setProgress(p => p >= 100 ? 0 : p + (100 / (interval / 100))), 100);
    return () => { clearInterval(timer); clearInterval(prog); };
  }, [autoPlay, interval, isHovered, next, loading, isDragging]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'ArrowLeft') prev(); else if (e.key === 'ArrowRight') next(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev]);

  const onPointerDown = (e) => {
    if (e.target.closest('button')) return;
    setIsDragging(true); setStartX(e.clientX); setDragOffset(0); setProgress(0);
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!isDragging) return;
    const max = (containerRef.current?.offsetWidth || 1) * 0.4;
    setDragOffset(Math.max(-max, Math.min(max, e.clientX - startX)));
  };
  const onPointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragOffset < -50) next(); else if (dragOffset > 50) prev();
    setDragOffset(0);
  };

  if (loading) {
    return (
      <div className={`relative ${className}`}>
        <Skeleton variant="rect" className="w-full h-[480px] rounded-2xl" />
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {[0,1,2].map(i => <Skeleton key={i} variant="circle" className="w-2.5 h-2.5" />)}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-2xl cursor-grab active:cursor-grabbing shadow-xl ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div
        className="flex"
        style={{
          transform: `translateX(calc(${-(current * 100)}% + ${isDragging ? dragOffset : 0}px))`,
          transition: isDragging ? 'none' : 'transform 500ms ease-out',
        }}
      >
        {slides.map((slide) => (
          <div key={slide.id} className="min-w-full relative h-[480px]">
            <img src={slide.image} alt="" className="w-full h-full object-cover select-none pointer-events-none" draggable={false} />
            <div className="absolute inset-0 bg-gradient-to-r from-fm-carbon/85 via-fm-carbon/40 to-transparent" />
            <div className="absolute inset-0 flex items-center px-24">
              <div className="max-w-lg">
                {slide.badge && (
                  <span className="inline-block bg-fm-rosa text-fm-carbon px-3 py-1 rounded-full text-[9px] font-body tracking-widest mb-4 shadow-md">
                    {slide.badge}
                  </span>
                )}
                <h3 className="font-heading text-[36pt] text-white leading-tight mb-3">
                  {slide.title[0]}<em>{slide.title[1]}</em>
                </h3>
                <p className="text-[14px] text-white/75 font-body mb-5 leading-relaxed">{slide.subtitle}</p>
                <button className="bg-fm-rosa hover:bg-fm-primary-hover text-fm-carbon px-6 py-2.5 rounded-lg font-heading text-sm transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                  {slide.cta}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <CarouselArrow direction="left" onClick={prev} disabled={isDragging} />
      <CarouselArrow direction="right" onClick={next} disabled={isDragging} />

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2.5 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            disabled={isDragging}
            className={`h-2 rounded-full transition-all duration-300 relative ${current === i ? 'bg-fm-primary w-6 shadow-md' : 'bg-white/30 hover:bg-white/60 w-2'} disabled:opacity-50`}
          >
            {current === i && autoPlay && !isHovered && !isDragging && (
              <div className="absolute inset-0 bg-white/30 rounded-full" style={{ width: `${progress}%`, transition: 'width 100ms linear' }} />
            )}
          </button>
        ))}
      </div>

      <div className="absolute top-4 right-4 bg-fm-carbon/50 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-xs font-body z-10">
        <span className="font-heading">{current + 1}</span>
        <span className="text-white/40 mx-1">/</span>
        <span className="text-white/40">{slides.length}</span>
      </div>
    </div>
  );
}

export default BannerCarousel;
