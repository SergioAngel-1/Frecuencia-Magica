import { LISTENING_ATMOSPHERE, LISTENING_PLACES } from '@/config/listening-atmosphere';
import type { AtmosphereId, Place } from '@/types/atmosphere';
import type { AudioKind } from '@/types/content';

/**
 * Tema que propone la escucha, o `null` si no manda: en silencio, sin tipo de
 * pista o fuera de los lugares configurados. Función pura, sin React: la
 * decisión final (elección > escucha > lugar) vive en `resolveAtmosphere`.
 */
export function listeningAtmosphere(
  place: Place,
  kind: AudioKind | null,
  sounding: boolean,
): AtmosphereId | null {
  if (!sounding || kind === null || !LISTENING_PLACES.includes(place)) return null;

  return LISTENING_ATMOSPHERE[kind];
}
