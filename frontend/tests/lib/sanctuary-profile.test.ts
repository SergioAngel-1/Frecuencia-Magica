import { describe, expect, it } from 'vitest';

import { COURSES } from '@/data';
import { lessonProgress, MOCK_PROFILE, resumeTarget } from '@/lib/sanctuary/profile';

describe('lessonProgress', () => {
  it('expresa el avance hasta la lección como porcentaje entero', () => {
    expect(lessonProgress(5, 8)).toBe(63);
    expect(lessonProgress(1, 8)).toBe(13);
    expect(lessonProgress(8, 8)).toBe(100);
  });

  it('acota el resultado a 0–100 y tolera cursos vacíos', () => {
    expect(lessonProgress(12, 8)).toBe(100);
    expect(lessonProgress(-3, 8)).toBe(0);
    expect(lessonProgress(3, 0)).toBe(0);
  });
});

describe('resumeTarget', () => {
  it('resuelve el punto de retoma del perfil contra el catálogo real', () => {
    const target = resumeTarget(MOCK_PROFILE, COURSES);

    expect(target?.course.id).toBe('c1');
    expect(target?.lessonNumber).toBe(5);
    expect(target?.totalLessons).toBe(8);
    expect(target?.percent).toBe(63);
    expect(target?.titleIndex).toBe(4);
  });

  it('acota la lección al rango del curso', () => {
    const profile = { ...MOCK_PROFILE, resume: { courseId: 'c3', lessonNumber: 40 } };
    const target = resumeTarget(profile, COURSES);

    expect(target?.lessonNumber).toBe(6);
    expect(target?.percent).toBe(100);
  });

  it('cicla los títulos de lección como lo hace el temario', () => {
    const profile = { ...MOCK_PROFILE, resume: { courseId: 'c2', lessonNumber: 12 } };

    expect(resumeTarget(profile, COURSES)?.titleIndex).toBe(11);
  });

  it('devuelve null si el curso ya no existe', () => {
    const profile = { ...MOCK_PROFILE, resume: { courseId: 'nope', lessonNumber: 1 } };

    expect(resumeTarget(profile, COURSES)).toBeNull();
  });

  it('el perfil de demostración apunta a un audio y a un curso que existen', () => {
    expect(COURSES.some((course) => course.id === MOCK_PROFILE.resume.courseId)).toBe(true);
  });
});
