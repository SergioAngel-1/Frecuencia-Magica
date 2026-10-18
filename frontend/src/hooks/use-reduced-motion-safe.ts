'use client';

import { useMediaQuery } from './use-media-query';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/**
 * `true` si el usuario ha pedido movimiento reducido.
 *
 * Usa `useSyncExternalStore` (vía `useMediaQuery`) en lugar de `useEffect` +
 * `useState` para evitar el parpadeo de hidratación: con el patrón de efecto,
 * la primera pintura anima y sólo después se congela, que es exactamente lo
 * que el ajuste pretende evitar.
 */
export function useReducedMotionSafe(): boolean {
  return useMediaQuery(REDUCED_MOTION_QUERY);
}
