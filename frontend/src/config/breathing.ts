/**
 * Ritmo de la guía de respiración, en segundos por fase y número de rondas.
 * Exhalar es igual o más largo que inhalar: la salida es la parte que calma.
 */
export const BREATHING = {
  inhale: 4,
  hold: 4,
  exhale: 6,
  rounds: 4,
} as const;

/** Duración de un ciclo completo (inhalar, sostener y exhalar). */
export const BREATHING_CYCLE_SECONDS = BREATHING.inhale + BREATHING.hold + BREATHING.exhale;
