import { describe, expect, it } from 'vitest';

import { ARRIVALS, type ArrivalKey } from '@/config/arrivals';
import { AUDIOS, isPlayable } from '@/data/audios';
import { respondToArrival } from '@/lib/arrival/respond';
import { MOOD_IDS } from '@/types/mood';
import type { Audio, Intent } from '@/types/content';

const INTENTS: readonly Intent[] = ['calm', 'grounding', 'clarity', 'rest', 'bond', 'renewal'];
const ALL_KEYS: readonly ArrivalKey[] = [
  ...MOOD_IDS.map((id) => `mood:${id}` as const),
  ...INTENTS.map((id) => `intent:${id}` as const),
];

/** El catálogo con las pistas `soon` simuladas como listas, con fuente. */
const READY_CATALOG: readonly Audio[] = AUDIOS.map((audio) => ({
  ...audio,
  availability: 'ready',
  source: audio.source ?? { type: 'file', src: '/audio/simulado.mp3' },
}));

const NIGHT = 23;
const DAY = 12;

function kindsOf(audios: readonly Audio[]): Set<string> {
  return new Set(audios.map((audio) => audio.kind));
}

describe('respondToArrival', () => {
  for (const catalogName of ['real', 'con pistas listas simuladas'] as const) {
    const catalog = catalogName === 'real' ? AUDIOS : READY_CATALOG;

    describe(`catálogo ${catalogName}`, () => {
      for (const key of ALL_KEYS) {
        it(`${key}: ≥ 2 tipos distintos, sólo reproducibles y nunca frequency primero`, () => {
          const response = respondToArrival(key, { catalog, hour: DAY });

          expect(kindsOf(response.alternatives).size).toBeGreaterThanOrEqual(2);
          for (const audio of response.alternatives) {
            expect(isPlayable(audio)).toBe(true);
          }
          expect(response.alternatives[0]!.kind).not.toBe('frequency');
        });

        it(`${key}: no ofrece más de tres alternativas`, () => {
          const response = respondToArrival(key, { catalog, hour: DAY });
          expect(response.alternatives.length).toBeLessThanOrEqual(3);
        });
      }
    });
  }

  it('devuelve la atmósfera de la entrada', () => {
    const response = respondToArrival('mood:tiredness', { catalog: AUDIOS, hour: DAY });
    expect(response.atmosphere).toBe('dusk');
    expect(response.explanationKey).toBe(ARRIVALS['mood:tiredness'].explanationKey);
  });

  it('sigue el orden de la tabla: naturaleza antes que frecuencia en Calma', () => {
    const response = respondToArrival('mood:calm', { catalog: AUDIOS, hour: DAY });
    expect(response.alternatives.map((audio) => audio.kind)).toEqual(['nature', 'frequency']);
  });

  it('con melodías listas, la tabla manda: la melodía va después de la naturaleza en Calma', () => {
    const response = respondToArrival('mood:calm', { catalog: READY_CATALOG, hour: DAY });
    expect(response.alternatives[0]!.kind).toBe('nature');
    expect(response.alternatives[1]!.kind).toBe('melody');
  });

  it('salta lo no reproducible: Tristeza (melodía y guiada no suenan) rellena con naturaleza y binaural', () => {
    const response = respondToArrival('mood:sadness', { catalog: AUDIOS, hour: DAY });
    expect(response.alternatives.map((audio) => audio.kind)).toEqual(['nature', 'binaural']);
  });

  it('«Necesito respirar» (práctica, no pista) no entra en las alternativas', () => {
    const response = respondToArrival('mood:breathe', { catalog: AUDIOS, hour: DAY });
    expect(response.practice).toBe('breathing');
    expect(response.alternatives.every((audio) => audio.kind !== 'guided')).toBe(true);
    expect(response.alternatives.length).toBeGreaterThanOrEqual(2);
  });

  it('una entrada desconocida cae a la respuesta neutra de calma', () => {
    const unknown = 'mood:inventado' as ArrivalKey;
    const response = respondToArrival(unknown, { catalog: AUDIOS, hour: DAY });
    const calm = respondToArrival('mood:calm', { catalog: AUDIOS, hour: DAY });

    expect(response.atmosphere).toBe(calm.atmosphere);
    expect(response.alternatives.map((a) => a.id)).toEqual(calm.alternatives.map((a) => a.id));
    expect(response.explanationKey).toBe(calm.explanationKey);
  });

  it('`moon` sólo se ofrece entre las 21 h y las 5 h, y primero', () => {
    const night = respondToArrival('mood:calm', { catalog: AUDIOS, hour: NIGHT });
    expect(night.otherAtmospheres[0]).toBe('moon');

    for (const hour of [21, 23, 0, 4]) {
      const response = respondToArrival('mood:calm', { catalog: AUDIOS, hour });
      expect(response.otherAtmospheres, `hora ${hour}`).toContain('moon');
    }
    for (const hour of [5, 12, 18, 20]) {
      const response = respondToArrival('mood:calm', { catalog: AUDIOS, hour });
      expect(response.otherAtmospheres, `hora ${hour}`).not.toContain('moon');
    }
  });

  it('otras atmósferas nunca incluyen la de la propia respuesta', () => {
    const response = respondToArrival('mood:calm', { catalog: AUDIOS, hour: NIGHT });
    expect(response.otherAtmospheres).not.toContain(response.atmosphere);
  });
});
