export type QuizStep = 'intro' | 'questions' | 'tuning' | 'result';

export type QuizState = {
  step: QuizStep;
  currentQuestion: number;
  answers: Record<string, number>;
  resultHz: number | null;
};

export type QuizAction =
  | { type: 'START_QUIZ' }
  | { type: 'ANSWER'; questionId: string; optionIndex: number }
  | { type: 'GO_BACK' }
  | { type: 'FINISH_TUNE' }
  | { type: 'RESET' };

export const INITIAL_STATE: QuizState = {
  step: 'intro',
  currentQuestion: 0,
  answers: {},
  resultHz: null,
};

const FREQUENCIES = [432, 528, 396, 174, 639, 417] as const;

export type FrequenciesCatalog = typeof FREQUENCIES;

export function computeResult(answers: Record<string, number>): number {
  const total = Object.values(answers).reduce((sum, idx) => sum + idx, 0);
  return FREQUENCIES[total % FREQUENCIES.length]!;
}

export function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'START_QUIZ':
      return { ...state, step: 'questions', currentQuestion: 0, answers: {} };

    case 'ANSWER': {
      const nextAnswers = { ...state.answers, [action.questionId]: action.optionIndex };
      const isLast = state.currentQuestion >= 4;
      if (isLast) {
        const resultHz = computeResult(nextAnswers);
        return { ...state, answers: nextAnswers, resultHz, step: 'tuning' };
      }
      return {
        ...state,
        answers: nextAnswers,
        currentQuestion: state.currentQuestion + 1,
      };
    }

    case 'GO_BACK': {
      if (state.step === 'questions' && state.currentQuestion > 0) {
        return { ...state, currentQuestion: state.currentQuestion - 1 };
      }
      if (state.step === 'questions') {
        return { ...state, step: 'intro' };
      }
      return state;
    }

    case 'FINISH_TUNE':
      return { ...state, step: 'result' };

    case 'RESET':
      return { ...INITIAL_STATE };

    default:
      return state;
  }
}
