import type { RealmId } from '@/types/realm';

/**
 * Los cinco temas del sistema (DESIGN.md § Atmósferas). En la interfaz son
 * «temas»; el código conserva el nombre `atmosphere`. `night` es la v1.
 */
export type AtmosphereId = 'night' | 'dusk' | 'dawn' | 'moon' | 'forest';

/**
 * Esquema del tema: `dark` fondo oscuro con texto marfil; `light` fondo claro
 * con su derivado oscuro.
 */
export type AtmosphereScheme = 'dark' | 'light';

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
  /** Nota base del drone del tema, en hercios. */
  droneNote: number;
};
