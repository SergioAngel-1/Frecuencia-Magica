export type QuizStep = 'intro' | 'questions' | 'tuning' | 'result';

/**
 * Flujo de Descúbrete. El reducer sólo sabe de pasos y respuestas: qué
 * significan las respuestas lo decide `lib/discover/recommend.ts`.
 */
export type QuizState = {
  step: QuizStep;
  currentQuestion: number;
  answers: Record<string, number>;
};

export type QuizAction =
  | { type: 'START_QUIZ' }
  /**
   * `total`: preguntas del quiz; responder la última pasa a afinar.
   * `questionIndex`: la pregunta que se contesta. Una respuesta a una pregunta
   * que ya no es la actual (un clic sobre la que se está yendo) se ignora.
   */
  | {
      type: 'ANSWER';
      questionId: string;
      optionIndex: number;
      total: number;
      questionIndex: number;
    }
  | { type: 'GO_BACK' }
  | { type: 'FINISH_TUNE' }
  | { type: 'RESET' };

export const INITIAL_STATE: QuizState = {
  step: 'intro',
  currentQuestion: 0,
  answers: {},
};

export function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'START_QUIZ':
      return { ...state, step: 'questions', currentQuestion: 0, answers: {} };

    case 'ANSWER': {
      if (state.step !== 'questions' || action.questionIndex !== state.currentQuestion) {
        return state;
      }
      const nextAnswers = { ...state.answers, [action.questionId]: action.optionIndex };
      const isLast = state.currentQuestion >= action.total - 1;
      if (isLast) {
        return { ...state, answers: nextAnswers, step: 'tuning' };
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
