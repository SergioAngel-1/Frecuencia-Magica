import type { Place } from '@/types/atmosphere';

/** Secciones que se nombran en el header: todo lugar salvo el portal y el acceso. */
export type SectionKey = Exclude<Place, 'portal' | 'auth'>;

export type CurrentSection = { key: SectionKey };

/**
 * Sección actual del header, a partir del lugar de la ruta. Función pura.
 *
 * El portal es el umbral y el acceso una pantalla de paso: ninguno tiene
 * sección que nombrar, y devuelven `null`.
 */
export function currentSection(place: Place): CurrentSection | null {
  if (place === 'portal' || place === 'auth') return null;

  return { key: place };
}
