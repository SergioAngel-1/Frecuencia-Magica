import { BREATHING } from '@/config/breathing';

export type BreathPhase = 'inhale' | 'hold' | 'exhale';

/** El orden de una ronda. Cada fase dura lo que fija `BREATHING`. */
const ROUND: readonly { phase: BreathPhase; seconds: number }[] = [
  { phase: 'inhale', seconds: BREATHING.inhale },
  { phase: 'hold', seconds: BREATHING.hold },
  { phase: 'exhale', seconds: BREATHING.exhale },
];

export type BreathState = {
  /** Ronda en curso, desde 0. Cuando llega a `rounds` la guía ha terminado. */
  round: number;
  /** Índice de la fase dentro de la ronda. */
  step: number;
};

export function initialBreath(): BreathState {
  return { round: 0, step: 0 };
}

/**
 * Avanza una fase. Pura: el temporizador vive en el componente. Tras la última
 * fase de la última ronda el estado queda terminado y no vuelve a empezar solo.
 */
export function advanceBreath(state: BreathState, rounds: number): BreathState {
  if (state.round >= rounds) return state;

  if (state.step + 1 < ROUND.length) return { round: state.round, step: state.step + 1 };

  return { round: state.round + 1, step: 0 };
}

/** Tamaño del orbe al inhalar y sostener, relativo a su tamaño de reposo. */
export const BREATH_ORB_SCALE = 1.25;

/**
 * Escala del orbe para una fase: grande al inhalar y al sostener, en reposo al
 * exhalar. Sin fase (la guía ha terminado) queda en reposo.
 */
export function orbScale(phase: BreathPhase | null): number {
  return phase === null || phase === 'exhale' ? 1 : BREATH_ORB_SCALE;
}

/** La fase en curso y su duración, o `null` cuando la guía ha terminado. */
export function currentBreathPhase(
  state: BreathState,
  rounds: number = BREATHING.rounds,
): { phase: BreathPhase; seconds: number } | null {
  if (state.round >= rounds) return null;

  return ROUND[state.step] ?? null;
}
