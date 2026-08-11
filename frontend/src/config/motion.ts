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

/** Retardos de las entradas escalonadas, en segundos. */
export const STAGGER = [0.1, 0.25, 0.4, 0.55] as const;

/** Curvas de easing como quíntuplas de bezier cúbico. */
export const EASE = {
  /** Entradas y salidas de contenido. Suave, sin rebote. */
  soft: [0.2, 0.85, 0.25, 1],
  /** Expansión del portal. Arranca lento, acelera, frena. */
  portal: [0.7, 0, 0.3, 1],
} as const;

/** Milisegundos de la coreografía de cruce del portal. */
export const PORTAL_TIMING = {
  /** Momento en que el círculo cubre la pantalla y el consumidor navega. */
  navigate: 1000,
  /** Momento en que el overlay empieza a disolverse. Debe llegar DESPUÉS de
      que la vista anterior haya salido (exit de RouteTransition:
      DURATION.fast = 0.3s): si el círculo se desvaneciera antes, la pantalla
      anterior se asomaría tras él durante su fundido de salida. */
  reveal: 1300,
  /** Momento en que el overlay vuelve a reposo (disolución de 0.9s completa). */
  settle: 2200,
} as const;
