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
 * Estado del panel de llegada: la entrada elegida, su respuesta, la alternativa
 * en curso y la atmósfera que se muestra (la de la entrada o una «otra opción»).
 * Función pura: el efecto (fijar la atmósfera, sonar) lo hace quien llama.
 */
export type ArrivalFlow = {
  key: ArrivalKey | null;
  response: ArrivalResponse | null;
  index: number;
  atmosphere: AtmosphereId | null;
};

export const IDLE_ARRIVAL: ArrivalFlow = { key: null, response: null, index: 0, atmosphere: null };

/** Elegir una entrada: la respuesta, con su atmósfera y la primera alternativa. */
export function chooseArrival(key: ArrivalKey, context: ArrivalContext): ArrivalFlow {
  const response = respondToArrival(key, context);

  return { key, response, index: 0, atmosphere: response.atmosphere };
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
 * «Elegir otra opción»: pasa a la siguiente atmósfera de la respuesta, en
 * círculo. No toca la entrada ni la alternativa: el flujo no se reinicia.
 */
export function cycleAtmosphere(flow: ArrivalFlow): ArrivalFlow {
  if (!flow.response) return flow;

  const offered: readonly AtmosphereId[] = [
    flow.response.atmosphere,
    ...flow.response.otherAtmospheres,
  ];
  const current = flow.atmosphere ?? flow.response.atmosphere;
  const next = offered[(offered.indexOf(current) + 1) % offered.length] ?? current;

  return { ...flow, atmosphere: next };
}
