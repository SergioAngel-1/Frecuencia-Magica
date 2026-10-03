import type { Audio, Course, Experience, Product } from '@/types/content';

import { AUDIOS } from './audios';
import { COURSES } from './courses';
import { EXPERIENCES } from './experiences';
import { PRODUCTS } from './products';
import { QUESTIONS } from './questions';

export { AUDIOS, COURSES, EXPERIENCES, PRODUCTS, QUESTIONS };

export function getAudio(id: string): Audio | undefined {
  return AUDIOS.find((audio) => audio.id === id);
}

export function getCourse(id: string): Course | undefined {
  return COURSES.find((course) => course.id === id);
}

export function getExperience(id: string): Experience | undefined {
  return EXPERIENCES.find((experience) => experience.id === id);
}

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((product) => product.id === id);
}
