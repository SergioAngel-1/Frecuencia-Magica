import { describe, expect, it } from 'vitest';

import { ARRIVALS, ARRIVAL_ATMOSPHERES, type ArrivalKey } from '@/config/arrivals';
import { ATMOSPHERE_IDS } from '@/config/atmospheres';
import { MOOD_IDS } from '@/types/mood';
import type { Intent } from '@/types/content';

const INTENTS: readonly Intent[] = ['calm', 'grounding', 'clarity', 'rest', 'bond', 'renewal'];

describe('registro de llegadas (ARRIVALS)', () => {
  it('toda mood tiene su entrada, en el orden de MOOD_IDS', () => {
    expect(MOOD_IDS).toEqual([
      'calm',
      'tiredness',
      'nostalgia',
      'sadness',
      'joy',
      'gratitude',
      'clarity',
      'breathe',
    ]);
    for (const id of MOOD_IDS) {
      expect(ARRIVALS, `mood:${id}`).toHaveProperty([`mood:${id}`]);
    }
  });

  it('toda intención de Descúbrete tiene su entrada', () => {
    for (const intent of INTENTS) {
      expect(ARRIVALS, `intent:${intent}`).toHaveProperty([`intent:${intent}`]);
    }
  });

  it('no hay entradas huérfanas: sólo moods e intents conocidos', () => {
    const expected = new Set<ArrivalKey>([
      ...MOOD_IDS.map((id) => `mood:${id}` as const),
      ...INTENTS.map((id) => `intent:${id}` as const),
    ]);
    expect(new Set(Object.keys(ARRIVALS))).toEqual(expected);
  });

  it('cada entrada apunta a una atmósfera registrada y a una frase de explicación', () => {
    for (const [key, entry] of Object.entries(ARRIVALS)) {
      expect(ATMOSPHERE_IDS, key).toContain(entry.atmosphere);
      expect(entry.explanationKey, key).toMatch(/^(moods|intents)\.[a-z]+\.explanation$/);
    }
  });

  it('la tabla de §5.3 fija las atmósferas de los estados', () => {
    expect(ARRIVALS['mood:tiredness'].atmosphere).toBe('dusk');
    expect(ARRIVALS['mood:calm'].atmosphere).toBe('dawn');
    expect(ARRIVALS['mood:nostalgia'].atmosphere).toBe('dusk');
    expect(ARRIVALS['mood:sadness'].atmosphere).toBe('dusk');
    expect(ARRIVALS['mood:joy'].atmosphere).toBe('dawn');
    expect(ARRIVALS['mood:gratitude'].atmosphere).toBe('dawn');
    expect(ARRIVALS['mood:clarity'].atmosphere).toBe('dawn');
    expect(ARRIVALS['mood:breathe'].atmosphere).toBe('dawn');
  });

  it('la intención fija su atmósfera (R27): Raíz y Renovación en bosque', () => {
    expect(ARRIVALS['intent:grounding'].atmosphere).toBe('forest');
    expect(ARRIVALS['intent:renewal'].atmosphere).toBe('forest');
    expect(ARRIVALS['intent:rest'].atmosphere).toBe('dusk');
    expect(ARRIVALS['intent:calm'].atmosphere).toBe('dawn');
    expect(ARRIVALS['intent:clarity'].atmosphere).toBe('dawn');
    expect(ARRIVALS['intent:bond'].atmosphere).toBe('dawn');
  });

  it('«Necesito respirar» abre la práctica de respiración, no una pista', () => {
    expect(ARRIVALS['mood:breathe'].practice).toBe('breathing');
  });

  it('las atmósferas que se ofrecen como otra opción son de la paleta de ambientes', () => {
    expect(ARRIVAL_ATMOSPHERES).toEqual(['dusk', 'dawn', 'forest', 'moon']);
  });
});
