import type { CSSProperties } from 'react';

/**
 * Recorrido del flotado: `soft` (7 px) para tarjetas y fotos, que llevan
 * texto y controles; `deep` (14 px) para los discos, que son objetos sueltos.
 */
export type FloatDepth = 'soft' | 'deep';

export type FloatOptions = {
  /**
   * Posición del elemento entre sus hermanos. Desfasa duración y arranque
   * para que un grupo no suba y baje a la vez.
   */
  order?: number;
  depth?: FloatDepth;
  /** Duración explícita (`'7s'`), cuando dos piezas deben flotar juntas. */
  duration?: string;
  /** Arranque explícito (`'0.35s'`). */
  delay?: string;
};

const KEYFRAMES: Record<FloatDepth, string> = {
  soft: 'fm-float-s',
  deep: 'fm-float',
};

/** Duración de un flotado sin `order`: la de los discos sueltos. */
export const FLOAT_BASE_SECONDS = 7;

/**
 * El flotado del sitio, en un solo lugar: tarjetas, discos de frecuencia y
 * retratos respiran con la misma animación (`fm-float` / `fm-float-s` de
 * `tokens.css`). Devuelve el `style` que la aplica; sólo anima `transform`.
 *
 * El arranque es negativo: cada elemento empieza a mitad de su ciclo en vez
 * de esperar quieto, así nada «arranca» a la vista. Con
 * `prefers-reduced-motion`, `tokens.css` anula la animación.
 */
export function floatStyle({
  order = 0,
  depth = 'soft',
  duration,
  delay,
}: FloatOptions = {}): CSSProperties {
  const seconds = FLOAT_BASE_SECONDS + (order % 3) * 0.9;
  const offset = (order % 4) * 1.6;

  return {
    animation: `${KEYFRAMES[depth]} ${duration ?? `${seconds}s`} ease-in-out infinite`,
    animationDelay: delay ?? (offset === 0 ? '0s' : `-${offset}s`),
  };
}
