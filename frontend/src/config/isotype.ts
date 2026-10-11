/**
 * El isotipo 3D: sus dos variantes y cómo gira.
 *
 * Los modelos y sus pósters se generan fuera de la web (`3D Prototypes/web/`,
 * ver su README) y se sirven tal cual desde `public/isotipo/`.
 */

export type IsotypeVariant = 'sm' | 'detail';

/**
 * `sm` es la variante óptica: mismos elementos, trazos engrosados para que la
 * onda y los puntos no bajen de un píxel. `detail` es la geometría fiel.
 * La óptica sirve hasta unos 120 px de lado y la de detalle desde unos 160.
 */
export const ISOTYPE_ASSETS: Record<IsotypeVariant, { model: string; poster: string }> = {
  sm: { model: '/isotipo/isotipo-sm.glb', poster: '/isotipo/isotipo-sm.svg' },
  detail: { model: '/isotipo/isotipo.glb', poster: '/isotipo/isotipo.svg' },
};

/**
 * El isotipo con el círculo del logo original (sus cuatro arcos). Sólo existe
 * como póster: el modelo 3D no lleva el círculo.
 */
export const ISOTYPE_RINGED_POSTER = '/isotipo/isotipo-circulo.svg';

/** Segundos que tarda una vuelta completa sobre el eje vertical. */
export const ISOTYPE_TURN_SECONDS = 16;

/** Lado del encuadre en unidades del modelo; el póster SVG usa el mismo `viewBox`. */
export const ISOTYPE_VIEW = 2.8;
