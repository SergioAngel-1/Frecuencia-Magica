import { getRealm } from '@/config/realms';
import type { AtmosphereDefinition, AtmosphereId, Place } from '@/types/atmosphere';

/**
 * Las nueve atmósferas con su perfil: esquema, color de la barra, multiplicadores
 * del engine, nota del drone y slot del paisaje de fondo. Los valores son
 * provisionales hasta la calibración de la Fase 1 (ambientes v2).
 */
export const ATMOSPHERES: Record<AtmosphereId, AtmosphereDefinition> = {
  // La v1, sin cambios: el portal es su lugar y su nota.
  night: {
    scheme: 'dark',
    themeColor: '#0F1B2E',
    engine: { canvas: 1, nebula: 1, figures: 1 },
    droneNote: getRealm('portal').baseNote,
    backdropSlot: null,
  },
  dusk: {
    scheme: 'dark',
    themeColor: '#2B1C22',
    engine: { canvas: 0.8, nebula: 0.7, figures: 0.8 },
    droneNote: 87.3,
    backdropSlot: 'atmosphere.dusk',
  },
  dawn: {
    scheme: 'light',
    themeColor: '#DCE7EC',
    engine: { canvas: 0.05, nebula: 0.3, figures: 0.05 },
    droneNote: 146.8,
    backdropSlot: 'atmosphere.dawn',
  },
  moon: {
    scheme: 'dark',
    themeColor: '#0B1426',
    engine: { canvas: 0.9, nebula: 0.8, figures: 0.9 },
    droneNote: 98,
    backdropSlot: 'atmosphere.moon',
  },
  forest: {
    scheme: 'dark',
    themeColor: '#1E3328',
    engine: { canvas: 0.5, nebula: 0.5, figures: 0.5 },
    droneNote: 123.5,
    backdropSlot: 'atmosphere.forest',
  },
  study: {
    scheme: 'light',
    themeColor: '#EEE9DC',
    engine: { canvas: 0.05, nebula: 0.4, figures: 0 },
    droneNote: 130.8,
    backdropSlot: 'atmosphere.study',
  },
  store: {
    scheme: 'light',
    themeColor: '#EDE3D1',
    engine: { canvas: 0, nebula: 0.3, figures: 0 },
    droneNote: 116.5,
    backdropSlot: 'atmosphere.store',
  },
  gathering: {
    scheme: 'warm',
    themeColor: '#6E5140',
    engine: { canvas: 0.3, nebula: 0.4, figures: 0.3 },
    droneNote: 164.8,
    backdropSlot: 'atmosphere.gathering',
  },
  marisol: {
    scheme: 'light',
    themeColor: '#F3E8D4',
    engine: { canvas: 0.05, nebula: 0.3, figures: 0.05 },
    droneNote: 196,
    backdropSlot: 'atmosphere.marisol',
  },
};

/** Atmósfera que cada lugar tiene por defecto. */
export const PLACE_ATMOSPHERE: Record<Place, AtmosphereId> = {
  portal: 'night',
  home: 'night',
  auth: 'night',
  descubrete: 'night',
  resonario: 'night',
  sanctuario: 'night',
  academia: 'study',
  tienda: 'store',
  experiencias: 'gathering',
  story: 'marisol',
};

/**
 * Lugares donde la persona puede elegir la atmósfera a mano. Fuera de ellos
 * (academia, tienda, experiencias, Sobre Marisol) la identidad del sitio manda.
 */
export const LISTENING_PLACES: readonly Place[] = ['descubrete', 'resonario', 'sanctuario'];
