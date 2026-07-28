import type { Question } from '@/types/content';

/**
 * Las cinco preguntas de Descúbrete.
 *
 * El resultado es la suma de los índices de respuesta módulo el tamaño del
 * catálogo de frecuencias, así que el orden de las opciones es significativo.
 */
export const QUESTIONS: readonly Question[] = [
  {
    id: 'q1',
    promptKey: 'discover.questions.q1.prompt',
    optionKeys: [
      'discover.questions.q1.options.0',
      'discover.questions.q1.options.1',
      'discover.questions.q1.options.2',
      'discover.questions.q1.options.3',
    ],
  },
  {
    id: 'q2',
    promptKey: 'discover.questions.q2.prompt',
    optionKeys: [
      'discover.questions.q2.options.0',
      'discover.questions.q2.options.1',
      'discover.questions.q2.options.2',
      'discover.questions.q2.options.3',
    ],
  },
  {
    id: 'q3',
    promptKey: 'discover.questions.q3.prompt',
    optionKeys: [
      'discover.questions.q3.options.0',
      'discover.questions.q3.options.1',
      'discover.questions.q3.options.2',
      'discover.questions.q3.options.3',
    ],
  },
  {
    id: 'q4',
    promptKey: 'discover.questions.q4.prompt',
    optionKeys: [
      'discover.questions.q4.options.0',
      'discover.questions.q4.options.1',
      'discover.questions.q4.options.2',
      'discover.questions.q4.options.3',
    ],
  },
  {
    id: 'q5',
    promptKey: 'discover.questions.q5.prompt',
    optionKeys: [
      'discover.questions.q5.options.0',
      'discover.questions.q5.options.1',
      'discover.questions.q5.options.2',
      'discover.questions.q5.options.3',
    ],
  },
] as const;
