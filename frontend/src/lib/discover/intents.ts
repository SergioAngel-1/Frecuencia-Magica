import type { Intent, IntentAffine, Question } from '@/types/content';

/**
 * Orden canónico de las intenciones. Resuelve los empates de forma estable:
 * con la misma puntuación gana la que aparece antes aquí.
 */
export const INTENTS: readonly Intent[] = [
  'calm',
  'grounding',
  'clarity',
  'rest',
  'bond',
  'renewal',
];

/** Peso de cada posición de `QuestionOption.intents`: principal y secundaria. */
const OPTION_WEIGHTS = [2, 1] as const;

export type IntentScores = Record<Intent, number>;

/** Lectura del quiz: la intención que manda y la que la matiza. */
export type QuizReading = {
  primary: Intent;
  secondary: Intent;
};

function emptyScores(): IntentScores {
  return Object.fromEntries(INTENTS.map((intent) => [intent, 0])) as IntentScores;
}

/**
 * Suma las intenciones de cada respuesta. Las respuestas que no casan con
 * una pregunta u opción conocida se ignoran en vez de romper el resultado.
 */
export function scoreAnswers(
  answers: Readonly<Record<string, number>>,
  questions: readonly Question[],
): IntentScores {
  const scores = emptyScores();

  for (const question of questions) {
    const optionIndex = answers[question.id];
    if (optionIndex === undefined) continue;

    const option = question.options[optionIndex];
    option?.intents.forEach((intent, position) => {
      scores[intent] += OPTION_WEIGHTS[position] ?? 0;
    });
  }

  return scores;
}

/** Intenciones de mayor a menor puntuación; los empates, en orden canónico. */
function rankIntents(scores: IntentScores): Intent[] {
  return [...INTENTS].sort((a, b) => scores[b] - scores[a]);
}

/** La intención dominante y la segunda, siempre distintas. */
export function readIntents(scores: IntentScores): QuizReading {
  const [primary, secondary] = rankIntents(scores);

  return { primary: primary!, secondary: secondary! };
}

/** Posición de una intención en la lista de un ítem; ausente, al final. */
function affinity(item: IntentAffine, intent: Intent): number {
  const index = item.intents.indexOf(intent);
  return index === -1 ? Number.POSITIVE_INFINITY : index;
}

/**
 * El ítem que mejor acompaña la lectura: primero el que tiene la intención
 * principal más arriba en su lista, luego la secundaria y, a igualdad, el
 * orden del catálogo. Con un catálogo no vacío siempre devuelve uno.
 */
export function pickByIntent<T extends IntentAffine>(
  items: readonly T[],
  reading: QuizReading,
): T | undefined {
  let best: T | undefined;

  for (const item of items) {
    if (!best) {
      best = item;
      continue;
    }

    const byPrimary = affinity(item, reading.primary) - affinity(best, reading.primary);
    const bySecondary = affinity(item, reading.secondary) - affinity(best, reading.secondary);

    if (byPrimary < 0 || (byPrimary === 0 && bySecondary < 0)) best = item;
  }

  return best;
}
