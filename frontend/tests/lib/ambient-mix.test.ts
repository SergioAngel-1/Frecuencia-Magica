import { describe, expect, it } from 'vitest';

import { ambientAudible } from '@/lib/audio/ambient-mix';

describe('ambientAudible', () => {
  it('el drone suena con el ambiente activado y el reproductor en silencio', () => {
    expect(ambientAudible(true, false)).toBe(true);
  });

  it('se calla mientras suena una frecuencia: nunca dos sonidos a la vez', () => {
    expect(ambientAudible(true, true)).toBe(false);
  });

  it('con el ambiente apagado no suena nunca', () => {
    expect(ambientAudible(false, false)).toBe(false);
    expect(ambientAudible(false, true)).toBe(false);
  });
});
