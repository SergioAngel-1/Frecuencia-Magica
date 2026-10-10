/**
 * Constantes de movimiento del sistema.
 *
 * Los valores derivan de los keyframes del prototipo (`fm*`). Cualquier
 * animación del proyecto debe tomar su duración y su easing de aquí en lugar
 * de escribir números sueltos.
 */

/** Duraciones en segundos. */
export const DURATION = {
  instant: 0,
  fast: 0.3,
  base: 0.7,
  slow: 1,
  entrance: 0.8,
  portal: 1,
  /** Apertura tipo "pergamino" de los bloques colapsables (brief 12.3). */
  scroll: 0.4,
  /** Aparición/desaparición del campo nombre al alternar login/registro (brief 13.1). */
  reveal: 0.35,
} as const;

/**
 * Cuánto espera `RouteTransition` antes de mostrar la escena de carga entre
 * vistas. Una vista precargada llega antes y no hace falta tapar nada: una
 * imagen a pantalla completa en cada clic se leería como un parpadeo.
 */
export const ROUTE_WAIT_DELAY_MS = 250;

/**
 * Ritmos de `Swap`, en segundos: lo que tarda en irse el contenido anterior
 * (`exit`) y en llegar el nuevo (`enter`). `default` es el intercambio ágil
 * de formularios y filtros; `calm`, el de un recorrido que se lee paso a paso
 * (las preguntas de Descúbrete), donde un corte rápido se siente brusco.
 */
export const SWAP_PACE = {
  default: { enter: DURATION.reveal, exit: DURATION.fast * 0.6 },
  calm: { enter: DURATION.base, exit: DURATION.reveal },
} as const;

export type SwapPace = keyof typeof SWAP_PACE;

/** Retardos de las entradas escalonadas, en segundos. */
export const STAGGER = [0.1, 0.25, 0.4, 0.55] as const;

/** Curvas de easing como quíntuplas de bezier cúbico. */
export const EASE = {
  /** Entradas y salidas de contenido. Suave, sin rebote. */
  soft: [0.2, 0.85, 0.25, 1],
  /** Apertura del iris del portal. Arranca lento, acelera, frena. */
  portal: [0.7, 0, 0.3, 1],
  /** Onda que se adelanta al iris: sale deprisa y se posa. */
  ripple: [0.16, 1, 0.3, 1],
} as const;

/** Curva de bezier como valor CSS, para los keyframes que no pasan por Motion. */
export function cssEase(curve: readonly [number, number, number, number]): string {
  return `cubic-bezier(${curve.join(', ')})`;
}

/**
 * Tiempos del cruce del portal, en milisegundos. Son la única fuente: el
 * store secuencia las fases con ellos y el overlay los pasa a sus animaciones.
 *
 * - `cover`: lo que tarda la noche en cubrir la pantalla. Al terminar, el
 *   consumidor navega.
 * - `settle`: respiro entre la llegada del destino y el inicio de la
 *   revelación, para que la vista nueva ya esté pintada debajo.
 * - `reveal`: lo que tarda la noche en disolverse sobre el destino.
 *
 * El iris se abre siempre hasta cubrir la pantalla: `full` es su coreografía
 * completa (primera vez o tras el reposo de 24 h) y `brief`, la misma
 * apertura más ágil para los cruces recientes. `quick` es el fundido sin
 * iris, reservado al movimiento reducido.
 */
export const PORTAL_TIMING = {
  full: { cover: 1150, settle: 140, reveal: 900 },
  brief: { cover: 760, settle: 100, reveal: 640 },
  quick: { cover: 260, settle: 60, reveal: 480 },
} as const;

export type PortalMode = keyof typeof PORTAL_TIMING;

/**
 * Espera máxima con la pantalla cubierta. La revelación aguarda a que el
 * destino llegue; si no llega (red caída), se revela igualmente lo que haya
 * en vez de dejar al visitante a oscuras.
 */
export const PORTAL_MAX_HOLD = 5000;
