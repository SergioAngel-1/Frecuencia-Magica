'use client';

import { useCallback, useReducer } from 'react';

import { INITIAL_STATE, quizReducer, type QuizStep } from '@/lib/quiz-reducer';
import type { Question } from '@/types/content';

export type { QuizStep } from '@/lib/quiz-reducer';

type UseQuizReturn = {
  step: QuizStep;
  currentQuestion: number;
  answers: Readonly<Record<string, number>>;
  totalQuestions: number;
  answer: (optionIndex: number) => void;
  goBack: () => void;
  start: () => void;
  finishTune: () => void;
  reset: () => void;
};

export function useQuiz(questions: readonly Question[]): UseQuizReturn {
  const [state, dispatch] = useReducer(quizReducer, INITIAL_STATE);

  // Las acciones que sólo despachan son estables: quien las recibe puede
  // ponerlas en las dependencias de un efecto sin reiniciarlo en cada render.
  const goBack = useCallback(() => dispatch({ type: 'GO_BACK' }), []);
  const start = useCallback(() => dispatch({ type: 'START_QUIZ' }), []);
  const finishTune = useCallback(() => dispatch({ type: 'FINISH_TUNE' }), []);
  const reset = useCallback(() => dispatch({ type: 'RESET' }), []);

  return {
    step: state.step,
    currentQuestion: state.currentQuestion,
    answers: state.answers,
    totalQuestions: questions.length,

    answer: (optionIndex: number) => {
      const q = questions[state.currentQuestion];
      if (!q) return;
      dispatch({
        type: 'ANSWER',
        questionId: q.id,
        optionIndex,
        total: questions.length,
        // La pregunta que se veía al pulsar: si ya se respondió, el reducer la ignora.
        questionIndex: state.currentQuestion,
      });
    },

    goBack,
    start,
    finishTune,
    reset,
  };
}
