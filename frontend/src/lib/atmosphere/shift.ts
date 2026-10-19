import { ARRIVALS, type ArrivalKey } from '@/config/arrivals';
import type { AtmosphereId } from '@/types/atmosphere';

/**
 * Quién pide el cambio de atmósfera: `manual`, la persona elige un tema (o «según cómo te
 * sientes») en el selector; `feeling`, un estado del ánimo lo propone (el portal, la Home,
 * Descúbrete, Mi Santuario). Fuera del portal, una emoción también pide confirmación: cambiar
 * de emoción cambia el tema. En el portal, que ya es el umbral, se aplica sin ceremonia.
 */
export type ShiftSource = 'manual' | 'feeling';

export type ShiftRequest = {
  /** Lo que se guarda: un tema, o `null` («según cómo te sientes»: cada lugar propone el suyo). */
  choice: AtmosphereId | null;
  /** El tema que se verá al terminar (con `choice: null`, el que sugiere el lugar). */
  resolved: AtmosphereId;
  source: ShiftSource;
  /** El estado del ánimo que lo origina, si lo hay: se nombra en el cruce. */
  feeling: ArrivalKey | null;
  /**
   * Lo que debe ocurrir sólo cuando el tema se aplica de verdad: guardar la llegada, mostrar su
   * respuesta, empezar a sonar. Si la persona rechaza la confirmación no se llama.
   */
  onApplied?: () => void;
};

/**
 * Qué hacer con una petición:
 * - `apply`: aplicarla ya, sin ceremonia (el tema no cambia, o hay otro cruce en marcha, o
 *   se está en el portal, que ya es el umbral).
 * - `confirm`: pedir confirmación y, si se acepta, cruzar.
 * - `cross`: cruzar directamente. `planShift` ya no lo produce (ni el cambio manual ni el de
 *   emoción fuera del portal pueden saltarse la ceremonia); el cruce directo sigue disponible
 *   en el store para quien ya lo usaba.
 */
export type ShiftPlan = 'apply' | 'confirm' | 'cross';

export type ShiftContext = {
  /** Tema visible ahora. */
  current: AtmosphereId;
  /** Otro cruce (portal o atmósfera) ocupa la pantalla. */
  busy: boolean;
  /** La vista actual es el portal: su propio cruce es la ceremonia. */
  atPortal: boolean;
};

/**
 * Fuera del portal, cualquier cambio de tema se confirma, venga del selector (`manual`) o de
 * una emoción (`feeling`): una emoción fuera del portal ya no cruza directo. En el portal la
 * elección de emoción se aplica sin ceremonia, porque su propio cruce es el umbral.
 */
export function planShift(request: ShiftRequest, context: ShiftContext): ShiftPlan {
  if (request.resolved === context.current) return 'apply';
  if (context.busy || context.atPortal) return 'apply';

  return 'confirm';
}

/**
 * La emoción que la elección guarda, mientras el tema elegido siga siendo el que esa emoción
 * propone. Sin elección (automático) no hay emoción que nombrar, y si la persona eligió una
 * tarjeta de tema el `feeling` ya llega nulo.
 */
export function activeFeeling(
  choice: AtmosphereId | null,
  feeling: ArrivalKey | null,
): ArrivalKey | null {
  if (choice === null || feeling === null) return null;

  return ARRIVALS[feeling].atmosphere === choice ? feeling : null;
}

/** Centro de un rectángulo como fracción del viewport (0–1): de ahí nace la onda del cruce. */
export function originFromRect(
  rect: { left: number; top: number; width: number; height: number },
  viewport: { width: number; height: number },
): { x: number; y: number } {
  const clamp = (value: number) => Math.min(1, Math.max(0, value));

  return {
    x: clamp((rect.left + rect.width / 2) / viewport.width),
    y: clamp((rect.top + rect.height / 2) / viewport.height),
  };
}
