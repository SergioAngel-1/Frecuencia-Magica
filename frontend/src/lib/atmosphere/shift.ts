import { ARRIVALS, type ArrivalKey } from '@/config/arrivals';
import type { AtmosphereId } from '@/types/atmosphere';

/**
 * Quién pide el cambio de atmósfera: `manual`, la persona elige un tema (o «según cómo te
 * sientes») en el selector; `feeling`, un estado del ánimo lo propone (el portal, la Home,
 * Descúbrete, Mi Santuario). Un cambio manual se confirma antes de ocurrir; uno por sentimiento
 * ya fue una elección explícita (la emoción), así que va directo al cruce.
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
};

/**
 * Qué hacer con una petición:
 * - `apply`: aplicarla ya, sin ceremonia (el tema no cambia, o hay otro cruce en marcha, o
 *   se está en el portal, que ya es el umbral).
 * - `confirm`: pedir confirmación y, si se acepta, cruzar.
 * - `cross`: cruzar directamente.
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

export function planShift(request: ShiftRequest, context: ShiftContext): ShiftPlan {
  if (request.resolved === context.current) return 'apply';
  if (context.busy || context.atPortal) return 'apply';

  return request.source === 'manual' ? 'confirm' : 'cross';
}

/**
 * El estado del ánimo que la atmósfera activa expresa: la última llegada guardada, mientras
 * el tema visible siga siendo el que ese estado propone. Si la persona eligió otro tema a
 * mano, ya no «se siente» así y no hay estado que nombrar.
 */
export function activeFeeling(
  current: AtmosphereId,
  arrival: ArrivalKey | null,
): ArrivalKey | null {
  if (arrival === null) return null;

  return ARRIVALS[arrival].atmosphere === current ? arrival : null;
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
