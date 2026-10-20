import { describe, expect, it } from 'vitest';

import { shiftWaveScale } from '@/lib/atmosphere/veil';

const MARGIN = 1.02;

describe('shiftWaveScale', () => {
  it('desde el centro de un viewport cuadrado llega a la esquina opuesta', () => {
    expect(shiftWaveScale({ x: 0.5, y: 0.5 }, { width: 1000, height: 1000 })).toBeCloseTo(
      Math.SQRT2 * MARGIN,
    );
  });

  it('desde una esquina recorre la diagonal entera', () => {
    expect(shiftWaveScale({ x: 0, y: 0 }, { width: 1000, height: 1000 })).toBeCloseTo(
      2 * Math.SQRT2 * MARGIN,
    );
  });

  it('usa el lado mayor como radio base en viewports no cuadrados', () => {
    expect(shiftWaveScale({ x: 0.5, y: 0.5 }, { width: 1600, height: 900 })).toBeCloseTo(
      (Math.hypot(800, 450) / 800) * MARGIN,
    );
  });

  it('sin origen nace en el centro', () => {
    expect(shiftWaveScale(null, { width: 800, height: 600 })).toBe(
      shiftWaveScale({ x: 0.5, y: 0.5 }, { width: 800, height: 600 }),
    );
  });

  it('acota un origen fuera del viewport a sus bordes', () => {
    expect(shiftWaveScale({ x: 2, y: -1 }, { width: 800, height: 600 })).toBe(
      shiftWaveScale({ x: 1, y: 0 }, { width: 800, height: 600 }),
    );
  });
});
