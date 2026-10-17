import { beforeEach, describe, expect, it } from 'vitest';

import { ATMOSPHERE_IDS, ATMOSPHERE_STORAGE_KEY, PICKER_ATMOSPHERES } from '@/config/atmospheres';
import { eligibleAtmospheres, showsPicker } from '@/lib/atmosphere/picker';
import { useAtmosphereStore } from '@/stores/atmosphere-store';
import type { Place } from '@/types/atmosphere';

import enMessages from '../../messages/en.json';
import esMessages from '../../messages/es.json';

const ALL_PLACES: Place[] = [
  'portal',
  'home',
  'auth',
  'descubrete',
  'resonario',
  'academia',
  'experiencias',
  'tienda',
  'sanctuario',
  'story',
];

describe('eligibleAtmospheres', () => {
  it('sale de config, en su orden', () => {
    expect(eligibleAtmospheres()).toEqual(PICKER_ATMOSPHERES);
    expect(eligibleAtmospheres()).toEqual(['dusk', 'dawn', 'moon', 'forest']);
  });

  it('sólo ofrece ids de atmósfera válidos, sin repetir', () => {
    const eligible = eligibleAtmospheres();

    expect(new Set(eligible).size).toBe(eligible.length);
    for (const id of eligible) expect(ATMOSPHERE_IDS).toContain(id);
  });

  it('la noche no es una opción: es la atmósfera por defecto del portal', () => {
    expect(eligibleAtmospheres()).not.toContain('night');
  });

  it('cada opción tiene nombre, descripción y etiqueta del selector en ES y EN', () => {
    for (const messages of [esMessages, enMessages]) {
      for (const id of eligibleAtmospheres()) {
        const entry = messages.atmospheres[id];

        expect(entry.name).toBeTruthy();
        expect(entry.description).toBeTruthy();
        expect(entry.pickerLabel).toBeTruthy();
      }
    }
  });
});

describe('showsPicker', () => {
  it('se ofrece en los lugares de escucha', () => {
    for (const place of ['descubrete', 'resonario', 'sanctuario'] as const) {
      expect(showsPicker(place)).toBe(true);
    }
  });

  it('no se ofrece fuera de los lugares de escucha', () => {
    const listening = ['descubrete', 'resonario', 'sanctuario'];

    for (const place of ALL_PLACES) {
      if (listening.includes(place)) continue;
      expect(showsPicker(place)).toBe(false);
    }
  });
});

describe('elegir y volver al ambiente del sitio (store)', () => {
  beforeEach(() => {
    sessionStorage.clear();
    useAtmosphereStore.setState({ manual: null });
  });

  it('elegir una atmósfera la guarda como elección manual', () => {
    useAtmosphereStore.getState().setManual('dawn');

    expect(useAtmosphereStore.getState().manual).toBe('dawn');
    expect(sessionStorage.getItem(ATMOSPHERE_STORAGE_KEY)).toContain('"manual":"dawn"');
  });

  it('volver al ambiente del sitio limpia la elección manual', () => {
    useAtmosphereStore.getState().setManual('moon');
    useAtmosphereStore.getState().clear();

    expect(useAtmosphereStore.getState().manual).toBeNull();
  });
});
