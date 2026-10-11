'use client';

import { useEffect, useRef, useState } from 'react';

import {
  ISOTYPE_ASSETS,
  ISOTYPE_RINGED_POSTER,
  ISOTYPE_TURN_SECONDS,
  type IsotypeVariant,
} from '@/config/isotype';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { cn } from '@/lib/cn';
import type { IsotypeViewer } from '@/lib/isotype/viewer';

/** Tope del salto entre fotogramas: al volver de una pausa el giro no da un tirón. */
const MAX_FRAME_MS = 100;

type IsotypeProps = {
  variant?: IsotypeVariant;
  /** Nombre accesible, ya traducido. Sin él es decorativo (`aria-hidden`). */
  label?: string;
  className?: string;
} & (
  | {
      /** `false` lo deja quieto, de frente, sin WebGL. */
      spin?: true;
      ringed?: false;
    }
  | {
      spin: false;
      /** Con el círculo del logo original. */
      ringed?: boolean;
    }
);

/**
 * El isotipo de la marca. Es el mismo en todo el sitio: header, portal, héroe,
 * acceso, espera y Mi Santuario.
 *
 * Cuadrado: el tamaño lo pone quien lo usa con `className` (`size-[72px]`…) y
 * `variant` elige el dibujo — la óptica (`sm`, por defecto) hasta unos 120 px
 * de lado, la de detalle desde unos 160.
 *
 * Con `spin` (por defecto) gira despacio sobre su eje vertical, en 3D: empieza
 * como un póster SVG de la vista frontal, y el visor WebGL y el modelo se
 * piden sólo cuando entra en pantalla; el giro arranca de frente para que el
 * relevo no se note. Con `spin={false}`, con movimiento reducido o sin WebGL
 * se queda el póster, que es la misma vista quieta.
 *
 * `ringed` le pone el círculo del logo original; sólo quieto, porque el modelo
 * 3D no lo lleva.
 *
 * Decorativo salvo que reciba `label`, que lo anuncia como imagen.
 *
 * Cada instancia que gira abre su propio contexto WebGL: está pensado para
 * unas pocas por vista, no para una rejilla.
 */
export function Isotype({
  variant = 'sm',
  spin = true,
  ringed = false,
  label,
  className,
}: IsotypeProps) {
  const { model, poster } = ISOTYPE_ASSETS[variant];
  const hostRef = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotionSafe();
  const [live, setLive] = useState(false);

  useEffect(() => {
    const host = hostRef.current;

    if (!spin || reduced || !host) return;

    const canvas = document.createElement('canvas');
    canvas.className = 'absolute inset-0 size-full opacity-0 transition-opacity duration-700';
    host.append(canvas);

    const abort = new AbortController();
    let viewer: IsotypeViewer | null = null;
    let requested = false;
    let visible = false;
    let frame = 0;
    let last: number | null = null;
    let elapsed = 0;

    const fit = () => {
      const side = Math.max(1, Math.round(host.clientWidth * Math.min(devicePixelRatio || 1, 2)));

      if (canvas.width !== side) canvas.width = canvas.height = side;
    };

    const tick = (now: number) => {
      frame = 0;

      if (!viewer || !visible || document.hidden) return;

      elapsed += last === null ? 0 : Math.min(now - last, MAX_FRAME_MS);
      last = now;
      viewer.draw((elapsed / 1000 / ISOTYPE_TURN_SECONDS) * Math.PI * 2);
      frame = requestAnimationFrame(tick);
    };

    const play = () => {
      if (frame || !viewer || !visible || document.hidden) return;

      last = null;
      frame = requestAnimationFrame(tick);
    };

    const load = async () => {
      const { loadIsotypeViewer } = await import('@/lib/isotype/viewer');
      const loaded = await loadIsotypeViewer(canvas, model, abort.signal);

      if (abort.signal.aborted) {
        loaded?.dispose();

        return;
      }

      if (!loaded) return;

      viewer = loaded;
      fit();
      viewer.draw(0);
      canvas.classList.replace('opacity-0', 'opacity-100');
      setLive(true);
      play();
    };

    const onIntersect: IntersectionObserverCallback = ([entry]) => {
      visible = entry?.isIntersecting ?? false;

      if (visible && !requested) {
        requested = true;
        // Sin modelo o sin WebGL no se pierde nada: se queda el póster.
        load().catch(() => {});
      }

      play();
    };

    const onResize = () => {
      fit();

      if (viewer && !frame) viewer.draw((elapsed / 1000 / ISOTYPE_TURN_SECONDS) * Math.PI * 2);
    };

    const intersection = new IntersectionObserver(onIntersect);
    const resize = new ResizeObserver(onResize);

    intersection.observe(host);
    resize.observe(host);
    document.addEventListener('visibilitychange', play);

    return () => {
      abort.abort();
      cancelAnimationFrame(frame);
      intersection.disconnect();
      resize.disconnect();
      document.removeEventListener('visibilitychange', play);
      viewer?.dispose();
      canvas.remove();
      setLive(false);
    };
  }, [spin, reduced, model]);

  return (
    <span
      ref={hostRef}
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
      className={cn('relative block aspect-square', className)}
    >
      {/* Póster por CSS: un `<img>` pasaría por el loader de imágenes editoriales. */}
      <span
        className={cn(
          'absolute inset-0 bg-contain bg-center bg-no-repeat transition-opacity duration-700',
          live ? 'opacity-0' : 'opacity-100',
        )}
        style={{ backgroundImage: `url(${ringed ? ISOTYPE_RINGED_POSTER : poster})` }}
      />
    </span>
  );
}
