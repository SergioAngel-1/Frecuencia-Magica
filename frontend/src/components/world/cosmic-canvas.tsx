'use client';

import { useEffect, useRef } from 'react';

import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { useRealm } from '@/hooks/use-realm';
import { hexToRgb, type Rgb } from '@/lib/cosmic/colors';
import { advanceParticle, createParticles, createStars } from '@/lib/cosmic/particles';

const STAR_COUNT = 220;
const PARTICLE_COUNT = 54;

/** Nebulosas fijas del canvas. La tercera se recolorea con el acento del realm. */
const NEBULAE: readonly { x: number; y: number; r: number; color: Rgb | null }[] = [
  { x: 0.22, y: 0.3, r: 0.42, color: [150, 198, 188] },
  { x: 0.78, y: 0.7, r: 0.4, color: [185, 176, 214] },
  { x: 0.55, y: 0.45, r: 0.34, color: null },
];

/**
 * Fondo cósmico: estrellas que parpadean, polen dorado que asciende y tres
 * nebulosas a la deriva. Se recolorea al acento del realm sin regenerar nada.
 *
 * Port literal de `setupCanvas` / `drawFrame` del prototipo. Los valores mágicos
 * son intencionales.
 */
export function CosmicCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { accent } = useRealm();
  const reduced = useReducedMotionSafe();

  // El acento vive en un ref para que el bucle lo lea sin reiniciarse.
  const accentRef = useRef<Rgb>(hexToRgb(accent));
  useEffect(() => {
    accentRef.current = hexToRgb(accent);
  }, [accent]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const stars = createStars(STAR_COUNT, Math.random);
    let particles = createParticles(PARTICLE_COUNT, Math.random);

    const draw = (time: number, twinkleFrozen: boolean) => {
      ctx.clearRect(0, 0, width, height);
      const max = Math.max(width, height);

      // Nebulosas radiales a la deriva.
      NEBULAE.forEach((nebula, i) => {
        const color = nebula.color ?? accentRef.current;
        const dx = Math.sin(time * (0.6 + i * 0.3)) * 0.03;
        const dy = Math.cos(time * (0.5 + i * 0.25)) * 0.03;
        const cx = (nebula.x + dx) * width;
        const cy = (nebula.y + dy) * height;
        const r = nebula.r * max;
        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        gradient.addColorStop(0, `rgba(${color[0]},${color[1]},${color[2]},0.11)`);
        gradient.addColorStop(1, `rgba(${color[0]},${color[1]},${color[2]},0)`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      });

      // Estrellas: parpadeo senoidal.
      for (const star of stars) {
        const tw = twinkleFrozen ? 0.7 : 0.5 + 0.5 * Math.sin(time * 6 * star.sp + star.tw);
        ctx.beginPath();
        ctx.arc(star.x * width, star.y * height, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(247,244,234,${0.25 + 0.6 * tw})`;
        ctx.fill();
      }

      // Partículas de polen con el color de acento.
      const [ar, ag, ab] = accentRef.current;
      for (const p of particles) {
        const px = p.x * width;
        const py = p.y * height;
        const pr = p.r * 4;
        const gradient = ctx.createRadialGradient(px, py, 0, px, py, pr);
        gradient.addColorStop(0, `rgba(${ar},${ag},${ab},${p.a})`);
        gradient.addColorStop(1, `rgba(${ar},${ag},${ab},0)`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(px, py, pr, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    // Movimiento reducido: un único frame quieto, sin encadenar rAF.
    if (reduced) {
      draw(0, true);
      const onResizeStatic = () => {
        resize();
        draw(0, true);
      };
      window.addEventListener('resize', onResizeStatic);
      return () => window.removeEventListener('resize', onResizeStatic);
    }

    let raf = 0;
    let resizeTimer: ReturnType<typeof setTimeout> | null = null;

    const loop = (timestamp: number) => {
      const time = timestamp * 0.0001;
      particles = particles.map((p) => advanceParticle(p));
      draw(time, false);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    };
    window.addEventListener('resize', onResize);

    // Pausar fuera de pantalla para no gastar batería.
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else {
        raf = requestAnimationFrame(loop);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      if (resizeTimer) clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [reduced]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  );
}
