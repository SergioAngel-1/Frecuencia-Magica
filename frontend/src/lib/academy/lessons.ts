import type { Course } from '@/types/content';

export type Lesson = {
  index: number;
  number: string;
  titleIndex: number;
  duration: string;
};

/**
 * Genera las lecciones de un curso a partir de sus metadatos.
 *
 * - Las duraciones se reparten uniformemente redondeando a minutos.
 * - Los títulos se ciclan de una lista de 12, indexados por `titleIndex`.
 */
export function buildLessons(course: Course): Lesson[] {
  const totalMinutes = parseHours(course.hours);
  const perLesson = Math.floor(totalMinutes / course.lessons);
  const remainder = totalMinutes % course.lessons;

  return Array.from({ length: course.lessons }, (_, i) => ({
    index: i,
    number: String(i + 1).padStart(2, '0'),
    titleIndex: i % 12,
    duration: `${perLesson + (i < remainder ? 1 : 0)} min`,
  }));
}

/** `"3.5h"` → `210` (minutos). */
function parseHours(label: string): number {
  const match = label.match(/^(\d+)(?:\.(\d+))?h$/);
  if (!match) return 0;

  const hours = Number(match[1]!);
  const frac = match[2] ? Number(`0.${match[2]}`) : 0;

  return Math.round(hours * 60 + frac * 60);
}
