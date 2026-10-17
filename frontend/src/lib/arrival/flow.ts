import type { ArrivalKey } from '@/config/arrivals';
import { respondToArrival, type ArrivalContext, type ArrivalResponse } from '@/lib/arrival/respond';
import type { EngineState } from '@/lib/audio/engine/engine';
import type { AtmosphereId } from '@/types/atmosphere';
import type { Audio } from '@/types/content';

/**
 * Subida de la primera pista de una llegada, en segundos. Entra en fundido
 * desde el silencio, sin tocar el volumen guardado del reproductor.
 */
export const ARRIVAL_FADE_IN_SECONDS = 2.5;

/**
 * Fundido para abrir una pista de llegada: sólo si no suena nada (sin pista o
 * parada). Si ya suena otra, el cambio no funde. `undefined` = sin fundido.
 */
export function arrivalFadeIn(player: {
  audioId: string | null;
  engineState: EngineState;
}): number | undefined {
  return player.audioId === null || player.engineState !== 'playing'
    ? ARRIVAL_FADE_IN_SECONDS
    : undefined;
}

/**
 * Estado del panel de llegada: la entrada elegida, su respuesta y la alternativa
 * en curso. La atmósfera no vive aquí: la decide el store (`manual`) y la lee el
 * hook, así el bloque, el panel y Descúbrete ven la misma. Función pura: el
 * efecto (fijar la atmósfera, sonar) lo hace quien llama.
 */
export type ArrivalFlow = {
  key: ArrivalKey | null;
  response: ArrivalResponse | null;
  index: number;
};

export const IDLE_ARRIVAL: ArrivalFlow = { key: null, response: null, index: 0 };

/** Elegir una entrada: la respuesta y su primera alternativa. */
export function chooseArrival(key: ArrivalKey, context: ArrivalContext): ArrivalFlow {
  return { key, response: respondToArrival(key, context), index: 0 };
}

/** La alternativa en curso, o `null` sin entrada o sin alternativas. */
export function currentAlternative(flow: ArrivalFlow): Audio | null {
  return flow.response?.alternatives[flow.index] ?? null;
}

/** Siguiente (`1`) o anterior (`-1`) alternativa. Envuelve en los dos extremos. */
export function stepAlternative(flow: ArrivalFlow, delta: 1 | -1): ArrivalFlow {
  const count = flow.response?.alternatives.length ?? 0;
  if (count === 0) return flow;

  const index = (((flow.index + delta) % count) + count) % count;

  return { ...flow, index };
}

/**
 * «Elegir otra opción»: la siguiente atmósfera de la respuesta, en círculo,
 * desde la que está activa ahora. Si la activa no está en la lista (la noche
 * de antes de elegir), empieza por la de la entrada. No reinicia el flujo.
 */
export function nextAtmosphere(response: ArrivalResponse, current: AtmosphereId): AtmosphereId {
  const offered: readonly AtmosphereId[] = [response.atmosphere, ...response.otherAtmospheres];

  return offered[(offered.indexOf(current) + 1) % offered.length] ?? response.atmosphere;
}
