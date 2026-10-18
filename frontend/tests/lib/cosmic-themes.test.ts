import { describe, expect, it, vi } from 'vitest';

import { ATMOSPHERE_IDS } from '@/config/atmospheres';
import { advanceParticle, createParticles, type Particle } from '@/lib/cosmic/particles';
import { createCosmicScene, type CosmicContext, type CosmicViewport } from '@/lib/cosmic/scene';
import {
  MAX_PARTICLES,
  MAX_STARS,
  SCENE_THEMES,
  particleTotal,
  type ParticleKind,
} from '@/lib/cosmic/themes';

import { parseTriplet, readTokensCss, resolvedTokens } from '../helpers/css-tokens';

const CSS = readTokensCss();

describe('SCENE_THEMES', () => {
  it('has one scene per theme', () => {
    expect(Object.keys(SCENE_THEMES).sort()).toEqual([...ATMOSPHERE_IDS].sort());
  });

  it('keeps the night exactly as the original canvas: 220 ivory stars, 54/28 pollen of the accent', () => {
    const night = SCENE_THEMES.night;

    expect(night.stars).toMatchObject({ count: 220, rgb: [247, 244, 234], alpha: 1 });
    expect(night.groups).toHaveLength(1);
    expect(night.groups[0]).toMatchObject({ kind: 'rise', count: 54, mobile: 28, rgb: null });
    expect(night.nebulae[2]).toBeNull();
  });

  it('draws no stars under the light theme, and still gives it particles', () => {
    expect(SCENE_THEMES.dawn.stars.count).toBe(0);
    expect(particleTotal(SCENE_THEMES.dawn, false)).toBeGreaterThan(0);
  });

  it('never exceeds the animation budget', () => {
    for (const id of ATMOSPHERE_IDS) {
      const theme = SCENE_THEMES[id];

      expect(theme.stars.count, id).toBeLessThanOrEqual(MAX_STARS);
      expect(particleTotal(theme, false), id).toBeLessThanOrEqual(MAX_PARTICLES);
      expect(particleTotal(theme, true), id).toBeLessThanOrEqual(particleTotal(theme, false));
    }
  });

  it('gives every theme its own kind of particle', () => {
    const kinds: Record<string, ParticleKind[]> = Object.fromEntries(
      ATMOSPHERE_IDS.map((id) => [id, SCENE_THEMES[id].groups.map((group) => group.kind)]),
    );

    expect(kinds.night).toEqual(['rise']);
    expect(kinds.dusk).toEqual(['ember']);
    expect(kinds.dawn).toEqual(['mote']);
    expect(kinds.forest).toEqual(['firefly', 'spore']);
  });

  // La escena repite los colores de `--nebula-*` porque un worker no lee CSS: si divergen,
  // el lienzo y la capa de nebulosas del DOM pintarían dos atmósferas distintas.
  it.each(ATMOSPHERE_IDS)('%s repeats the nebula tokens of tokens.css', (id) => {
    const tokens = resolvedTokens(CSS, `[data-atmosphere='${id}']`);
    const names = ['--nebula-a', '--nebula-b', '--nebula-c'] as const;

    SCENE_THEMES[id].nebulae.forEach((rgb, index) => {
      if (rgb === null) return;
      const token = parseTriplet(tokens[names[index]!]!);

      expect(rgb, `${id} ${names[index]}`).toEqual([token.r, token.g, token.b]);
    });
  });
});

