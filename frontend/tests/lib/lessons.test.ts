import { describe, expect, it } from 'vitest';

import { buildLessons } from '@/lib/academy/lessons';
import { COURSES } from '@/data';

describe('buildLessons', () => {
  it('genera tantas lecciones como declara el curso', () => {
    expect(buildLessons(COURSES[1]!)).toHaveLength(12);
  });

  it('numera las lecciones desde uno con dos dígitos', () => {
    const lessons = buildLessons(COURSES[0]!);
    expect(lessons[0]!.number).toBe('01');
    expect(lessons[1]!.number).toBe('02');
    expect(lessons[2]!.number).toBe('03');
  });

  it('reparte las horas del curso entre las lecciones', () => {
    const c1 = COURSES[0]!; // 3.5h → 210 min, 8 lecciones
    const lessons = buildLessons(c1);
    const total = lessons.reduce((sum, l) => sum + parseInt(l.duration), 0);
    expect(total).toBe(210);
  });

  it('toda lección tiene una duración positiva', () => {
    const lessons = buildLessons(COURSES[0]!);
    expect(lessons.every((l) => parseInt(l.duration) > 0)).toBe(true);
  });
});
