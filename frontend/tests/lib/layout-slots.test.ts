import { describe, expect, it } from 'vitest';

import { discSlot, filterAudios, orbitalLayout } from '@/lib/resonario/layout-slots';
import { AUDIOS } from '@/data';

describe('discSlot', () => {
  it('tiene seis posiciones orbitales', () => {
    const a = discSlot(0);
    const b = discSlot(6);
    expect(a).toEqual(b);
  });

  it('las posiciones coinciden con el prototipo', () => {
    expect(discSlot(0)).toMatchObject({ top: '3%', left: '9%' });
    expect(discSlot(1)).toMatchObject({ top: '3%', left: '73%' });
    expect(discSlot(2)).toMatchObject({ top: '40%', left: '-2%' });
    expect(discSlot(3)).toMatchObject({ top: '40%', left: '83%' });
    expect(discSlot(4)).toMatchObject({ top: '75%', left: '13%' });
    expect(discSlot(5)).toMatchObject({ top: '75%', left: '69%' });
  });

  it('los tamaños coinciden con el prototipo', () => {
    const sizes = [0, 1, 2, 3, 4, 5].map((i) => discSlot(i).size);
    expect(sizes).toEqual(['150px', '138px', '128px', '150px', '140px', '130px']);
  });

  it('las duraciones y retardos desincronizan los discos', () => {
    const durations = [0, 1, 2, 3, 4, 5].map((i) => discSlot(i).duration);
    const delays = [0, 1, 2, 3, 4, 5].map((i) => discSlot(i).delay);
    expect(durations).toEqual(['7s', '8.5s', '6.5s', '9s', '7.5s', '8s']);
    expect(delays).toEqual(['0s', '.6s', '1.1s', '.3s', '.9s', '1.4s']);
  });
});

describe('filterAudios', () => {
  it('el filtro "todo" devuelve el catálogo completo', () => {
    expect(filterAudios(AUDIOS, 'all')).toHaveLength(7);
  });

  it('el filtro por etiqueta devuelve solo esa etiqueta', () => {
    const meditation = filterAudios(AUDIOS, 'meditation');
    expect(meditation).toHaveLength(2);
    expect(meditation.every((a) => a.tagId === 'meditation')).toBe(true);
  });

  it('un filtro sin resultados devuelve lista vacía', () => {
    expect(filterAudios(AUDIOS, 'inexistente')).toHaveLength(0);
  });

  it('null devuelve el catálogo completo', () => {
    expect(filterAudios(AUDIOS, null)).toHaveLength(7);
  });
});

describe('orbitalLayout', () => {
  const ids = (layout: ReturnType<typeof orbitalLayout>) =>
    layout.orbit.map(({ audio, slot }) => `${audio.id}@${slot}`);

  it('sin audio activo, el destacado es el centro y cada secundario su posición', () => {
    const layout = orbitalLayout(AUDIOS, null);

    expect(layout.center?.id).toBe('a1');
    expect(layout.centerIsFeatured).toBe(true);
    expect(ids(layout)).toEqual(['a2@0', 'a3@1', 'a4@2', 'a5@3', 'a6@4', 'a7@5']);
  });

  it('el activo toma el centro y el destacado ocupa la posición que deja libre', () => {
    const layout = orbitalLayout(AUDIOS, 'a4');

    expect(layout.center?.id).toBe('a4');
    expect(layout.centerIsFeatured).toBe(false);
    expect(ids(layout)).toEqual(['a2@0', 'a3@1', 'a1@2', 'a5@3', 'a6@4', 'a7@5']);
  });

  it('el destacado activo, o un activo fuera del filtro, deja el sistema como está', () => {
    expect(orbitalLayout(AUDIOS, 'a1')).toEqual(orbitalLayout(AUDIOS, null));

    const meditation = filterAudios(AUDIOS, 'meditation');
    const outside = AUDIOS.find((audio) => !meditation.includes(audio))!;
    expect(orbitalLayout(meditation, outside.id)).toEqual(orbitalLayout(meditation, null));
  });

  it('nunca repite ni pierde una frecuencia', () => {
    for (const audio of AUDIOS) {
      const layout = orbitalLayout(AUDIOS, audio.id);
      const all = [layout.center!.id, ...layout.orbit.map((o) => o.audio.id)].sort();
      expect(all).toEqual(AUDIOS.map((a) => a.id).sort());
    }
  });

  it('un catálogo vacío no tiene centro', () => {
    expect(orbitalLayout([], 'a1')).toEqual({
      center: undefined,
      centerIsFeatured: false,
      orbit: [],
    });
  });
});
