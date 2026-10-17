/**
 * Bandas de realm: los gradientes que sustituyen a las imágenes.
 *
 * Todas son diagonales a 150° de un tono desaturado hacia el vacío. Nunca
 * usar fotos ni cajas grises: el placeholder ya es arte final.
 */
import type { PhotoTreatment } from './realms';

export const BANDS = {
  gold: 'linear-gradient(150deg, rgb(var(--halo) / 0.42), rgb(var(--scrim) / 0.5) 70%)',
  teal: 'linear-gradient(150deg, color-mix(in srgb, var(--color-accent-2) 40%, transparent), rgb(var(--scrim) / 0.5) 70%)',
  lav: 'linear-gradient(150deg, color-mix(in srgb, var(--color-accent-3) 42%, transparent), rgb(var(--scrim) / 0.5) 70%)',
  mix: 'linear-gradient(150deg, color-mix(in srgb, var(--color-accent-2) 34%, transparent), color-mix(in srgb, var(--color-accent-3) 30%, transparent) 60%, rgb(var(--scrim) / 0.5))',
} as const;

export type BandKey = keyof typeof BANDS;

/**
 * Closed-palette treatment map used by editorial media and its zebra fallback.
 * The fallback is always a deliberate band, never a gray box or remote image.
 * `natural` no tiene banda: la fotografía conserva sus colores, sin tinte de acento.
 */
export const PHOTO_TREATMENT_BANDS: Record<PhotoTreatment, BandKey | null> = {
  none: 'mix',
  warm: 'gold',
  teal: 'teal',
  lav: 'lav',
  soft: 'mix',
  natural: null,
};

/** Banda del tratamiento, o `null` si el tratamiento no tiñe (`natural`). */
export function bandForPhotoTreatment(treatment: PhotoTreatment): string | null {
  const key = PHOTO_TREATMENT_BANDS[treatment];

  return key ? BANDS[key] : null;
}

/**
 * Si la fotografía del realm lleva el velo tintado de acento (`tint` de
 * `FullBleedSection`). El tratamiento `natural` no tiñe: la foto conserva su luz.
 */
export function tintForPhotoTreatment(treatment: PhotoTreatment): boolean {
  return bandForPhotoTreatment(treatment) !== null;
}
