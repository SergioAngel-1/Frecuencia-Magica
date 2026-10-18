import { describe, expect, it } from 'vitest';

import { allowsLoopVideo, shouldPlayLoop } from '@/lib/video/loop';

describe('allowsLoopVideo', () => {
  it('es falso con movimiento reducido', () => {
    expect(allowsLoopVideo({ reduced: true, saveData: false })).toBe(false);
  });

  it('es falso con ahorro de datos', () => {
    expect(allowsLoopVideo({ reduced: false, saveData: true })).toBe(false);
  });

  it('es falso con ambas cosas', () => {
    expect(allowsLoopVideo({ reduced: true, saveData: true })).toBe(false);
  });

  it('es verdadero sólo si ninguna de las dos se da', () => {
    expect(allowsLoopVideo({ reduced: false, saveData: false })).toBe(true);
  });
});

describe('shouldPlayLoop', () => {
  it('sin fuente no hay loop aunque todo lo permita', () => {
    expect(shouldPlayLoop(undefined, { reduced: false, saveData: false })).toBe(false);
    expect(shouldPlayLoop('', { reduced: false, saveData: false })).toBe(false);
  });

  it('con fuente, sólo suena si las condiciones lo permiten', () => {
    expect(shouldPlayLoop('/loop.mp4', { reduced: false, saveData: false })).toBe(true);
    expect(shouldPlayLoop('/loop.mp4', { reduced: true, saveData: false })).toBe(false);
    expect(shouldPlayLoop('/loop.mp4', { reduced: false, saveData: true })).toBe(false);
  });
});
