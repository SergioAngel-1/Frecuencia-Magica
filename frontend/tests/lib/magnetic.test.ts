import { describe, expect, it } from 'vitest';

import { magneticOffset } from '@/lib/magnetic-offset';

const MAX = 8;

/** Rectángulo de referencia: 100x60 centrado en (50, 130) del viewport. */
const rect = { x: 0, y: 100, width: 100, height: 60 };

describe('magneticOffset', () => {
  it('en el centro del elemento no hay desplazamiento', () => {
    const center = { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };

    expect(magneticOffset(center, rect, MAX)).toEqual({ x: 0, y: 0 });
  });

  it('nunca supera el máximo permitido', () => {
    // Puntero en una esquina lejana, muy fuera del propio rectángulo.
    const farCorner = { x: rect.x + rect.width * 5, y: rect.y + rect.height * 5 };

    const { x, y } = magneticOffset(farCorner, rect, MAX);
    const magnitude = Math.hypot(x, y);

    expect(magnitude).toBeLessThanOrEqual(MAX);
  });

  it('el desplazamiento apunta hacia el puntero', () => {
    const center = { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
    const pointerRight = { x: center.x + 20, y: center.y };

    const { x } = magneticOffset(pointerRight, rect, MAX);

    expect(x).toBeGreaterThan(0);
  });

  it('el desplazamiento es proporcional a la distancia', () => {
    const center = { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
    const halfWidth = rect.width / 2;

    const pointerNear = { x: center.x + halfWidth * 0.25, y: center.y };
    const pointerFar = { x: center.x + halfWidth * 0.75, y: center.y };

    const near = magneticOffset(pointerNear, rect, MAX);
    const far = magneticOffset(pointerFar, rect, MAX);

    expect(Math.abs(near.x)).toBeLessThan(Math.abs(far.x));
  });
});
