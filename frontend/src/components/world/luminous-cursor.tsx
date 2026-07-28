'use client';

import { useEffect, useRef, type CSSProperties } from 'react';

import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';

const DOT_BASE = 9;
const DOT_HOVER = 16;
const RING_BASE = 34;
const RING_HOVER = 54;
const LERP = 0.14;

const dotStyle: CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: DOT_BASE,
  height: DOT_BASE,
  margin: `${-DOT_BASE / 2}px 0 0 ${-DOT_BASE / 2}px`,
  borderRadius: '50%',
  background: 'var(--color-gold)',
  boxShadow: '0 0 14px 3px rgba(216,185,120,0.75), 0 0 30px 8px rgba(216,185,120,0.35)',
  transition: 'width .25s, height .25s, margin .25s',
  willChange: 'transform',
  pointerEvents: 'none',
  zIndex: 9999,
};

const ringStyle: CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: RING_BASE,
  height: RING_BASE,
  margin: `${-RING_BASE / 2}px 0 0 ${-RING_BASE / 2}px`,
  borderRadius: '50%',
  border: '1px solid rgba(216,185,120,0.45)',
  transition: 'width .3s, height .3s, margin .3s, border-color .3s',
  willChange: 'transform',
  pointerEvents: 'none',
  zIndex: 9998,
};

/**
 * Cursor luminoso: un punto dorado que sigue al ratón sin retardo y un anillo
 * que lo persigue con estela. Ambos crecen sobre elementos magnéticos.
 *
 * Port de `setupCursor`. No se monta en dispositivos táctiles; con movimiento
 * reducido el anillo no interpola (sin estela).
 */
export function LuminousCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionSafe();

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;
    let ringX = pointerX;
    let ringY = pointerY;

    const setDotSize = (size: number) => {
      dot.style.width = `${size}px`;
      dot.style.height = `${size}px`;
      dot.style.margin = `${-size / 2}px 0 0 ${-size / 2}px`;
    };
    const setRingSize = (size: number, hovering: boolean) => {
      ring.style.width = `${size}px`;
      ring.style.height = `${size}px`;
      ring.style.margin = `${-size / 2}px 0 0 ${-size / 2}px`;
      ring.style.borderColor = hovering ? 'rgba(216,185,120,0.8)' : 'rgba(216,185,120,0.45)';
    };

    const onMove = (e: MouseEvent) => {
      pointerX = e.clientX;
      pointerY = e.clientY;
      dot.style.transform = `translate(${pointerX}px, ${pointerY}px)`;

      const target = e.target as Element | null;
      const magnetic = target?.closest('[data-magnetic], a, button') != null;
      setDotSize(magnetic ? DOT_HOVER : DOT_BASE);
      setRingSize(magnetic ? RING_HOVER : RING_BASE, magnetic);
    };
    window.addEventListener('mousemove', onMove);

    let raf = 0;
    const follow = () => {
      ringX += (pointerX - ringX) * (reduced ? 1 : LERP);
      ringY += (pointerY - ringY) * (reduced ? 1 : LERP);
      ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
      raf = requestAnimationFrame(follow);
    };
    raf = requestAnimationFrame(follow);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <>
      <div ref={dotRef} className="fm-cursor" aria-hidden="true" style={dotStyle} />
      <div ref={ringRef} className="fm-cursor" aria-hidden="true" style={ringStyle} />
    </>
  );
}
