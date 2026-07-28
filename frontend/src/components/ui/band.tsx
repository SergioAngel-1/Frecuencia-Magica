import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

/**
 * Relación de aspecto del contenedor. `'auto'` no fija ninguna: se usa
 * cuando el `Band` va absolutamente posicionado dentro de un padre que ya
 * tiene su propio tamaño/forma (p. ej. los discos circulares del prototipo,
 * `position:absolute;inset:Npx` sobre un contenedor ya redondeado).
 */
export type BandAspect = 'square' | '4/5' | '16/8' | 'auto';

const ASPECT_CLASSES: Record<BandAspect, string> = {
  square: 'aspect-square',
  '4/5': 'aspect-[4/5]',
  '16/8': 'aspect-[16/8]',
  auto: '',
};

/** Capa de luz que SIEMPRE se renderiza, valor exacto del brief 4.3. */
const LIGHT_SWEEP = 'radial-gradient(70% 100% at 30% 10%, rgba(247,244,234,0.18), transparent 60%)';

/** Degradado inferior de las cards con texto sobre imagen, valor exacto del brief 4.3. */
const BOTTOM_OVERLAY = 'linear-gradient(180deg, transparent 30%, rgba(10,18,32,0.72))';

interface BandProps {
  /**
   * Gradiente CSS de fondo (un valor de `background-image`, p. ej.
   * `linear-gradient(...)`). Recibe un string crudo en vez de una `BandKey`:
   * `Band` no importa `@/config/bands` (mantiene `ui/` desacoplado de
   * cualquier tabla de datos concreta) — el llamador pasa `BANDS.teal`,
   * `BANDS.gold`, etc., o cualquier otro gradiente ad hoc.
   */
  gradient: string;
  /** Relación de aspecto del contenedor. Por defecto `'auto'`. */
  aspect?: BandAspect;
  /** `'bottom'` añade el degradado inferior que usan las cards con texto encima. */
  overlay?: 'bottom';
  /** Contenido posicionado encima del gradiente (badges, texto, iconos...). */
  children?: ReactNode;
  className?: string;
}

/**
 * Placeholder de gradiente que sustituye a TODAS las imágenes del portal:
 * nunca fotos de stock, nunca cajas grises. Siempre lleva el barrido de luz
 * superior; opcionalmente el degradado inferior para legibilidad de texto.
 * Server Component puro.
 */
export function Band({ gradient, aspect = 'auto', overlay, children, className }: BandProps) {
  return (
    <div
      className={cn('relative isolate overflow-hidden', ASPECT_CLASSES[aspect], className)}
      style={{ backgroundImage: gradient }}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ backgroundImage: LIGHT_SWEEP }} />
      {overlay === 'bottom' ? (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ backgroundImage: BOTTOM_OVERLAY }} />
      ) : null}
      {children ? <div className="relative z-10">{children}</div> : null}
    </div>
  );
}
