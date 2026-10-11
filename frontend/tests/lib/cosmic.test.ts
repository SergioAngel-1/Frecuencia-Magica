import { describe, expect, it } from 'vitest';

import { hexToRgb } from '@/lib/cosmic/colors';
import { advanceParticle, createParticles, createStars } from '@/lib/cosmic/particles';
import { createCosmicDriver, type CosmicScene } from '@/lib/cosmic/scene';

/** Generador lineal congruente sembrado: determinista para los tests. */
function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

describe('hexToRgb', () => {
  it('convierte hex a rgb', () => {
    expect(hexToRgb('#D8B978')).toEqual([216, 185, 120]);
    expect(hexToRgb('96C6BC')).toEqual([150, 198, 188]);
  });
});

describe('createStars', () => {
  it('crea la cantidad pedida de estrellas', () => {
    expect(createStars(220, seededRandom(1)).length).toBe(220);
  });

  it('las estrellas caen dentro del rango de radio del prototipo', () => {
    const stars = createStars(500, seededRandom(2));
    for (const star of stars) {
      expect(star.r).toBeGreaterThanOrEqual(0.3);
      expect(star.r).toBeLessThanOrEqual(1.4);
    }
  });

  it('las estrellas usan coordenadas normalizadas', () => {
    const stars = createStars(500, seededRandom(3));
    for (const star of stars) {
      expect(star.x).toBeGreaterThanOrEqual(0);
      expect(star.x).toBeLessThanOrEqual(1);
      expect(star.y).toBeGreaterThanOrEqual(0);
      expect(star.y).toBeLessThanOrEqual(1);
    }
  });

  it('la generación es determinista con un random inyectado', () => {
    expect(createStars(5, seededRandom(42))).toEqual(createStars(5, seededRandom(42)));
  });
});

describe('createParticles / advanceParticle', () => {
  it('las partículas ascienden', () => {
    const particles = createParticles(200, seededRandom(4));
    for (const particle of particles) {
      expect(particle.vy).toBeGreaterThanOrEqual(0.02);
      expect(particle.vy).toBeLessThanOrEqual(0.1);
      const next = advanceParticle(particle);
      expect(next.y).toBeLessThan(particle.y);
    }
  });

  it('la partícula reaparece por abajo al salir por arriba', () => {
    const particle = { x: 0.5, y: -0.03, r: 1, vy: 0.05, vx: 0, a: 0.4 };
    expect(advanceParticle(particle).y).toBe(1.02);
  });
});

describe('createCosmicDriver', () => {
  /** Reloj manual: guarda el callback pendiente y lo dispara con el timestamp dado. */
  function setup() {
    const calls = { frame: [] as number[], still: 0 };
    const scene: CosmicScene = {
      resize: () => {},
      setAccent: () => {},
      frame: (timestamp) => calls.frame.push(timestamp),
      still: () => {
        calls.still += 1;
      },
    };
    let pending: ((timestamp: number) => void) | null = null;
    const driver = createCosmicDriver(
      scene,
      (callback) => {
        pending = callback;
        return 1;
      },
      () => {
        pending = null;
      },
    );
    const fire = (timestamp: number) => pending?.(timestamp);

    return { calls, driver, fire, isScheduled: () => pending !== null };
  }

  it('paints one frame per tick at 60 Hz', () => {
    const { calls, fire } = setup();

    fire(0);
    fire(16.7);
    fire(33.4);

    expect(calls.frame).toEqual([0, 16.7, 33.4]);
  });

  it('skips the in-between ticks of a 120 Hz display', () => {
    const { calls, fire } = setup();

    fire(0);
    fire(8.3);
    fire(16.6);
    fire(24.9);

    expect(calls.frame).toEqual([0, 16.6]);
  });

  it('stops the loop while the tab is hidden and resumes after', () => {
    const { driver, isScheduled } = setup();

    driver.setVisible(false);
    expect(isScheduled()).toBe(false);

    driver.setVisible(true);
    expect(isScheduled()).toBe(true);
  });

  it('paints a single still frame with reduced motion', () => {
    const { calls, driver, fire, isScheduled } = setup();

    driver.setReduced(true);
    fire(16.7);

    expect(isScheduled()).toBe(false);
    expect(calls).toEqual({ frame: [], still: 1 });

    driver.refresh();
    expect(calls.still).toBe(2);
  });
});
