import { LISTENING_PLACES, PICKER_ATMOSPHERES } from '@/config/atmospheres';
import type { AtmosphereId, Place } from '@/types/atmosphere';

/** Atmósferas que el selector manual ofrece, en el orden de config. */
export function eligibleAtmospheres(): readonly AtmosphereId[] {
  return PICKER_ATMOSPHERES;
}

/** `true` sólo en los lugares de escucha: fuera de ellos la identidad del sitio manda. */
export function showsPicker(place: Place): boolean {
  return LISTENING_PLACES.includes(place);
}
