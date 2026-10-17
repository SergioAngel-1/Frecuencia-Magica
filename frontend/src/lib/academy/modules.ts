import type { Lesson } from '@/lib/academy/lessons';

/** Lecciones por módulo. Una decisión de presentación: los cursos de Marisol dirán la suya. */
export const MODULE_SIZE = 4;

export type Module = {
  /** Número del módulo, desde 1. */
  number: number;
  lessons: Lesson[];
};

/**
 * Agrupa las lecciones de un curso en módulos de `size`. Conserva el orden; la
 * suma de lecciones de los módulos es el total y el último lleva el resto.
 */
export function groupIntoModules(lessons: readonly Lesson[], size: number): Module[] {
  if (!Number.isInteger(size) || size < 1) {
    throw new RangeError(`tamaño de módulo no válido: ${size}`);
  }

  const modules: Module[] = [];
  for (let start = 0; start < lessons.length; start += size) {
    modules.push({ number: modules.length + 1, lessons: lessons.slice(start, start + size) });
  }

  return modules;
}
