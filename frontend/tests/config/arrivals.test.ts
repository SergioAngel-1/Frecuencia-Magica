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

  it('los estados reparten los cinco temas: ninguno se queda sin estado', () => {
    expect(ARRIVALS['mood:calm'].atmosphere).toBe('dawn');
    expect(ARRIVALS['mood:tiredness'].atmosphere).toBe('dusk');
    expect(ARRIVALS['mood:nostalgia'].atmosphere).toBe('moon');
    expect(ARRIVALS['mood:sadness'].atmosphere).toBe('night');
    expect(ARRIVALS['mood:joy'].atmosphere).toBe('dawn');
    expect(ARRIVALS['mood:gratitude'].atmosphere).toBe('forest');
    expect(ARRIVALS['mood:clarity'].atmosphere).toBe('moon');
    expect(ARRIVALS['mood:breathe'].atmosphere).toBe('forest');

    const used = new Set(MOOD_IDS.map((id) => ARRIVALS[`mood:${id}`].atmosphere));
    expect(used).toEqual(new Set(ATMOSPHERE_IDS));
  });

  it('la intención fija su atmósfera (R27): Raíz y Renovación en bosque', () => {
    expect(ARRIVALS['intent:grounding'].atmosphere).toBe('forest');
    expect(ARRIVALS['intent:renewal'].atmosphere).toBe('forest');
    expect(ARRIVALS['intent:rest'].atmosphere).toBe('dusk');
    expect(ARRIVALS['intent:bond'].atmosphere).toBe('dusk');
    expect(ARRIVALS['intent:calm'].atmosphere).toBe('dawn');
    expect(ARRIVALS['intent:clarity'].atmosphere).toBe('moon');
  });

  it('«Necesito respirar» abre la práctica de respiración, no una pista', () => {
    expect(ARRIVALS['mood:breathe'].practice).toBe('breathing');
  });

  it('«otra opción» ofrece los cinco temas, de día y de noche, en el orden de la hora', () => {
    expect([...ARRIVAL_ATMOSPHERES.day].sort()).toEqual([...ATMOSPHERE_IDS].sort());
    expect([...ARRIVAL_ATMOSPHERES.night].sort()).toEqual([...ATMOSPHERE_IDS].sort());
    expect(ARRIVAL_ATMOSPHERES.night[0]).toBe('moon');
    expect(ARRIVAL_ATMOSPHERES.day[0]).toBe('dawn');
  });
});
