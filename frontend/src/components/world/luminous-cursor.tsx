'use client';

import { useEffect, useRef, type CSSProperties } from 'react';

import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';

const DOT_BASE = 9;
const DOT_HOVER = 16;
const RING_BASE = 34;
const RING_HOVER = 54;
const LERP = 0.14;
/** Por debajo de esto el anillo ya está sobre el puntero: se posa y el bucle para. */
const SETTLE_PX = 0.1;
const SETTLE_SCALE = 0.002;

/** Crecimiento por `transform: scale` (sólo compositor), nunca `width/height`. */
const DOT_SCALE = DOT_HOVER / DOT_BASE;
const RING_SCALE = RING_HOVER / RING_BASE;

/** Contenedor de 0×0 anclado en el puntero; recibe el `translate`. */
const wrapStyle: CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: 0,
  height: 0,
  pointerEvents: 'none',
  willChange: 'transform',
};

/**
 * Raíz del cursor. Además de anclarse como `wrapStyle`, neutraliza la hoja
 * del navegador para `[popover]` (caja centrada, con borde, fondo y recorte).
 */
const rootStyle: CSSProperties = {
  inset: 'auto',
  ...wrapStyle,
  margin: 0,
  padding: 0,
  border: 'none',
  background: 'transparent',
  overflow: 'visible',
};

const dotStyle: CSSProperties = {
  position: 'absolute',
  top: -DOT_BASE / 2,
  left: -DOT_BASE / 2,
  width: DOT_BASE,
  height: DOT_BASE,
  borderRadius: '50%',
  background: 'var(--color-gold)',
  boxShadow: '0 0 14px 3px rgba(216,185,120,0.75), 0 0 30px 8px rgba(216,185,120,0.35)',
  transition: 'transform .25s',
  willChange: 'transform',
};

const ringStyle: CSSProperties = {
  position: 'absolute',
  top: -RING_BASE / 2,
  left: -RING_BASE / 2,
  width: RING_BASE,
  height: RING_BASE,
  borderRadius: '50%',
  border: '1px solid rgba(216,185,120,0.45)',
  transition: 'transform .3s',
  willChange: 'transform',
};

/**
 * Cursor luminoso: un punto dorado que sigue al ratón sin retardo y un anillo
 * que lo persigue con estela. Ambos crecen sobre elementos magnéticos.
 *
 * El crecimiento usa `transform: scale` (sólo compositor): la regla del
 * proyecto limita las animaciones a `transform` y `opacity`, y animar
 * `width/height/margin` provocaba layout en cada cambio de tamaño.
 *
 * Vive en la capa superior del navegador (`popover="manual"`): un `<dialog>`
 * modal —el menú de navegación, cualquier `Modal`— se pinta ahí, por encima
 * de toda la escala `z-*`, y dejaba el cursor debajo. Dentro de esa capa manda
 * el orden de llegada, así que el cursor vuelve a entrar cada vez que se abre
 * un diálogo. Sin soporte de popover queda en `z-cursor`, como antes.
 *
 * Port de `setupCursor`. No se monta en dispositivos táctiles; con movimiento
 * reducido el anillo no interpola (sin estela).
 */
export function LuminousCursor() {
  const dotTranslateRef = useRef<HTMLDivElement>(null);
  const dotScaleRef = useRef<HTMLDivElement>(null);
  const ringTranslateRef = useRef<HTMLDivElement>(null);
  const ringScaleRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
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
    // Escala objetivo del anillo (1 en reposo, RING_SCALE sobre magnético):
    // el punto la aplica al instante, el anillo la persigue con la misma
    // interpolación que la posición.
    let targetScale = 1;

    const onMove = (e: MouseEvent) => {
      pointerX = e.clientX;
      pointerY = e.clientY;
      dotTranslate.style.transform = `translate(${pointerX}px, ${pointerY}px)`;

      const target = e.target as Element | null;
      const magnetic = target?.closest('[data-magnetic], a, button') != null;
      targetScale = magnetic ? RING_SCALE : 1;
      dotScale.style.transform = `scale(${magnetic ? DOT_SCALE : 1})`;
      if (!raf) raf = requestAnimationFrame(follow);
    };

    // El anillo persigue al puntero y se duerme al alcanzarlo: con el ratón
    // quieto no queda ningún bucle pidiendo frames. El siguiente movimiento
    // lo despierta.
    let raf = 0;
    let currentScale = 1;
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
    window.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(follow);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <div
      ref={rootRef}
      popover="manual"
      aria-hidden="true"
      className="fm-cursor z-cursor"
      style={rootStyle}
    >
      <div ref={dotTranslateRef} style={wrapStyle}>
        <div ref={dotScaleRef} style={dotStyle} />
      </div>
      <div ref={ringTranslateRef} style={wrapStyle}>
        <div ref={ringScaleRef} style={ringStyle} />
      </div>
    </div>
  );
}
