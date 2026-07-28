import { describe, expect, it } from 'vitest';

import {
  INITIAL_STATE,
  computeResult,
  quizReducer,
} from '@/lib/quiz-reducer';

describe('quizReducer', () => {
  it('START_QUIZ pasa a questions y resetea', () => {
    const state = quizReducer(INITIAL_STATE, { type: 'START_QUIZ' });
    expect(state.step).toBe('questions');
    expect(state.currentQuestion).toBe(0);
    expect(state.answers).toEqual({});
    expect(state.resultHz).toBeNull();
  });

  it('ANSWER avanza a la siguiente pregunta', () => {
    const state = quizReducer(
      { ...INITIAL_STATE, step: 'questions' as const },
      { type: 'ANSWER', questionId: 'q1', optionIndex: 2 },
    );
    expect(state.step).toBe('questions');
    expect(state.currentQuestion).toBe(1);
    expect(state.answers).toEqual({ q1: 2 });
  });

  it('ANSWER en la última pregunta pasa a tuning y calcula resultado', () => {
    const started = quizReducer(INITIAL_STATE, { type: 'START_QUIZ' });
    const q1 = quizReducer(started, { type: 'ANSWER', questionId: 'q1', optionIndex: 0 });
    const q2 = quizReducer(q1, { type: 'ANSWER', questionId: 'q2', optionIndex: 1 });
    const q3 = quizReducer(q2, { type: 'ANSWER', questionId: 'q3', optionIndex: 2 });
    const q4 = quizReducer(q3, { type: 'ANSWER', questionId: 'q4', optionIndex: 3 });
    const q5 = quizReducer(q4, { type: 'ANSWER', questionId: 'q5', optionIndex: 0 });

    expect(q5.step).toBe('tuning');
    expect(q5.currentQuestion).toBe(4);
    expect(q5.resultHz).toBeTypeOf('number');
    expect(q5.answers).toEqual({ q1: 0, q2: 1, q3: 2, q4: 3, q5: 0 });
  });

  it('GO_BACK retrocede una pregunta', () => {
    const state = quizReducer(
      { ...INITIAL_STATE, step: 'questions' as const, currentQuestion: 2, answers: { q1: 1, q2: 0 } },
      { type: 'GO_BACK' },
    );
    expect(state.step).toBe('questions');
    expect(state.currentQuestion).toBe(1);
  });

  it('GO_BACK desde pregunta 0 vuelve a intro', () => {
    const state = quizReducer(
      { ...INITIAL_STATE, step: 'questions' as const, currentQuestion: 0 },
      { type: 'GO_BACK' },
    );
    expect(state.step).toBe('intro');
  });

  it('GO_BACK en intro no hace nada', () => {
    const state = quizReducer(INITIAL_STATE, { type: 'GO_BACK' });
    expect(state).toBe(INITIAL_STATE);
  });

  it('FINISH_TUNE pasa a result', () => {
    const state = quizReducer(
      { ...INITIAL_STATE, step: 'tuning' as const, resultHz: 432 },
      { type: 'FINISH_TUNE' },
    );
    expect(state.step).toBe('result');
  });

  it('RESET vuelve al estado inicial', () => {
    const state = quizReducer(
      { step: 'result' as const, currentQuestion: 4, answers: { q1: 1 }, resultHz: 528 },
      { type: 'RESET' },
    );
    expect(state).toEqual(INITIAL_STATE);
  });
});

describe('computeResult', () => {
  it('suma los índices y devuelve una frecuencia del catálogo', () => {
    const result = computeResult({ q1: 0, q2: 1, q3: 2, q4: 3, q5: 0 });
    expect([432, 528, 396, 174, 639, 417]).toContain(result);
  });

  it('siempre devuelve un valor dentro del catálogo', () => {
    for (let i = 0; i < 50; i++) {
      const answers = { q1: i % 4, q2: (i + 1) % 4, q3: (i + 2) % 4, q4: (i + 3) % 4, q5: i % 4 };
      const hz = computeResult(answers);
      expect([432, 528, 396, 174, 639, 417]).toContain(hz);
    }
  });
});
