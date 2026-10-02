import { describe, expect, it } from 'vitest';

import { AUDIOS, COURSES, EXPERIENCES, PRODUCTS } from '@/data';
import { QUESTIONS } from '@/data/questions';
import {
  INTENTS,
  pickByIntent,
  readIntents,
  scoreAnswers,
  type IntentScores,
} from '@/lib/discover/intents';
import { recommend } from '@/lib/discover/recommend';
import type { Intent, Question } from '@/types/content';

const CATALOG = { audios: AUDIOS, courses: COURSES, experiences: EXPERIENCES, products: PRODUCTS };

const QUESTION: Question = {
  id: 'q1',
  promptKey: 'p',
  options: [
    { key: 'a', intents: ['calm', 'rest'] },
    { key: 'b', intents: ['bond'] },
  ],
};

function scores(partial: Partial<IntentScores>): IntentScores {
  return { calm: 0, grounding: 0, clarity: 0, rest: 0, bond: 0, renewal: 0, ...partial };
}

/** Todas las combinaciones de respuestas del quiz real (4^5 = 1024). */
function* allAnswerSets(): Generator<Record<string, number>> {
  for (let n = 0; n < 4 ** QUESTIONS.length; n += 1) {
    yield Object.fromEntries(
      QUESTIONS.map((question, index) => [question.id, Math.floor(n / 4 ** index) % 4]),
    );
  }
}

describe('scoreAnswers', () => {
  it('gives 2 points to the main intent and 1 to the secondary one', () => {
    expect(scoreAnswers({ q1: 0 }, [QUESTION])).toEqual(scores({ calm: 2, rest: 1 }));
  });

  it('ignores answers to unknown questions or options', () => {
    expect(scoreAnswers({ q1: 9, q9: 0 }, [QUESTION])).toEqual(scores({}));
  });
});

describe('readIntents', () => {
  it('reads the two highest scores as primary and secondary', () => {
    expect(readIntents(scores({ rest: 5, bond: 3, calm: 1 }))).toEqual({
      primary: 'rest',
      secondary: 'bond',
    });
  });

  it('breaks ties with the canonical intent order', () => {
    expect(readIntents(scores({ renewal: 2, calm: 2 }))).toEqual({
      primary: 'calm',
      secondary: 'renewal',
    });
  });
});

describe('pickByIntent', () => {
  const items = [
    { id: 'x', intents: ['bond', 'grounding'] as Intent[] },
    { id: 'y', intents: ['bond', 'renewal'] as Intent[] },
    { id: 'z', intents: ['rest', 'bond'] as Intent[] },
  ];

  it('prefers the item that leads with the primary intent', () => {
    expect(pickByIntent(items, { primary: 'rest', secondary: 'bond' })?.id).toBe('z');
  });

  it('uses the secondary intent to choose between equal leaders', () => {
    expect(pickByIntent(items, { primary: 'bond', secondary: 'renewal' })?.id).toBe('y');
  });

  it('falls back to catalog order and never returns nothing for a non-empty catalog', () => {
    expect(pickByIntent(items, { primary: 'clarity', secondary: 'calm' })?.id).toBe('x');
    expect(pickByIntent([], { primary: 'calm', secondary: 'rest' })).toBeUndefined();
  });
});

describe('recommend', () => {
  it('recommends a frequency, a course, an experience and a product for every possible quiz', () => {
    for (const answers of allAnswerSets()) {
      const result = recommend(answers, QUESTIONS, CATALOG);

      expect(result).not.toBeNull();
      expect(result!.audio.intents).toContain(result!.reading.primary);
    }
  });

  it('can land on every intent and on every audio of the library', () => {
    const intents = new Set<Intent>();
    const audios = new Set<string>();

    for (const answers of allAnswerSets()) {
      const result = recommend(answers, QUESTIONS, CATALOG)!;
      intents.add(result.reading.primary);
      audios.add(result.audio.id);
    }

    expect([...intents].sort()).toEqual([...INTENTS].sort());
    expect([...audios].sort()).toEqual(AUDIOS.map((audio) => audio.id).sort());
  });

  it('answers a calm-seeking quiz with the calm frequency', () => {
    // Inquieto · Silencio · Ansiedad · El océano · Soltar
    const result = recommend({ q1: 1, q2: 0, q3: 1, q4: 1, q5: 0 }, QUESTIONS, CATALOG)!;

    expect(result.reading.primary).toBe('calm');
    expect(result.audio.hz).toBe(432);
  });

  it('returns null rather than a partial result when a catalog is empty', () => {
    expect(recommend({}, QUESTIONS, { ...CATALOG, products: [] })).toBeNull();
  });
});
