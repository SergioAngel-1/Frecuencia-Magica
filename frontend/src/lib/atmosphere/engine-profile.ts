import { ATMOSPHERES } from '@/config/atmospheres';
import type { VisualMode } from '@/config/realms';
import type { AtmosphereId } from '@/types/atmosphere';

/** Opacidad 0–1 de cada capa del world engine. */
export type EngineProfile = {
  canvas: number;
  nebula: number;
  figures: number;
};

/**
 * Cuánto respira el engine sobre el contenido según el modo visual del realm
 * (la v1, con la noche). Vive aquí, y no en cada componente, para que el perfil
 * de una atmósfera sea la misma tabla multiplicada por su `engine`.
 */
export const VISUAL_MODE_ENGINE: Record<VisualMode, EngineProfile> = {
  cosmic: { canvas: 1, nebula: 1, figures: 1 },
  editorial: { canvas: 0.52, nebula: 0.68, figures: 0.7 },
  quiet: { canvas: 0.34, nebula: 0.46, figures: 0.5 },
};

/**
 * Opacidades finales del engine: el nivel del modo visual por el multiplicador
 * de la atmósfera. Función pura; con la noche (multiplicadores 1) devuelve
 * exactamente `VISUAL_MODE_ENGINE`.
 */
export function engineProfile(atmosphereId: AtmosphereId, visualMode: VisualMode): EngineProfile {
  const level = VISUAL_MODE_ENGINE[visualMode];
  const multiplier = ATMOSPHERES[atmosphereId].engine;

  return {
    canvas: level.canvas * multiplier.canvas,
    nebula: level.nebula * multiplier.nebula,
    figures: level.figures * multiplier.figures,
  };
}
