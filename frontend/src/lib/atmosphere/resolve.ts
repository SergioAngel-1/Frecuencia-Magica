import { LISTENING_PLACES, PLACE_ATMOSPHERE } from '@/config/atmospheres';
import type { AtmosphereId, Place } from '@/types/atmosphere';

/** Desde esta hora (inclusive) la noche se ofrece como alternativa. */
const NIGHT_FROM_HOUR = 21;
/** Hasta esta hora (exclusive): a las 5 h ya no es de noche. */
const NIGHT_UNTIL_HOUR = 5;

/**
 * Atmósfera activa de un lugar. Función pura: la elección manual sólo gana en
 * los lugares de escucha; en el resto la identidad del sitio manda.
 */
export function resolveAtmosphere(place: Place, manual?: AtmosphereId | null): AtmosphereId {
  if (manual && LISTENING_PLACES.includes(place)) return manual;

  return PLACE_ATMOSPHERE[place];
}

/**
 * Si la hora pide ofrecer la noche como otra opción de escucha. La hora llega
 * por parámetro para que la decisión sea testeable.
 */
export function suggestNightAlternative(hour: number): boolean {
  return hour >= NIGHT_FROM_HOUR || hour < NIGHT_UNTIL_HOUR;
}
