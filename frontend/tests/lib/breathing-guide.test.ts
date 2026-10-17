import { describe, expect, it } from 'vitest';

import { BREATHING } from '@/config/breathing';
import {
  advanceBreath,
  BREATH_ORB_SCALE,
  currentBreathPhase,
  initialBreath,
  orbScale,
} from '@/lib/breathing/guide';

describe('escala del orbe por fase (M2)', () => {
  it('inhalar y sostener llevan el orbe a su tamaño grande; exhalar lo devuelve', () => {
    expect(orbScale('inhale')).toBe(BREATH_ORB_SCALE);
    expect(orbScale('hold')).toBe(BREATH_ORB_SCALE);
    expect(orbScale('exhale')).toBe(1);
  });

  it('la amplitud es perceptible: de 1 a unos 1,25', () => {
    expect(BREATH_ORB_SCALE).toBeGreaterThanOrEqual(1.2);
    expect(BREATH_ORB_SCALE).toBeLessThanOrEqual(1.3);
  });

  it('terminada la guía (sin fase) el orbe queda en reposo', () => {
    expect(orbScale(null)).toBe(1);
  });
});

describe('guía de respiración (avance de fases)', () => {
  it('empieza inhalando en la primera ronda', () => {
    const state = initialBreath();
    expect(currentBreathPhase(state)).toEqual({ phase: 'inhale', seconds: BREATHING.inhale });
  });

  it('recorre inhalar, sostener y exhalar, y luego la ronda siguiente', () => {
    let state = initialBreath();
    const phases: string[] = [];
    for (let i = 0; i < 4; i += 1) {
      phases.push(currentBreathPhase(state)?.phase ?? 'done');
      state = advanceBreath(state, BREATHING.rounds);
    }
    expect(phases).toEqual(['inhale', 'hold', 'exhale', 'inhale']);
  });

  it('tras todas las rondas termina y no vuelve a empezar solo', () => {
    let state = initialBreath();
    for (let i = 0; i < BREATHING.rounds * 3; i += 1) {
      state = advanceBreath(state, BREATHING.rounds);
    }
    expect(currentBreathPhase(state)).toBeNull();
    expect(currentBreathPhase(advanceBreath(state, BREATHING.rounds))).toBeNull();
  });
});
