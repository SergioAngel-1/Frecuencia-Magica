import {
  ARRIVALS,
  ARRIVAL_ATMOSPHERES,
  ARRIVAL_FALLBACK,
  ATMOSPHERE_SOUNDS,
  MOOD_INTENT,
  type ArrivalExplanationKey,
  type ArrivalKey,
} from '@/config/arrivals';
import { isPlayable } from '@/data/audios';
import { suggestNightAlternative } from '@/lib/atmosphere/resolve';
import type { AtmosphereId } from '@/types/atmosphere';
import type { Audio, AudioKind, Intent } from '@/types/content';
import type { MoodId } from '@/types/mood';

/** Tipos que la respuesta necesita como mínimo para que la persona pueda elegir. */
const MIN_TYPES = 2;
/** Alternativas que se ofrecen a la vez (recorribles). */
const MAX_ALTERNATIVES = 3;
/** Relleno cuando la tabla no llega a dos tipos reproducibles. */
const FILL_ORDER: readonly AudioKind[] = ['nature', 'binaural', 'frequency'];

export type ArrivalContext = {
  /** Catálogo del que salen las alternativas (sólo se usan las reproducibles). */
  catalog: readonly Audio[];
  /** Hora local, 0–23. Decide qué temas se ofrecen primero como otra opción. */
  hour: number;
  /**
   * Pista que Descúbrete recomienda en su disco. Si casa con la intención de la
   * entrada, es la primera alternativa: el panel y el disco suenan lo mismo.
   */
  featuredId?: string;
};

export type ArrivalResponse = {
  /** Entrada resuelta (la neutra si la clave no se reconoce). */
  key: ArrivalKey;
  atmosphere: AtmosphereId;
  /** Alternativas reproducibles, en orden de escucha, sin repetir tipo. */
  alternatives: readonly Audio[];
  /** Los otros cuatro temas para «elegir otra opción», en orden: los de la hora primero. */
  otherAtmospheres: readonly AtmosphereId[];
  explanationKey: ArrivalExplanationKey;
  practice?: 'breathing';
};

/** La intención que busca una entrada: la de Descúbrete, o la del estado del diario. */
function intentOf(key: ArrivalKey): Intent {
  const [kind, id] = key.split(':') as [string, string];

  return kind === 'intent' ? (id as Intent) : MOOD_INTENT[id as MoodId];
}

/** La mejor pista reproducible de un tipo: la que casa con la intención, luego con la atmósfera. */
function bestOfKind(
  catalog: readonly Audio[],
  kind: AudioKind,
  intent: Intent,
  atmosphere: AtmosphereId,
): Audio | undefined {
  const preferred = ATMOSPHERE_SOUNDS[atmosphere] ?? [];
  let best: Audio | undefined;
  let bestScore = -1;

  for (const audio of catalog) {
    if (audio.kind !== kind || !isPlayable(audio)) continue;
    const score = (audio.intents.includes(intent) ? 2 : 0) + (preferred.includes(audio.id) ? 1 : 0);
    // Estrictamente mayor: a igualdad gana la primera del catálogo.
    if (score > bestScore) {
      best = audio;
      bestScore = score;
    }
  }

  return best;
}

/**
 * Respuesta a una llegada: atmósfera, alternativas reproducibles y otras
 * opciones. Función pura: el catálogo, la hora y la pista del disco llegan por
 * parámetro.
 *
 * Orden de las alternativas: la pista del disco (si casa), luego los tipos de la
 * tabla sin frecuencia, y la frecuencia al final. El relleno (naturaleza,
 * binaural, frecuencia) sólo entra si no llegan a dos tipos.
 */
export function respondToArrival(
  key: ArrivalKey,
  { catalog, hour, featuredId }: ArrivalContext,
): ArrivalResponse {
  const resolved: ArrivalKey = key in ARRIVALS ? key : ARRIVAL_FALLBACK;
  const entry = ARRIVALS[resolved];
  const intent = intentOf(resolved);
  const night = suggestNightAlternative(hour);
  const picked: Audio[] = [];
  const types = new Set<AudioKind>();

  const add = (audio: Audio): void => {
    picked.push(audio);
    types.add(audio.kind);
  };
  const take = (kind: AudioKind): void => {
    if (types.has(kind)) return;
    const audio = bestOfKind(catalog, kind, intent, entry.atmosphere);
    if (audio) add(audio);
  };

  const featured = featuredId ? catalog.find((audio) => audio.id === featuredId) : undefined;
  if (featured && isPlayable(featured) && featured.intents.includes(intent)) add(featured);

  const tableKinds = entry.kinds.filter((kind) => kind !== 'frequency');
  tableKinds.forEach(take);
  if (entry.kinds.includes('frequency')) take('frequency');
  for (const kind of FILL_ORDER) {
    if (types.size >= MIN_TYPES) break;
    take(kind);
  }

  // La frecuencia va al final por construcción: primero la destacada, luego lo demás.
  const rest = picked.filter((audio) => audio !== featured);
  const ordered = [
    ...(featured && picked.includes(featured) ? [featured] : []),
    ...rest.filter((audio) => audio.kind !== 'frequency'),
    ...rest.filter((audio) => audio.kind === 'frequency'),
  ];

  // Los cinco temas son estados posibles: «otra opción» recorre los otros cuatro, con los de la
  // hora primero (de noche, la luna).
  const otherAtmospheres: readonly AtmosphereId[] = ARRIVAL_ATMOSPHERES[
    night ? 'night' : 'day'
  ].filter((id) => id !== entry.atmosphere);

  return {
    key: resolved,
    atmosphere: entry.atmosphere,
    alternatives: ordered.slice(0, MAX_ALTERNATIVES),
    otherAtmospheres,
    explanationKey: entry.explanationKey,
    ...(entry.practice ? { practice: entry.practice } : {}),
  };
}
