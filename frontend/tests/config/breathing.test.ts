import { describe, expect, it } from 'vitest';

import { BREATHING, BREATHING_CYCLE_SECONDS } from '@/config/breathing';

describe('BREATHING', () => {
  it('las duraciones de cada fase suman un ciclo mayor que cero', () => {
    expect(BREATHING_CYCLE_SECONDS).toBe(BREATHING.inhale + BREATHING.hold + BREATHING.exhale);
    expect(BREATHING_CYCLE_SECONDS).toBeGreaterThan(0);
  });

  it('cada fase entra en un rango razonable para respirar sin prisa', () => {
    for (const seconds of [BREATHING.inhale, BREATHING.hold, BREATHING.exhale]) {
      expect(Number.isInteger(seconds)).toBe(true);
      expect(seconds).toBeGreaterThanOrEqual(2);
      expect(seconds).toBeLessThanOrEqual(10);
    }
  });

  it('exhalar dura al menos tanto como inhalar: la salida es la parte que calma', () => {
    expect(BREATHING.exhale).toBeGreaterThanOrEqual(BREATHING.inhale);
  });

  it('el número de rondas es un entero entre 1 y 10', () => {
    expect(Number.isInteger(BREATHING.rounds)).toBe(true);
    expect(BREATHING.rounds).toBeGreaterThanOrEqual(1);
    expect(BREATHING.rounds).toBeLessThanOrEqual(10);
  });
});
