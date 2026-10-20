import { describe, expect, it } from 'vitest';

import {
  INITIAL_LAYERS,
  MAX_THEME_LAYERS,
  placeInitialLayer,
  pushThemeLayer,
  settleLayers,
} from '@/lib/atmosphere/layer-stack';

const placed = placeInitialLayer(INITIAL_LAYERS, 'night');

describe('pila de capas del cambio de tema', () => {
  it('arranca con una sola capa, sin tema propio (hereda el de <html>)', () => {
    expect(INITIAL_LAYERS).toHaveLength(1);
    expect(INITIAL_LAYERS[0]).toMatchObject({ id: undefined, fade: 0 });
  });

  it('la primera atmósfera se asigna a la capa inicial, sin fundido ni capa nueva', () => {
    expect(placed).toHaveLength(1);
    expect(placed[0]).toMatchObject({ id: 'night', fade: 0 });
  });

  it('un cambio apila la capa nueva encima y deja intacta la que sostenía el tema viejo', () => {
    const next = pushThemeLayer(placed, 'dawn', 2);

    expect(next.map((layer) => layer.id)).toEqual(['night', 'dawn']);
    expect(next[0]).toBe(placed[0]);
    expect(next[1]).toMatchObject({ fade: 2 });
  });

  it('cada capa tiene su propia clave, siempre creciente', () => {
    const a = pushThemeLayer(placed, 'dawn', 2);
    const b = pushThemeLayer(a, 'dusk', 2);
    const keys = b.map((layer) => layer.key);

    expect(new Set(keys).size).toBe(keys.length);
    expect(keys).toEqual([...keys].sort((x, y) => x - y));
  });

  /**
   * Regresión: con dos ranuras fijas, un segundo cambio a mitad de fundido reasignaba la ranura
   * que aún sostenía el tema de partida. Debajo sólo quedaba el `body`, que ya pinta el tema final:
   * un salto de color justo en el momento de elegir otra emoción.
   */
  it('un segundo cambio a mitad de fundido conserva todas las capas anteriores', () => {
    const first = pushThemeLayer(placed, 'dawn', 2);
    const second = pushThemeLayer(first, 'dusk', 2);

    expect(second.map((layer) => layer.id)).toEqual(['night', 'dawn', 'dusk']);
    expect(second[0]).toBe(first[0]);
    expect(second[1]).toBe(first[1]);
  });

  it('sin fundido (ceremonia o movimiento reducido) la capa nueva sustituye a las demás', () => {
    const stacked = pushThemeLayer(placed, 'dawn', 2);
    const next = pushThemeLayer(stacked, 'dusk', 0);

    expect(next).toHaveLength(1);
    expect(next[0]).toMatchObject({ id: 'dusk', fade: 0 });
    expect(next[0]?.key).toBeGreaterThan(stacked[1]?.key ?? 0);
  });

  it('al terminar el fundido sólo queda la capa de encima, con la misma clave y sin animación', () => {
    const stacked = pushThemeLayer(pushThemeLayer(placed, 'dawn', 2), 'dusk', 2);
    const top = stacked[2];
    const settled = settleLayers(stacked);

    expect(settled).toHaveLength(1);
    expect(settled[0]).toMatchObject({ id: 'dusk', key: top?.key, fade: 0 });
  });

  it('acota la pila: una ráfaga de cambios no acumula capas sin fin', () => {
    let stack = placed;

    for (let i = 0; i < MAX_THEME_LAYERS + 5; i++) {
      stack = pushThemeLayer(stack, i % 2 === 0 ? 'dawn' : 'dusk', 2);
    }

    expect(stack.length).toBeLessThanOrEqual(MAX_THEME_LAYERS);
    expect(stack.at(-1)?.id).toBe((MAX_THEME_LAYERS + 4) % 2 === 0 ? 'dawn' : 'dusk');
  });
});
