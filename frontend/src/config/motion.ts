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

/**
 * Cambio de fase de Descúbrete (intro → preguntas → sintonía → resultado):
 * la escena entera, fondo incluido, se funde a la noche y la siguiente
 * amanece despacio. Más lento que `SWAP_PACE.calm`, que sólo cambia el texto
 * entre preguntas de una misma fase.
 */
export const PHASE_FADE = { exit: 0.6, enter: 1.1 } as const;

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
 * Base del cambio de tema sin ceremonia, en segundos: dura lo mismo que el cruce
 * completo del portal (`PORTAL_TIMING.full`: cover + settle + reveal), para que
 * el cambio sin velo no se sienta más rápido que la ceremonia y ambos no puedan
 * divergir. Es la duración del fondo (`THEME_FADE_SECONDS.backdrop`).
 */
export const ATMOSPHERE_FADE_SECONDS =
  (PORTAL_TIMING.full.cover + PORTAL_TIMING.full.settle + PORTAL_TIMING.full.reveal) / 1000;

/**
 * Tiempos del cambio de tema sin ceremonia, en segundos, uno por capa. Cada capa
 * lee SU constante: el cambio no es un único fundido, sino una coreografía que
 * asienta primero lo más pequeño y deja para el final la superficie más grande.
 *
 * Línea de tiempo (de la capa que antes se asienta a la que más tarda):
 * - `ink` 1,3 s: color, borde, relleno y trazo del texto y la UI. Es la primera
 *   en llegar para que la tinta no se lea a medio camino sobre el fondo nuevo.
 * - `photo` 1,5 s: la foto del tema que sale y la que entra. Su capa saliente se
 *   retira con `THEME_PHOTO_LEAVE_GRACE_MS` de margen.
 * - `engine` 1,8 s: opacidad del lienzo cósmico, las nebulosas y las figuras. Se
 *   resuelve antes de que el fondo termine de fundir.
 * - `scrim` 2,1 s: los tokens de velo y luz (`--scrim`, `--scrim-deep`, `--halo`, `--nebula-*`),
 *   que pintan los degradados anchos (el velo del héroe y del header, las luces). Están
 *   registrados con `@property` en `tokens.css`, así que funden en vez de saltar con el tema de
 *   `<html>`; acompañan al fondo y llegan justo antes que él.
 * - `vignette` 2 s: la viñeta que oscurece el borde de la pantalla. Se pinta con tokens del
 *   tema (un degradado que no transita), así que funde en dos capas; llega un poco antes que
 *   el fondo para que éste siga siendo lo último en asentarse.
 * - `backdrop` 2,19 s: el campo de color del tema, la capa más grande y lenta.
 *   Deriva de `ATMOSPHERE_FADE_SECONDS`, igual al cruce completo del portal.
 *
 * Coherencia (guardada por `tests/lib/theme-fade.test.ts`): ninguna capa dura más
 * que `backdrop`; si la tinta corriera más, habría un tramo de tinta del tema
 * viejo sobre el fondo nuevo. Con ceremonia (velo o portal) o con movimiento
 * reducido todas valen 0: el velo, o el propio salto, es la única transición.
 */
export const THEME_FADE_SECONDS = {
  backdrop: ATMOSPHERE_FADE_SECONDS,
  vignette: 2,
  scrim: 2.1,
  engine: 1.8,
  photo: 1.5,
  ink: 1.3,
} as const;

/**
 * Fundido de entrada, en segundos, de la foto de un tema cuando termina de cargar. No es el
 * fundido del cambio de tema (`THEME_FADE_SECONDS.photo`, que lo lleva la foto saliente): es que la
 * imagen no aparece de golpe sobre el fondo en una carga directa o al entrar en una vista.
 */
export const PHOTO_LOAD_FADE_SECONDS = 0.8;

/**
 * Margen, en milisegundos, antes de retirar del DOM la capa saliente de una foto
 * ya desvanecida: cubre el último frame para que no se corte en seco.
 */
export const THEME_PHOTO_LEAVE_GRACE_MS = 100;

/**
 * Espera máxima con la pantalla cubierta. La revelación aguarda a que el
 * destino llegue; si no llega (red caída), se revela igualmente lo que haya
 * en vez de dejar al visitante a oscuras.
 */
export const PORTAL_MAX_HOLD = 5000;

/**
 * Cruce de atmósfera, en milisegundos: lo que se vive al cambiar de tema. Es la
 * única fuente: el store secuencia las fases con ellos y el overlay los pasa a sus
 * animaciones.
 *
 * - `cover`: lo que tarda la luz del tema nuevo en cubrir la pantalla, hasta que sale la
 *   frase. Es toda la apertura del portal (`PORTAL_TIMING.full`: cover + settle), derivada
 *   de ahí para que las dos aperturas no puedan divergir.
 * - `hold`: pantalla cubierta, ya con el tema aplicado debajo y con su nombre a la vista.
 *   Bajo el velo no hay fundido: con ceremonia todas las capas (`THEME_FADE_SECONDS`) valen 0,
 *   así que el salto ocurre tapado y el velo es la única transición visible.
 * - `reveal`: lo que tarda el velo en disolverse sobre el mundo nuevo.
 *
 * `quick` es el cruce de movimiento reducido: un fundido, sin ondas.
 */
export const ATMOSPHERE_SHIFT_TIMING = {
  full: { cover: PORTAL_TIMING.full.cover + PORTAL_TIMING.full.settle, hold: 1700, reveal: 1100 },
  quick: { cover: 220, hold: 700, reveal: 420 },
} as const;

/**
 * Plazo de respaldo, en milisegundos, para que el velo avise de que ya cubre la pantalla. El tema se
 * aplica cuando el velo lo dice (`AtmosphereShiftVeil`, al acabar su fundido) y no con un reloj: el
 * velo es una animación que arranca después de pintar, así que un temporizador armado al pedir el
 * cambio disparaba con el velo a medias (57–92 % de opacidad) y el cambio se veía a través. Este
 * plazo sólo cubre al velo que nunca avisa (pestaña en segundo plano, animación cancelada): pasado
 * `cover` + este margen, el tema se aplica igualmente. Misma idea que `PORTAL_MAX_HOLD`.
 */
export const ATMOSPHERE_SHIFT_COVER_GRACE_MS = 1200;

export type AtmosphereShiftMode = keyof typeof ATMOSPHERE_SHIFT_TIMING;

/**
 * Coreografía del velo de atmósfera, en fracciones de su `cover`:
 *
 * - `washFrom`: desde dónde el fondo del tema nuevo empieza a fundirse por debajo
 *   de la onda. Termina justo con ella, así que no hay un tramo de pantalla opaca
 *   antes de tiempo.
 * - `phraseFrom`: desde dónde entra la frase; termina cuando termina la cobertura,
 *   así que al entrar en `hold` ya se lee y nunca queda la pantalla llena y vacía.
 *
 * Vive aquí con el resto de la config de movimiento, no dentro del componente.
 */
export const ATMOSPHERE_SHIFT_PARTS = { washFrom: 0.55, phraseFrom: 0.7 } as const;
