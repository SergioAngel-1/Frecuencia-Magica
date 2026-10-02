import type { Audio, Course, Experience, Product, Question } from '@/types/content';

import { pickByIntent, readIntents, scoreAnswers, type QuizReading } from './intents';

export type DiscoverCatalog = {
  audios: readonly Audio[];
  courses: readonly Course[];
  experiences: readonly Experience[];
  products: readonly Product[];
};

/** Lo que Descúbrete ofrece al terminar: una frecuencia y algo de cada realm. */
export type DiscoverRecommendation = {
  reading: QuizReading;
  audio: Audio;
  course: Course;
  experience: Experience;
  product: Product;
};

/**
 * Del quiz contestado a una recomendación completa. `null` sólo si algún
 * catálogo está vacío: la vista no tiene nada honesto que mostrar.
 */
export function recommend(
  answers: Readonly<Record<string, number>>,
  questions: readonly Question[],
  catalog: DiscoverCatalog,
): DiscoverRecommendation | null {
  const reading = readIntents(scoreAnswers(answers, questions));
  const audio = pickByIntent(catalog.audios, reading);
  const course = pickByIntent(catalog.courses, reading);
  const experience = pickByIntent(catalog.experiences, reading);
  const product = pickByIntent(catalog.products, reading);

  if (!audio || !course || !experience || !product) return null;

  return { reading, audio, course, experience, product };
}