describe('advanceParticle by kind', () => {
  const base: Particle = {
    kind: 'rise',
    phase: 1,
    group: 0,
    x: 0.5,
    y: 0.5,
    r: 1,
    vy: 0.05,
    vx: 0.01,
    a: 0.4,
  };

  it('fireflies wander and stay inside the frame after a long time', () => {
    let particle: Particle = { ...base, kind: 'firefly' };

    for (let step = 0; step < 10_000; step++) {
      particle = advanceParticle(particle, 1 / 60, () => 0.5, step / 60);
      expect(particle.x).toBeGreaterThanOrEqual(0);
      expect(particle.x).toBeLessThan(1);
      expect(particle.y).toBeGreaterThanOrEqual(0);
      expect(particle.y).toBeLessThan(1);
    }
  });

  it('spores fall and come back in from the top', () => {
    const falling = advanceParticle({ ...base, kind: 'spore' }, 1 / 60, () => 0.5, 0);
    const wrapped = advanceParticle({ ...base, kind: 'spore', y: 1.03 }, 1 / 60, () => 0.25, 0);

    expect(falling.y).toBeGreaterThan(base.y);
    expect(wrapped.y).toBe(-0.02);
    expect(wrapped.x).toBe(0.25);
  });

  it('embers rise more slowly than pollen and come back in from the bottom', () => {
    const ember = advanceParticle({ ...base, kind: 'ember' }, 1 / 60, () => 0.5, 0);
    const pollen = advanceParticle({ ...base }, 1 / 60, () => 0.5, 0);

    expect(ember.y).toBeLessThan(base.y);
    expect(base.y - ember.y).toBeLessThan(base.y - pollen.y);
    const wrapped = advanceParticle({ ...base, kind: 'ember', y: -0.03 }, 1 / 60, () => 0.7, 0);
    expect(wrapped.y).toBe(1.02);
  });

  it('motes drift to the right and re-enter from the left', () => {
    const drifted = advanceParticle({ ...base, kind: 'mote' }, 1 / 60, () => 0.5, 0);
    const wrapped = advanceParticle({ ...base, kind: 'mote', x: 1.03 }, 1 / 60, () => 0.4, 0);

    expect(drifted.x).toBeGreaterThan(base.x);
    expect(wrapped.x).toBe(-0.02);
    expect(wrapped.y).toBe(0.4);
  });

  it('creates the particles of a kind inside the radius and alpha of its group', () => {
    const particles = createParticles(100, () => 0.5, {
      kind: 'firefly',
      group: 1,
      radius: [1.1, 2.6],
      alpha: [0.35, 0.9],
    });

    for (const particle of particles) {
      expect(particle.kind).toBe('firefly');
      expect(particle.group).toBe(1);
      expect(particle.r).toBeGreaterThanOrEqual(1.1);
      expect(particle.r).toBeLessThanOrEqual(2.6);
      expect(particle.a).toBeGreaterThanOrEqual(0.35);
      expect(particle.a).toBeLessThanOrEqual(0.9);
    }
  });
});

describe('the scene changes theme', () => {
  const viewport: CosmicViewport = { width: 400, height: 300, dpr: 1, small: false };

  /** Contexto 2D falso que sólo cuenta cuántos arcos (estrellas y partículas) se pintan. */
  function fakeContext() {
    const arcs = vi.fn();
    const moveTo = vi.fn();
    const gradient = { addColorStop: vi.fn() };
    const ctx = {
      canvas: { width: 0, height: 0 },
      arc: arcs,
      moveTo,
      beginPath: vi.fn(),
      fill: vi.fn(),
      fillRect: vi.fn(),
      clearRect: vi.fn(),
      setTransform: vi.fn(),
      createRadialGradient: vi.fn(() => gradient),
      fillStyle: '',
      globalAlpha: 1,
    } as unknown as CosmicContext;

    return { ctx, arcs, moveTo };
  }

  it('paints stars and pollen under the night, and only motes under the dawn', () => {
    const night = fakeContext();
    createCosmicScene(night.ctx, viewport, [216, 185, 120], Math.random, 'night').still();
    const dawn = fakeContext();
    createCosmicScene(dawn.ctx, viewport, [216, 185, 120], Math.random, 'dawn').still();

    expect(night.arcs).toHaveBeenCalledTimes(220 + 54);
    expect(dawn.arcs).toHaveBeenCalledTimes(44);
  });

  it('starts every batched star with its own moveTo so fill never joins circles into a polygon', () => {
    const { ctx, moveTo } = fakeContext();
    createCosmicScene(ctx, viewport, [216, 185, 120], Math.random, 'night').still();

    expect(moveTo).toHaveBeenCalledTimes(220);
  });

  it('applies the new theme at once when the frame is still (reduced motion)', () => {
    const { ctx, arcs } = fakeContext();
    const scene = createCosmicScene(ctx, viewport, [216, 185, 120], Math.random, 'night');

    scene.setTheme('forest');
    arcs.mockClear();
    scene.still();

    expect(arcs).toHaveBeenCalledTimes(40 + 24 + 24);
  });

  it('fades the old theme out before the new one comes in when the loop runs', () => {
    const { ctx, arcs } = fakeContext();
    const scene = createCosmicScene(ctx, viewport, [216, 185, 120], Math.random, 'night');

    scene.frame(0);
    scene.setTheme('dawn');
    arcs.mockClear();
    scene.frame(16);
    // Todavía se pinta la noche (apagándose): 220 estrellas y 54 partículas.
    expect(arcs).toHaveBeenCalledTimes(220 + 54);

    for (let t = 32; t < 1500; t += 16) scene.frame(t);
    arcs.mockClear();
    scene.frame(1600);
    expect(arcs).toHaveBeenCalledTimes(44);
  });
});
