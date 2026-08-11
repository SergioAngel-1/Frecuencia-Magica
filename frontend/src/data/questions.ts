import type { Question } from '@/types/content';

/**
 * Las cinco preguntas de Descúbrete.
 *
 * Las claves son **relativas al namespace `discover`** (las consume
 * `useTranslations('discover')`): `questions.q1.prompt`, `questions.q1.options.0`,
 * etc. El resultado es la suma de los índices de respuesta módulo el tamaño del
 * catálogo de frecuencias, así que el orden de las opciones es significativo.
 */
export const QUESTIONS: readonly Question[] = [
  {
    id: 'q1',
    promptKey: 'questions.q1.prompt',
    optionKeys: [
      'questions.q1.options.0',
      'questions.q1.options.1',
      'questions.q1.options.2',
      'questions.q1.options.3',
    ],
  },
  {
    id: 'q2',
    promptKey: 'questions.q2.prompt',
    optionKeys: [
      'questions.q2.options.0',
      'questions.q2.options.1',
      'questions.q2.options.2',
      'questions.q2.options.3',
    ],
  },
  {
    id: 'q3',
    promptKey: 'questions.q3.prompt',
    optionKeys: [
      'questions.q3.options.0',
      'questions.q3.options.1',
      'questions.q3.options.2',
      'questions.q3.options.3',
    ],
  },
  {
    id: 'q4',
    promptKey: 'questions.q4.prompt',
    optionKeys: [
      'questions.q4.options.0',
      'questions.q4.options.1',
      'questions.q4.options.2',
      'questions.q4.options.3',
    ],
  },
  {
    id: 'q5',
    promptKey: 'questions.q5.prompt',
    optionKeys: [
      'questions.q5.options.0',
      'questions.q5.options.1',
      'questions.q5.options.2',
      'questions.q5.options.3',
    ],
  },
] as const;
