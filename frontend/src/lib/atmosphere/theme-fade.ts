import { THEME_FADE_SECONDS, THEME_PHOTO_LEAVE_GRACE_MS } from '@/config/motion';

/** Capas que funden en un cambio de tema sin ceremonia. */
export type ThemeFadeLayer = keyof typeof THEME_FADE_SECONDS;

export type ThemeFadeConditions = {
  reduced: boolean;
  ceremony: boolean;
};

/**
 * Duración del fundido de una capa al cambiar de tema, en segundos.
 *
 * Con ceremonia (velo o portal) o con movimiento reducido es 0: el tema se
 * aplica tapado o de golpe y ninguna capa debe transitar por debajo. Sin
 * ceremonia cada capa lee su propia constante, nunca una compartida.
 */
export function themeFadeSeconds(
  layer: ThemeFadeLayer,
  { reduced, ceremony }: ThemeFadeConditions,
): number {
  if (reduced || ceremony) return 0;

  return THEME_FADE_SECONDS[layer];
}

/**
 * Momento en que se retira la capa saliente de una foto, en milisegundos. Su
 * fundido más un margen para que el último frame no se corte.
 */
export function photoLeaveMs(fadeSeconds: number): number {
  return fadeSeconds * 1000 + THEME_PHOTO_LEAVE_GRACE_MS;
}
