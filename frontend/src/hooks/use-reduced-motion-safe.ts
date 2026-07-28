'use client';

import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(onChange: () => void): () => void {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {};

  const media = window.matchMedia(QUERY);
  media.addEventListener('change', onChange);

  return () => media.removeEventListener('change', onChange);
}

function getSnapshot(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;

  return window.matchMedia(QUERY).matches;
}

/** En servidor asumimos movimiento completo; el cliente corrige al hidratar. */
function getServerSnapshot(): boolean {
  return false;
}

/**
 * `true` si el usuario ha pedido movimiento reducido.
 *
 * Usa `useSyncExternalStore` en lugar de `useEffect` + `useState` para evitar
 * el parpadeo de hidratación: con el patrón de efecto, la primera pintura
 * anima y sólo después se congela, que es exactamente lo que el ajuste
 * pretende evitar.
 */
export function useReducedMotionSafe(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
