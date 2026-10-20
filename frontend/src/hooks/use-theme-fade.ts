'use client';

import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { useThemeCeremony } from '@/hooks/use-theme-ceremony';
import { themeFadeSeconds, type ThemeFadeLayer } from '@/lib/atmosphere/theme-fade';

/**
 * Duración del fundido de una capa al cambiar de tema, en segundos: la suya
 * propia sin ceremonia, 0 con ceremonia o con movimiento reducido.
 *
 * Lee las fases de los stores en el mismo render en el que cambia el tema: el
 * cambio se aplica con la ceremonia ya en `in`/`hold`, así que la capa monta su
 * nuevo valor con duración 0, no un render después.
 */
export function useThemeFade(layer: ThemeFadeLayer): number {
  const reduced = useReducedMotionSafe();
  const ceremony = useThemeCeremony();

  return themeFadeSeconds(layer, { reduced, ceremony });
}
