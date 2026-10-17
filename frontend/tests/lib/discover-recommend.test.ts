import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import { COURSES, EXPERIENCES, PLAYABLE_AUDIOS, PRODUCTS } from '@/data';
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

// El catálogo que recibe Descúbrete: sólo pistas reproducibles, nunca las `soon`.
const CATALOG = {
  audios: PLAYABLE_AUDIOS,
  courses: COURSES,
  experiences: EXPERIENCES,
  products: PRODUCTS,
};

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

  it('can land on every intent and on every frequency, and only on playable audios', () => {
    const intents = new Set<Intent>();
    const audios = new Set<string>();

    for (const answers of allAnswerSets()) {
      const result = recommend(answers, QUESTIONS, CATALOG)!;
      intents.add(result.reading.primary);
      audios.add(result.audio.id);
    }

    expect([...intents].sort()).toEqual([...INTENTS].sort());
    // Una pista por intención: los binaurales y la naturaleza sólo salen si son la afín principal.
    const frequencyIds = PLAYABLE_AUDIOS.filter((audio) => audio.kind === 'frequency').map(
      (audio) => audio.id,
    );
    for (const id of frequencyIds) expect(audios.has(id), id).toBe(true);
  });

  it('la página de Descúbrete pasa al cuestionario sólo pistas reproducibles', () => {
    // La guarda real: la página, no la función, decide qué catálogo recibe.
    const page = readFileSync(
      resolve(process.cwd(), 'src/app/[locale]/descubrete/page.tsx'),
      'utf8',
    );

    expect(page).toContain('audios: PLAYABLE_AUDIOS');
    expect(page).not.toMatch(/audios:\s*AUDIOS\b/);
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
