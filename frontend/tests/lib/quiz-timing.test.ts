import { describe, expect, it } from 'vitest';

import { getTuningTiming } from '@/lib/quiz-timing';

describe('getTuningTiming', () => {
  it('mantiene la sintonización completa con movimiento normal', () => {
    expect(getTuningTiming(false)).toEqual({ reveal: 1800, finish: 3000 });
  });

  it('acorta la sintonización cuando se pide movimiento reducido', () => {
    expect(getTuningTiming(true)).toEqual({ reveal: 0, finish: 250 });
  });
});
