import { describe, expect, it } from 'vitest';

import { INITIAL_STATE, quizReducer, type QuizState } from '@/lib/quiz-reducer';

const TOTAL = 5;

function answer(state: QuizState, questionId: string, optionIndex: number, total = TOTAL) {
  return quizReducer(state, { type: 'ANSWER', questionId, optionIndex, total });
}

describe('quizReducer', () => {
  it('START_QUIZ pasa a questions y resetea', () => {
    const state = quizReducer(INITIAL_STATE, { type: 'START_QUIZ' });
    expect(state.step).toBe('questions');
    expect(state.currentQuestion).toBe(0);
    expect(state.answers).toEqual({});
  });

  it('ANSWER avanza a la siguiente pregunta', () => {
    const state = answer({ ...INITIAL_STATE, step: 'questions' }, 'q1', 2);
    expect(state.step).toBe('questions');
    expect(state.currentQuestion).toBe(1);
    expect(state.answers).toEqual({ q1: 2 });
  });

  it('ANSWER en la última pregunta pasa a tuning con todas las respuestas', () => {
    const started = quizReducer(INITIAL_STATE, { type: 'START_QUIZ' });
    const done = [0, 1, 2, 3, 0].reduce(
      (state, optionIndex, index) => answer(state, `q${index + 1}`, optionIndex),
      started,
    );

    expect(done.step).toBe('tuning');
    expect(done.currentQuestion).toBe(4);
    expect(done.answers).toEqual({ q1: 0, q2: 1, q3: 2, q4: 3, q5: 0 });
  });

  it('la última pregunta la marca el total, no un número fijo', () => {
    const started = quizReducer(INITIAL_STATE, { type: 'START_QUIZ' });
    const done = answer(answer(started, 'q1', 0, 2), 'q2', 1, 2);

    expect(done.step).toBe('tuning');
  });

  it('GO_BACK retrocede una pregunta', () => {
    const state = quizReducer(
      { ...INITIAL_STATE, step: 'questions', currentQuestion: 2, answers: { q1: 1, q2: 0 } },
      { type: 'GO_BACK' },
    );
    expect(state.step).toBe('questions');
    expect(state.currentQuestion).toBe(1);
  });

  it('GO_BACK desde pregunta 0 vuelve a intro', () => {
    const state = quizReducer(
      { ...INITIAL_STATE, step: 'questions', currentQuestion: 0 },
      { type: 'GO_BACK' },
    );
    expect(state.step).toBe('intro');
  });

  it('GO_BACK en intro no hace nada', () => {
    const state = quizReducer(INITIAL_STATE, { type: 'GO_BACK' });
    expect(state).toBe(INITIAL_STATE);
  });

  it('FINISH_TUNE pasa a result', () => {
    const state = quizReducer({ ...INITIAL_STATE, step: 'tuning' }, { type: 'FINISH_TUNE' });
    expect(state.step).toBe('result');
  });

  it('RESET vuelve al estado inicial', () => {
    const state = quizReducer(
      { step: 'result', currentQuestion: 4, answers: { q1: 1 } },
      { type: 'RESET' },
    );
    expect(state).toEqual(INITIAL_STATE);
  });
});
