import {
  ARRIVALS,
  ARRIVAL_ATMOSPHERES,
  ARRIVAL_FALLBACK,
  type ArrivalExplanationKey,
  type ArrivalKey,
} from '@/config/arrivals';
import { isPlayable } from '@/data/audios';
import { suggestNightAlternative } from '@/lib/atmosphere/resolve';
import type { AtmosphereId } from '@/types/atmosphere';
import type { Audio, AudioKind } from '@/types/content';

/** Tipos que la respuesta necesita como mínimo para que la persona pueda elegir. */
const MIN_TYPES = 2;
/** Alternativas que se ofrecen a la vez (recorribles). */
const MAX_ALTERNATIVES = 3;
/** Relleno cuando la tabla no llega a dos tipos reproducibles. Nunca `frequency` primero. */
const FILL_ORDER: readonly AudioKind[] = ['nature', 'binaural', 'frequency'];

export type ArrivalContext = {
  /** Catálogo del que salen las alternativas (sólo se usan las reproducibles). */
  catalog: readonly Audio[];
  /** Hora local, 0–23. Decide si la noche se ofrece como otra opción. */
  hour: number;
};

export type ArrivalResponse = {
  /** Entrada resuelta (la neutra si la clave no se reconoce). */
  key: ArrivalKey;
  atmosphere: AtmosphereId;
  /** Alternativas reproducibles, en orden de escucha, sin repetir tipo. */
  alternatives: readonly Audio[];
  /** Otras atmósferas para «elegir otra opción», en orden; `moon` sólo de noche. */
  otherAtmospheres: readonly AtmosphereId[];
  explanationKey: ArrivalExplanationKey;
  practice?: 'breathing';
};

/**
 * Respuesta a una llegada: atmósfera, alternativas reproducibles y otras
 * opciones. Función pura: el catálogo y la hora llegan por parámetro.
 */
export function respondToArrival(
  key: ArrivalKey,
  { catalog, hour }: ArrivalContext,
): ArrivalResponse {
  const resolved: ArrivalKey = key in ARRIVALS ? key : ARRIVAL_FALLBACK;
  const entry = ARRIVALS[resolved];
  const night = suggestNightAlternative(hour);
  const picked: Audio[] = [];
  const types = new Set<AudioKind>();

  const take = (kind: AudioKind): void => {
    if (types.has(kind)) return;
    const audio = catalog.find((candidate) => candidate.kind === kind && isPlayable(candidate));
    if (!audio) return;
    picked.push(audio);
    types.add(kind);
  };

  entry.kinds.forEach(take);
  for (const kind of FILL_ORDER) {
    if (types.size >= MIN_TYPES) break;
    take(kind);
  }

  const others = ARRIVAL_ATMOSPHERES.filter((id) => id !== entry.atmosphere && id !== 'moon');
  // De noche, la luna va primero: es la otra opción que tiene sentido ahora.
  const otherAtmospheres: readonly AtmosphereId[] = night ? ['moon', ...others] : others;

  return {
    key: resolved,
    atmosphere: entry.atmosphere,
    alternatives: picked.slice(0, MAX_ALTERNATIVES),
    otherAtmospheres,
    explanationKey: entry.explanationKey,
    ...(entry.practice ? { practice: entry.practice } : {}),
  };
}
