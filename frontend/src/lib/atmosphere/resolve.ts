import { ATMOSPHERE_IDS, PLACE_ATMOSPHERE } from '@/config/atmospheres';
import type { AtmosphereId, Place } from '@/types/atmosphere';

/** Desde esta hora (inclusive) la noche se ofrece como alternativa. */
const NIGHT_FROM_HOUR = 21;
/** Hasta esta hora (exclusive): a las 5 h ya no es de noche. */
const NIGHT_UNTIL_HOUR = 5;

/** `true` si `value` es uno de los cinco ids. Valida lo que llega de almacenamiento. */
export function isAtmosphereId(value: unknown): value is AtmosphereId {
  return typeof value === 'string' && ATMOSPHERE_IDS.includes(value as AtmosphereId);
}

/**
 * Tema activo en un lugar. Función pura: la elección de la persona manda en todo
 * el sitio; sin ella, el lugar sugiere el suyo.
 */
export function resolveAtmosphere(place: Place, choice?: AtmosphereId | null): AtmosphereId {
  return choice ?? PLACE_ATMOSPHERE[place];
}

/**
 * Si la hora pide ofrecer la noche como otra opción de escucha. La hora llega
 * por parámetro para que la decisión sea testeable.
 */
export function suggestNightAlternative(hour: number): boolean {
  return hour >= NIGHT_FROM_HOUR || hour < NIGHT_UNTIL_HOUR;
}
