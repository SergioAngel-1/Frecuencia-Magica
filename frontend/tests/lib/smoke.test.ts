import { describe, expect, it } from 'vitest';

import { DURATION, EASE, STAGGER } from '@/config/motion';

describe('entorno de test', () => {
  it('el entorno de test resuelve el alias @/', () => {
    expect(DURATION).toBeDefined();
    expect(STAGGER).toBeDefined();
    expect(EASE).toBeDefined();
  });

  it('las entradas escalonadas usan los cuatro retardos del prototipo', () => {
    expect([...STAGGER]).toEqual([0.1, 0.25, 0.4, 0.55]);
  });
});
