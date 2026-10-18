'use client';

import type { CSSProperties } from 'react';

import { DOT_BASE, RING_BASE, useLuminousCursor } from '@/hooks/use-luminous-cursor';

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
  background: 'var(--color-accent)',
  boxShadow: '0 0 14px 3px rgb(var(--halo) / 0.75), 0 0 30px 8px rgb(var(--halo) / 0.35)',
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
  border: '1px solid rgb(var(--halo) / 0.45)',
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
 * La conducta vive en `useLuminousCursor`; aquí sólo queda el DOM y sus estilos.
 * No se monta en dispositivos táctiles; con movimiento reducido el anillo no
 * interpola (sin estela).
 */
export function LuminousCursor() {
  const { rootRef, dotTranslateRef, dotScaleRef, ringTranslateRef, ringScaleRef } =
    useLuminousCursor();

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
