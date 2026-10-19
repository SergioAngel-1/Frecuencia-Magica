import { describe, expect, it } from 'vitest';

import { ARRIVALS, type ArrivalKey } from '@/config/arrivals';
import { AUDIOS, isPlayable } from '@/data/audios';
import { respondToArrival } from '@/lib/arrival/respond';
import { MOOD_IDS } from '@/types/mood';
import type { Audio, AudioKind, Intent } from '@/types/content';

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

  it('una entrada desconocida cae a la respuesta neutra de calma', () => {
    const unknown = 'mood:inventado' as ArrivalKey;
    const response = respondToArrival(unknown, { catalog: AUDIOS, hour: DAY });
    const calm = respondToArrival('mood:calm', { catalog: AUDIOS, hour: DAY });

    expect(response.atmosphere).toBe(calm.atmosphere);
    expect(response.alternatives.map((a) => a.id)).toEqual(calm.alternatives.map((a) => a.id));
    expect(response.explanationKey).toBe(calm.explanationKey);
  });

  it('«otra opción» ofrece los otros cuatro temas, y de noche la luna va primero', () => {
    const night = respondToArrival('mood:calm', { catalog: AUDIOS, hour: NIGHT });
    expect(night.otherAtmospheres[0]).toBe('moon');
    expect(night.otherAtmospheres).toHaveLength(4);

    const day = respondToArrival('mood:calm', { catalog: AUDIOS, hour: DAY });
    expect(day.otherAtmospheres[0]).toBe('forest');
    expect(day.otherAtmospheres).toContain('moon');
    expect(day.otherAtmospheres).toHaveLength(4);

    for (const hour of [21, 23, 0, 4]) {
      const response = respondToArrival('mood:calm', { catalog: AUDIOS, hour });
      expect(response.otherAtmospheres[0], `hora ${hour}`).toBe('moon');
    }
    for (const hour of [5, 12, 18, 20]) {
      const response = respondToArrival('mood:calm', { catalog: AUDIOS, hour });
      expect(response.otherAtmospheres[0], `hora ${hour}`).not.toBe('moon');
    }
  });

  it('otras atmósferas nunca incluyen la de la propia respuesta', () => {
    const response = respondToArrival('mood:calm', { catalog: AUDIOS, hour: NIGHT });
    expect(response.otherAtmospheres).not.toContain(response.atmosphere);
  });
});

describe('respondToArrival: pistas por intención (I3b)', () => {
  const byKind = (audios: readonly Audio[], kind: AudioKind) =>
    audios.find((audio) => audio.kind === kind)?.id;

  it('Descansar (intención rest) ofrece a4 como frecuencia, no a1', () => {
    const response = respondToArrival('intent:rest', { catalog: AUDIOS, hour: DAY });
    expect(byKind(response.alternatives, 'frequency')).toBe('a4');
  });

  it('Raíz (intención grounding) ofrece a3 como frecuencia', () => {
    const response = respondToArrival('intent:grounding', { catalog: AUDIOS, hour: DAY });
    expect(byKind(response.alternatives, 'frequency')).toBe('a3');
  });

  it('Renovación ofrece la lluvia (n2), que lleva renewal, no el mar (n1)', () => {
    const response = respondToArrival('intent:renewal', { catalog: AUDIOS, hour: DAY });
    expect(byKind(response.alternatives, 'nature')).toBe('n2');
  });

  it('Raíz en bosque prefiere la lluvia (n2) al mar mientras no hay bosque', () => {
    const response = respondToArrival('intent:grounding', { catalog: AUDIOS, hour: DAY });
    expect(byKind(response.alternatives, 'nature')).toBe('n2');
  });

  it('un estado del diario busca su intención: Cansancio (rest) ofrece a4', () => {
    const response = respondToArrival('mood:tiredness', { catalog: AUDIOS, hour: DAY });
    expect(byKind(response.alternatives, 'frequency')).toBe('a4');
  });

  it('el relleno binaural elige por intención: con Raíz, b2 antes que b1', () => {
    const catalog = AUDIOS.filter((audio) => audio.kind !== 'nature');
    const response = respondToArrival('intent:grounding', { catalog, hour: DAY });
    expect(response.alternatives.map((audio) => audio.id)).toEqual(['b2', 'a3']);
  });

  it('la intención sólo ordena: si ninguna pista casa, toma la primera reproducible del tipo', () => {
    const response = respondToArrival('mood:joy', { catalog: AUDIOS, hour: DAY });
    expect(response.alternatives[0]!.kind).toBe('nature');
    expect(response.alternatives[0]!.id).toBe('n1');
  });

  it('la pista del disco de Descúbrete va primera cuando casa con la intención', () => {
    const response = respondToArrival('intent:rest', {
      catalog: AUDIOS,
      hour: DAY,
      featuredId: 'a4',
    });
    expect(response.alternatives[0]!.id).toBe('a4');
    expect(response.alternatives.map((audio) => audio.id)).toContain('n1');
  });

  it('la pista destacada se ignora si su intención no casa o no es reproducible', () => {
    const wrongIntent = respondToArrival('intent:rest', {
      catalog: AUDIOS,
      hour: DAY,
      featuredId: 'a1',
    });
    expect(wrongIntent.alternatives.map((audio) => audio.id)).not.toContain('a1');

    const notPlayable = respondToArrival('intent:rest', {
      catalog: AUDIOS,
      hour: DAY,
      featuredId: 'g2',
    });
    expect(notPlayable.alternatives.map((audio) => audio.id)).not.toContain('g2');
  });

  it('ninguna pista «Próximamente» entra, ni siquiera con intención que casa', () => {
    for (const intent of ['bond', 'renewal', 'clarity', 'calm'] as const) {
      const response = respondToArrival(`intent:${intent}`, { catalog: AUDIOS, hour: DAY });
      for (const audio of response.alternatives) {
        expect(audio.availability, `${intent}: ${audio.id}`).toBe('ready');
      }
    }
  });
});

describe('respondToArrival: frecuencia siempre al final (M6)', () => {
  it('sin ninguna naturaleza en el catálogo, la frecuencia nunca va primera', () => {
    const catalog = AUDIOS.filter((audio) => audio.kind !== 'nature');
    for (const key of ALL_KEYS) {
      const response = respondToArrival(key, { catalog, hour: DAY });
      expect(response.alternatives[0]!.kind, key).not.toBe('frequency');
      expect(kindsOf(response.alternatives).size, key).toBeGreaterThanOrEqual(2);
    }
  });

  it('con naturaleza, la frecuencia de la tabla va después de las demás', () => {
    const response = respondToArrival('mood:calm', { catalog: READY_CATALOG, hour: DAY });
    const kinds = response.alternatives.map((audio) => audio.kind);
    expect(kinds.indexOf('frequency')).toBe(kinds.length - 1);
  });
});
