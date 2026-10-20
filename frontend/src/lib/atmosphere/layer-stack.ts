import type { AtmosphereId } from '@/types/atmosphere';

/**
 * Una capa de una pieza que se pinta con los tokens del tema (el fondo, la viñeta). `id` es la
 * atmósfera que pinta: su `data-atmosphere` cascadea los tokens (`--atmo-bg`, `--scrim-deep`…) sólo
 * a esa capa, así que lo que se pinta con ellos funde en vez de saltar con el tema de `<html>`. Sin
 * `id` hereda la de `<html>`, que ya fija el script de arranque. `key` no se repite nunca: una capa
 * nueva se monta de nuevo y nace transparente. `fade` es la duración de su fundido de entrada (0 si
 * no lo hay).
 */
export type ThemeLayer = { id: AtmosphereId | undefined; key: number; fade: number };

/** De abajo arriba: la última es la que se ve encima. */
export type LayerStack = readonly ThemeLayer[];

export const INITIAL_LAYERS: LayerStack = [{ id: undefined, key: 0, fade: 0 }];

/**
 * Tope de capas simultáneas. Cada cambio a mitad de fundido añade una: hacen falta tantos cambios
 * seguidos como temas haya en menos de lo que dura un fundido para llegar aquí.
 */
export const MAX_THEME_LAYERS = 8;

/** Primera atmósfera: la capa inicial toma su tema, sin fundido. */
export function placeInitialLayer(stack: LayerStack, id: AtmosphereId): LayerStack {
  const top = stack.at(-1);

  return top ? [{ ...top, id }] : stack;
}

/**
 * Cambio de tema: la capa nueva sube de 0 a 1 por encima de TODAS las que había. Las de abajo no se
 * tocan: si el cambio llega a mitad de otro fundido, cada capa sigue en el punto en que estaba y lo
 * que se ve no da ningún salto. (Con dos ranuras fijas, el segundo cambio reasignaba la que aún
 * sostenía el tema de partida y debajo sólo quedaba el `body`, que ya pinta el tema final.)
 *
 * Sin fundido (`fade` 0: con ceremonia o con movimiento reducido) el cambio es inmediato y la capa
 * nueva sustituye a las demás: el velo ya cubre la pantalla.
 */
export function pushThemeLayer(stack: LayerStack, id: AtmosphereId, fade: number): LayerStack {
  const key = (stack.at(-1)?.key ?? 0) + 1;
  const layer: ThemeLayer = { id, key, fade };

  if (fade === 0) return [layer];

  return [...stack, layer].slice(-MAX_THEME_LAYERS);
}

/**
 * Fin del fundido: la capa de encima ya es opaca y las de abajo sobran. Conserva su clave (no se
 * vuelve a montar) y pierde la animación, que ya terminó.
 */
export function settleLayers(stack: LayerStack): LayerStack {
  const top = stack.at(-1);

  return top ? [{ ...top, fade: 0 }] : stack;
}
