/**
 * Deriva lenta de una fotografía de atmósfera: el paisaje respira sin moverse
 * de sitio. La decisión («¿se monta?») y los parámetros salen de aquí, como
 * funciones puras, para poder testearlos sin renderizar nada.
 */

export type DriftPlan = {
  /** Desplazamiento horizontal máximo, en porcentaje de la caja. */
  shiftPercent: number;
  /** Escala máxima: la imagen siempre sobra un poco para que la deriva no deje borde. */
  scale: number;
  /** Duración de un ciclo completo (ida y vuelta), en segundos. */
  seconds: number;
};

const PLAN: DriftPlan = { shiftPercent: 1.5, scale: 1.04, seconds: 36 };

/**
 * `null` cuando la deriva no debe montarse: con movimiento reducido el paisaje
 * queda quieto. Sólo se anima `transform` y `opacity` (AGENTS.md), así que el
 * plan no admite nada más.
 */
export function driftPlan(reduced: boolean): DriftPlan | null {
  return reduced ? null : PLAN;
}
