import type { EditorialMediaSlot } from '@/config/editorial-media';
import type { RealmId } from '@/types/realm';

/** Las nueve atmósferas del sistema (DESIGN.md § Atmósferas). `night` es la v1. */
export type AtmosphereId =
  'night' | 'dusk' | 'dawn' | 'moon' | 'forest' | 'study' | 'store' | 'gathering' | 'marisol';

/**
 * Esquema de la atmósfera: `dark` fondo oscuro con texto marfil; `light` fondo
 * claro con su derivado oscuro; `warm` cálido de luz media.
 */
export type AtmosphereScheme = 'dark' | 'light' | 'warm';

/** Lugar de la navegación: un realm, o la vista «Sobre Marisol» (`story`). */
export type Place = RealmId | 'story';

/** Multiplicadores 0–1 de las capas del world engine bajo una atmósfera. */
export type AtmosphereEngine = {
  canvas: number;
  nebula: number;
  figures: number;
};

export type AtmosphereDefinition = {
  scheme: AtmosphereScheme;
  /** Color de la barra del navegador (`theme-color`). */
  themeColor: string;
  engine: AtmosphereEngine;
  /** Nota base del drone de la atmósfera, en hercios. */
  droneNote: number;
  /** Slot editorial del paisaje de fondo; `null` si la atmósfera no tiene uno. */
  backdropSlot: EditorialMediaSlot | null;
};
