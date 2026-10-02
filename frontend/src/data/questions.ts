import type { Question } from '@/types/content';

/**
 * Las cinco preguntas de Descúbrete.
 *
 * Las claves son **relativas al namespace `discover`** (las consume
 * `useTranslations('discover')`). Cada opción suma a su intención principal
 * (2 puntos) y a la secundaria (1); la dominante elige la frecuencia, el
 * curso, la experiencia y el objeto que se recomiendan (`lib/discover/`).
 */
export const QUESTIONS: readonly Question[] = [
  {
    id: 'q1',
    promptKey: 'questions.q1.prompt',
    options: [
      { key: 'questions.q1.options.0', intents: ['rest', 'grounding'] },
      { key: 'questions.q1.options.1', intents: ['calm', 'grounding'] },
      { key: 'questions.q1.options.2', intents: ['clarity'] },
      { key: 'questions.q1.options.3', intents: ['renewal', 'bond'] },
    ],
  },
  {
    id: 'q2',
    promptKey: 'questions.q2.prompt',
    options: [
      { key: 'questions.q2.options.0', intents: ['calm'] },
      { key: 'questions.q2.options.1', intents: ['clarity'] },
      { key: 'questions.q2.options.2', intents: ['renewal'] },
      { key: 'questions.q2.options.3', intents: ['rest'] },
    ],
  },
  {
    id: 'q3',
    promptKey: 'questions.q3.prompt',
    options: [
      { key: 'questions.q3.options.0', intents: ['bond'] },
      { key: 'questions.q3.options.1', intents: ['calm', 'grounding'] },
      { key: 'questions.q3.options.2', intents: ['renewal'] },
      { key: 'questions.q3.options.3', intents: ['bond', 'clarity'] },
    ],
  },
  {
    id: 'q4',
    promptKey: 'questions.q4.prompt',
    options: [
      { key: 'questions.q4.options.0', intents: ['grounding'] },
      { key: 'questions.q4.options.1', intents: ['calm'] },
      { key: 'questions.q4.options.2', intents: ['clarity', 'rest'] },
      { key: 'questions.q4.options.3', intents: ['bond', 'rest'] },
    ],
  },
  {
    id: 'q5',
    promptKey: 'questions.q5.prompt',
    options: [
      { key: 'questions.q5.options.0', intents: ['renewal', 'calm'] },
      { key: 'questions.q5.options.1', intents: ['bond'] },
      { key: 'questions.q5.options.2', intents: ['grounding', 'bond'] },
      { key: 'questions.q5.options.3', intents: ['rest'] },
    ],
  },
];
