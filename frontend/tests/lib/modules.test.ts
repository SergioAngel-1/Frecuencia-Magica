import { describe, expect, it } from 'vitest';

import { COURSES } from '@/data';
import { buildLessons } from '@/lib/academy/lessons';
import { groupIntoModules, MODULE_SIZE } from '@/lib/academy/modules';

describe('groupIntoModules', () => {
  it('conserva el orden y no pierde ni repite ninguna lección', () => {
    for (const course of COURSES) {
      const lessons = buildLessons(course);
      const modules = groupIntoModules(lessons, MODULE_SIZE);

      expect(modules.flatMap((m) => m.lessons)).toEqual(lessons);
      expect(modules.reduce((sum, m) => sum + m.lessons.length, 0)).toBe(course.lessons);
    }
  });

  it('cada módulo trae `size` lecciones y el último, el resto', () => {
    const lessons = buildLessons(COURSES[2]!);
    const modules = groupIntoModules(lessons, 4);

    expect(modules.map((m) => m.lessons.length)).toEqual([4, 2]);
  });

  it('numera los módulos desde 1', () => {
    const modules = groupIntoModules(buildLessons(COURSES[1]!), 4);

    expect(modules.map((m) => m.number)).toEqual([1, 2, 3]);
  });

  it('un curso sin lecciones no tiene módulos', () => {
    expect(groupIntoModules([], 4)).toEqual([]);
  });

  it('un tamaño menor que 1 es un error de código, no un bucle infinito', () => {
    expect(() => groupIntoModules(buildLessons(COURSES[0]!), 0)).toThrow(RangeError);
  });
});
