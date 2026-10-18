import { getRealm } from '@/config/realms';
import type { AtmosphereDefinition, AtmosphereId, Place } from '@/types/atmosphere';

/**
 * Los cinco temas con su perfil: esquema, color de la barra, multiplicadores del
 * engine y nota del drone. Los colores de cada tema viven en `tokens.css`; la
 * escena de partículas, en `lib/cosmic/themes.ts`.
 *
 * Los multiplicadores del engine son casi 1 en todos: cada tema pinta su propia
 * escena, así que el motor no se apaga en los claros, se adapta.
 */
export const ATMOSPHERES: Record<AtmosphereId, AtmosphereDefinition> = {
  // La v1, sin cambios: el portal es su lugar y su nota.
  night: {
    scheme: 'dark',
    themeColor: '#0F1B2E',
    engine: { canvas: 1, nebula: 1, figures: 1 },
    droneNote: getRealm('portal').baseNote,
  },
  dusk: {
    scheme: 'dark',
    themeColor: '#2B1C22',
    engine: { canvas: 1, nebula: 1, figures: 0.9 },
    droneNote: 87.3,
  },
  dawn: {
    scheme: 'light',
    themeColor: '#DCE7EC',
    engine: { canvas: 1, nebula: 1, figures: 0.7 },
    droneNote: 146.8,
  },
  moon: {
    scheme: 'dark',
    themeColor: '#0B1426',
    engine: { canvas: 1, nebula: 1, figures: 1 },
    droneNote: 98,
  },
  forest: {
    scheme: 'dark',
    themeColor: '#1E3328',
    engine: { canvas: 1, nebula: 1, figures: 0.8 },
    droneNote: 123.5,
  },
};

/**
 * Tema que cada lugar sugiere mientras la persona no elige uno («Automático»).
 * Una elección manual manda en todos los lugares.
 */
export const PLACE_ATMOSPHERE: Record<Place, AtmosphereId> = {
  portal: 'night',
  home: 'night',
  auth: 'night',
  descubrete: 'night',
  resonario: 'night',
  sanctuario: 'night',
  academia: 'dawn',
  tienda: 'dawn',
  experiencias: 'dusk',
  story: 'dawn',
};

/** Los cinco ids, en el orden del selector. */
export const ATMOSPHERE_IDS = Object.keys(ATMOSPHERES) as AtmosphereId[];

/** Clave de `localStorage` de la elección de tema (dura entre visitas). */
export const ATMOSPHERE_STORAGE_KEY = 'fm.atmosphere';

/**
 * Versión del formato guardado (`persist({ version })`). El script de arranque la
 * replica: si no coincide, zustand descarta el estado y el script también debe
 * ignorarlo, o aparece un destello al hidratar. La 1 estrena `localStorage` y
 * la elección global (antes, `sessionStorage` y sólo en lugares de escucha).
 */
export const ATMOSPHERE_STORE_VERSION = 1;
