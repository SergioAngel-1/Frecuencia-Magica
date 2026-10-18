import type { Course } from '@/types/content';
import { COVERS } from '@/config/covers';

/** Los tres cursos de la Academia. */
export const COURSES: readonly Course[] = [
  {
    id: 'c1',
    intents: ['calm', 'clarity', 'rest'],
    titleKey: 'academy.courses.c1.title',
    levelKey: 'academy.levels.foundations',
    lessons: 8,
    hours: '3.5h',
    band: COVERS.iris,
    access: { type: 'free' },
    modality: 'selfPaced',
    learnKeys: [
      'academy.courses.c1.learn.0',
      'academy.courses.c1.learn.1',
      'academy.courses.c1.learn.2',
    ],
    includesKeys: [
      'academy.includes.guided',
      'academy.includes.practices',
      'academy.includes.pace',
    ],
    provisional: true,
  },
  {
    id: 'c2',
    intents: ['renewal', 'bond', 'grounding'],
    titleKey: 'academy.courses.c2.title',
    levelKey: 'academy.levels.practice',
    lessons: 12,
    hours: '5h',
    band: COVERS.moss,
    access: { type: 'paid', price: 48 },
    modality: 'blended',
    learnKeys: [
      'academy.courses.c2.learn.0',
      'academy.courses.c2.learn.1',
      'academy.courses.c2.learn.2',
    ],
    includesKeys: [
      'academy.includes.guided',
      'academy.includes.practices',
      'academy.includes.pace',
    ],
    provisional: true,
  },
  {
    id: 'c3',
    intents: ['bond', 'grounding', 'rest'],
    titleKey: 'academy.courses.c3.title',
    levelKey: 'academy.levels.intermediate',
    lessons: 6,
    hours: '2.5h',
    band: COVERS.amber,
    access: { type: 'paid', price: 36 },
    modality: 'selfPaced',
    learnKeys: [
      'academy.courses.c3.learn.0',
      'academy.courses.c3.learn.1',
      'academy.courses.c3.learn.2',
    ],
    includesKeys: [
      'academy.includes.guided',
      'academy.includes.practices',
      'academy.includes.pace',
    ],
    provisional: true,
  },
] as const;

/** Un curso por id; `undefined` si no existe. */
export function getCourse(id: string): Course | undefined {
  return COURSES.find((course) => course.id === id);
}
