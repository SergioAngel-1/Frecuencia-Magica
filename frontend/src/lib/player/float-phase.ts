/** Fases distintas entre las que se reparten las esferas. */
const PHASES = 6;
/** Segundos entre una fase y la siguiente (el vaivén de una esfera dura ~7 s). */
const STEP_SECONDS = 1.2;

/**
 * Retardo (negativo) del vaivén de una esfera, derivado de su id: las dieciséis
 * del Resonario no suben y bajan a la vez. Determinista, para que servidor y
 * cliente pinten lo mismo.
 */
export function floatPhase(id: string): string {
  let sum = 0;
  for (const char of id) sum += char.charCodeAt(0);

  return `-${((sum % PHASES) * STEP_SECONDS).toFixed(1)}s`;
}
