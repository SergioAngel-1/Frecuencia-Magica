import { describe, expect, it } from 'vitest';

import { ATMOSPHERE_IDS, ATMOSPHERES, PLACE_ATMOSPHERE } from '@/config/atmospheres';
import { getRealm } from '@/config/realms';
import type { Place } from '@/types/atmosphere';

const PLACES: readonly Place[] = [
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

describe('registro de atmósferas', () => {
  it('cada place tiene una atmósfera por defecto que existe en el registro', () => {
    for (const place of PLACES) {
      const atmosphere = PLACE_ATMOSPHERE[place];

      expect(ATMOSPHERES, `place ${place}`).toHaveProperty(atmosphere);
    }
  });

  it('asigna cada place a su atmósfera de diseño', () => {
    expect(PLACE_ATMOSPHERE).toEqual({
      portal: 'night',
      home: 'night',
      auth: 'night',
      descubrete: 'night',
      resonario: 'night',
      sanctuario: 'night',
      academia: 'dawn',
      tienda: 'dawn',
      experiencias: 'dusk',
      story: 'dawn',
    });
  });

  it('hay cinco temas, y la noche es el primero', () => {
    expect(ATMOSPHERE_IDS).toEqual(['night', 'dusk', 'dawn', 'moon', 'forest']);
  });

  it('la noche es la v1: engine completo y nota del portal', () => {
    expect(ATMOSPHERES.night).toEqual({
      scheme: 'dark',
      themeColor: '#0F1B2E',
      engine: { canvas: 1, nebula: 1, figures: 1 },
      droneNote: getRealm('portal').baseNote,
    });
  });

  it('los valores del engine están entre 0 y 1 y las notas del drone entre 80 y 220 Hz', () => {
    for (const [id, definition] of Object.entries(ATMOSPHERES)) {
      const { canvas, nebula, figures } = definition.engine;

      for (const value of [canvas, nebula, figures]) {
        expect(value, `engine de ${id}`).toBeGreaterThanOrEqual(0);
        expect(value, `engine de ${id}`).toBeLessThanOrEqual(1);
      }
      expect(definition.droneNote, `droneNote de ${id}`).toBeGreaterThanOrEqual(80);
      expect(definition.droneNote, `droneNote de ${id}`).toBeLessThanOrEqual(220);
    }
  });
});
