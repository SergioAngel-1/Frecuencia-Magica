import { describe, expect, it } from 'vitest';

import { COURSES } from '@/data';
import { flatEn, flatEs } from '../helpers/messages';

/**
 * Los tres cursos son de demostración (spec §8): los reales de Marisol —rituales,
 * esencias, gratuitos y de pago— no se cargan hasta que los entregue. Nada de
 * eso se afirma como real: cada curso consta provisional (R13).
 */
describe('cursos de demostración', () => {
  it('son los tres de siempre y los tres constan provisionales', () => {
    expect(COURSES.map((c) => c.id)).toEqual(['c1', 'c2', 'c3']);
    for (const course of COURSES) expect(course.provisional, course.id).toBe(true);
  });

  it('cada curso declara gratuito o de pago (con precio) y su modalidad', () => {
    for (const course of COURSES) {
      expect(['free', 'paid'], course.id).toContain(course.access.type);
      if (course.access.type === 'paid') expect(course.access.price).toBeGreaterThan(0);
      expect(['selfPaced', 'live', 'blended'], course.id).toContain(course.modality);
    }
  });

  it('cada curso trae «qué aprenderás» y «qué incluye», con copy en ES y EN', () => {
    for (const course of COURSES) {
      expect(course.learnKeys.length, course.id).toBeGreaterThanOrEqual(2);
      expect(course.includesKeys.length, course.id).toBeGreaterThanOrEqual(2);

      for (const key of [...course.learnKeys, ...course.includesKeys]) {
        expect(flatEs[key], `es ${key}`).toBeTruthy();
        expect(flatEn[key], `en ${key}`).toBeTruthy();
      }
    }
  });
});
