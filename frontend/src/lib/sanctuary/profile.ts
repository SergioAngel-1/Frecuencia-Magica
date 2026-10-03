import type { Course } from '@/types/content';

/**
 * Perfil de demostración de Mi Santuario.
 *
 * TODO(backend): todo esto vendrá del perfil de la persona autenticada —
 * nombre, días de práctica, frecuencias oídas, cursos en camino, el punto
 * donde retomar y la frecuencia elegida para hoy. Sin backend son constantes
 * tipadas en un único sitio, en lugar de cadenas sueltas repartidas por los
 * mensajes. Las entradas de diario no están aquí: son reales (store local).
 */
export type SanctuaryProfile = {
  name: string;
  daysPracticed: number;
  frequenciesHeard: number;
  coursesInProgress: number;
  /** Lección (1-based) donde se retoma el curso. */
  resume: { courseId: string; lessonNumber: number };
  dailyAudioId: string;
};

export const MOCK_PROFILE: SanctuaryProfile = {
  name: 'Luz',
  daysPracticed: 12,
  frequenciesHeard: 34,
  coursesInProgress: 3,
  resume: { courseId: 'c1', lessonNumber: 5 },
  dailyAudioId: 'a1',
};

/** Número de títulos de lección que se ciclan (ver `lib/academy/lessons`). */
const LESSON_TITLE_COUNT = 12;

export type ResumeTarget = {
  course: Course;
  lessonNumber: number;
  totalLessons: number;
  /** Avance hasta la lección actual, 0–100. */
  percent: number;
  /** Índice en `academy.lessonTitles`. */
  titleIndex: number;
};

/** Avance hasta la lección `lessonNumber` de `totalLessons`, en porcentaje entero. */
export function lessonProgress(lessonNumber: number, totalLessons: number): number {
  if (totalLessons <= 0) return 0;

  return Math.min(100, Math.max(0, Math.round((lessonNumber / totalLessons) * 100)));
}

/**
 * Resuelve el punto de retoma contra el catálogo. Devuelve `null` si el curso
 * ya no existe; acota la lección al rango real del curso.
 */
export function resumeTarget(
  profile: SanctuaryProfile,
  courses: readonly Course[],
): ResumeTarget | null {
  const course = courses.find((candidate) => candidate.id === profile.resume.courseId);

  if (!course) return null;

  const lessonNumber = Math.min(course.lessons, Math.max(1, profile.resume.lessonNumber));

  return {
    course,
    lessonNumber,
    totalLessons: course.lessons,
    percent: lessonProgress(lessonNumber, course.lessons),
    titleIndex: (lessonNumber - 1) % LESSON_TITLE_COUNT,
  };
}
