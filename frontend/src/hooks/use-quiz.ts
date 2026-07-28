'use client';

import { useReducer } from 'react';

import { INITIAL_STATE, quizReducer, type QuizStep } from '@/lib/quiz-reducer';
import type { Question } from '@/types/content';

export type { QuizStep } from '@/lib/quiz-reducer';

type UseQuizReturn = {
  step: QuizStep;
  currentQuestion: number;
  resultHz: number | null;
  totalQuestions: number;
  answer: (optionIndex: number) => void;
  goBack: () => void;
  start: () => void;
  finishTune: () => void;
  reset: () => void;
};

export function useQuiz(questions: readonly Question[]): UseQuizReturn {
  const [state, dispatch] = useReducer(quizReducer, INITIAL_STATE);

  return {
    step: state.step,
    currentQuestion: state.currentQuestion,
    resultHz: state.resultHz,
    totalQuestions: questions.length,

    answer: (optionIndex: number) => {
      const q = questions[state.currentQuestion];
      if (!q) return;
      dispatch({ type: 'ANSWER', questionId: q.id, optionIndex });
    },

    goBack: () => dispatch({ type: 'GO_BACK' }),
    start: () => dispatch({ type: 'START_QUIZ' }),
    finishTune: () => dispatch({ type: 'FINISH_TUNE' }),
    reset: () => dispatch({ type: 'RESET' }),
  };
}
