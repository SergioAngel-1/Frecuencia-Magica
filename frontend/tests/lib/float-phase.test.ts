import { describe, expect, it } from 'vitest';

import { AUDIOS } from '@/data';
import { floatPhase } from '@/lib/player/float-phase';

describe('floatPhase', () => {
  it('es un retardo negativo en segundos: la esfera arranca ya a mitad de su vaivén', () => {
    expect(floatPhase('a1')).toMatch(/^-\d+(\.\d+)?s$/);
  });

  it('es estable: el mismo id da siempre la misma fase (sin desajuste de hidratación)', () => {
    expect(floatPhase('a7')).toBe(floatPhase('a7'));
  });

  it('reparte las esferas del Resonario en varias fases, no al unísono', () => {
    const phases = new Set(AUDIOS.map((audio) => floatPhase(audio.id)));

    expect(phases.size).toBeGreaterThanOrEqual(4);
  });
});
