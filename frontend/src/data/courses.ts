import type { Course } from '@/types/content';

/** Los tres cursos de la Academia. */
export const COURSES: readonly Course[] = [
  {
    id: 'c1',
    titleKey: 'academy.courses.c1.title',
    levelKey: 'academy.levels.foundations',
    lessons: 8,
    hours: '3.5h',
    band: 'linear-gradient(150deg,#6a5a8c,#221d38)',
  },
  {
    id: 'c2',
    titleKey: 'academy.courses.c2.title',
    levelKey: 'academy.levels.practice',
    lessons: 12,
    hours: '5h',
    band: 'linear-gradient(150deg,#4f6b5e,#1e2e28)',
  },
  {
    id: 'c3',
    titleKey: 'academy.courses.c3.title',
    levelKey: 'academy.levels.intermediate',
    lessons: 6,
    hours: '2.5h',
    band: 'linear-gradient(150deg,#8a7150,#2c2418)',
  },
] as const;
