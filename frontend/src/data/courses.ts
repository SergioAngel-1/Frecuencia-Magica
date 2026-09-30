import type { Course } from '@/types/content';
import { COVERS } from '@/config/covers';

/** Los tres cursos de la Academia. */
export const COURSES: readonly Course[] = [
  {
    id: 'c1',
    titleKey: 'academy.courses.c1.title',
    levelKey: 'academy.levels.foundations',
    lessons: 8,
    hours: '3.5h',
    band: COVERS.iris,
  },
  {
    id: 'c2',
    titleKey: 'academy.courses.c2.title',
    levelKey: 'academy.levels.practice',
    lessons: 12,
    hours: '5h',
    band: COVERS.moss,
  },
  {
    id: 'c3',
    titleKey: 'academy.courses.c3.title',
    levelKey: 'academy.levels.intermediate',
    lessons: 6,
    hours: '2.5h',
    band: COVERS.amber,
  },
] as const;
