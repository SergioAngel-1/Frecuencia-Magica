'use client';

import { useEffect, useRef } from 'react';

import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';

/** Tamaños base del punto y el anillo (el componente los usa para posarlos). */
export const DOT_BASE = 9;
export const RING_BASE = 34;

const DOT_HOVER = 16;
const RING_HOVER = 54;
const LERP = 0.14;
/** Por debajo de esto el anillo ya está sobre el puntero: se posa y el bucle para. */
const SETTLE_PX = 0.1;
const SETTLE_SCALE = 0.002;

/** Crecimiento por `transform: scale` (sólo compositor), nunca `width/height`. */
export const DOT_SCALE = DOT_HOVER / DOT_BASE;
const RING_SCALE = RING_HOVER / RING_BASE;

/**
 * Conducta del cursor luminoso: mantiene el cursor en la capa superior del
 * navegador y mueve el punto y el anillo con el ratón, persiguiendo el anillo
 * con estela y creciendo ambos sobre elementos magnéticos (`[data-magnetic], a,
 * button`). Devuelve los refs que el componente conecta a su DOM.
 *
 * El estado magnético se resuelve en `pointerover` (delegado y cacheado), no en
 * cada `mousemove`: `closest()` por evento obligaba a recorrer el DOM sin parar.
 */
export function useLuminousCursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const dotTranslateRef = useRef<HTMLDivElement>(null);
  const dotScaleRef = useRef<HTMLDivElement>(null);
  const ringTranslateRef = useRef<HTMLDivElement>(null);
  const ringScaleRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionSafe();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof root.showPopover !== 'function') return;

    // Salir y volver a entrar lo deja el último de la capa superior.
    const promote = () => {
      if (root.matches(':popover-open')) root.hidePopover();
      root.showPopover();
    };
    promote();

    const observer = new MutationObserver((records) => {
      const opened = records.some(
        ({ target }) => target instanceof HTMLDialogElement && target.open,
      );
      if (opened) promote();
    });
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['open'],
      subtree: true,
    });

    return () => {
      observer.disconnect();
      if (root.matches(':popover-open')) root.hidePopover();
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return;

    const dotTranslate = dotTranslateRef.current;
    const dotScale = dotScaleRef.current;
    const ringTranslate = ringTranslateRef.current;
    const ringScale = ringScaleRef.current;
    if (!dotTranslate || !dotScale || !ringTranslate || !ringScale) return;

    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;
    let ringX = pointerX;
    let ringY = pointerY;
    // Escala objetivo del anillo (1 en reposo, RING_SCALE sobre magnético): el
    // punto la aplica al instante, el anillo la persigue como a la posición.
    let targetScale = 1;
    // Último estado magnético visto (`pointerover` dispara con cada elemento).
    let magnetic = false;
    let raf = 0;
    let currentScale = 1;

    // El anillo persigue al puntero y se duerme al alcanzarlo: con el ratón
    // quieto no queda ningún bucle pidiendo frames. El siguiente evento lo despierta.
    const follow = () => {
      ringX += (pointerX - ringX) * (reduced ? 1 : LERP);
      ringY += (pointerY - ringY) * (reduced ? 1 : LERP);
      currentScale += (targetScale - currentScale) * (reduced ? 1 : LERP);

      const settled =
        Math.abs(pointerX - ringX) < SETTLE_PX &&
        Math.abs(pointerY - ringY) < SETTLE_PX &&
        Math.abs(targetScale - currentScale) < SETTLE_SCALE;
      if (settled) {
        ringX = pointerX;
        ringY = pointerY;
        currentScale = targetScale;
      }

      ringTranslate.style.transform = `translate(${ringX}px, ${ringY}px)`;
      ringScale.style.transform = `scale(${currentScale})`;
      raf = settled ? 0 : requestAnimationFrame(follow);
    };

    const wake = () => {
      if (!raf) raf = requestAnimationFrame(follow);
    };

    // `mousemove` sólo coloca el punto.
    const onMove = (e: MouseEvent) => {
      pointerX = e.clientX;
      pointerY = e.clientY;
      dotTranslate.style.transform = `translate(${pointerX}px, ${pointerY}px)`;
      wake();
    };

    // El estado magnético se resuelve al entrar en un elemento (`pointerover`
    // burbujea y delega en `window`), sólo cuando cambia.
    const onOver = (e: PointerEvent) => {
      const next =
        ((e.target as Element | null)?.closest('[data-magnetic], a, button') ?? null) !== null;
      if (next === magnetic) return;

      magnetic = next;
      targetScale = next ? RING_SCALE : 1;
      dotScale.style.transform = `scale(${next ? DOT_SCALE : 1})`;
      wake();
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('pointerover', onOver);
    raf = requestAnimationFrame(follow);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('pointerover', onOver);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return { rootRef, dotTranslateRef, dotScaleRef, ringTranslateRef, ringScaleRef };
}
