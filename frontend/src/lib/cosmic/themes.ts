import type { AtmosphereId } from '@/types/atmosphere';

import type { Rgb } from './colors';

/**
 * Cómo se mueve y se pinta una partícula. Cada tema elige las suyas:
 *
 * - `rise`: asciende en línea casi recta (el polen de la noche, el polvo de plata de la luna).
 * - `ember`: asciende lenta, se mece y titila (las brasas del atardecer).
 * - `mote`: deriva en diagonal y respira (las motas de luz del amanecer).
 * - `firefly`: vaga por una trayectoria suave y pulsa (las luciérnagas del bosque).
 * - `spore`: cae despacio y se mece (las esporas del bosque).
 */
export type ParticleKind = 'rise' | 'ember' | 'mote' | 'firefly' | 'spore';

/** Un grupo de partículas del mismo tipo. */
export type ParticleGroup = {
  kind: ParticleKind;
  /** Cuántas en escritorio y por debajo de 768 px. */
  count: number;
  mobile: number;
  /** Color; `null` toma el acento del realm (la noche, como siempre). */
  rgb: Rgb | null;
  /** Rango del radio en píxeles. */
  radius: readonly [number, number];
  /** Rango del alfa base. */
  alpha: readonly [number, number];
};

/** La escena viva de un tema: estrellas, partículas y nebulosas del lienzo. */
export type SceneTheme = {
  stars: {
    /** Cuántas de las 220 estrellas se pintan. */
    count: number;
    rgb: Rgb;
    /** Multiplicador del alfa base. */
    alpha: number;
    /** Cuánto parpadean (0–1). */
    twinkle: number;
  };
  groups: readonly ParticleGroup[];
  /** Las tres nebulosas del lienzo; `null` toma el acento del realm. */
  nebulae: readonly [Rgb | null, Rgb | null, Rgb | null];
  nebulaAlpha: number;
};

/** Techo de estrellas y de partículas por tema (presupuesto 16.4). */
export const MAX_STARS = 220;
export const MAX_PARTICLES = 54;

/**
 * Las cinco escenas. La noche es la de siempre, sin cambios. Los colores de las
 * nebulosas repiten `--nebula-a|b|c` de `tokens.css` (la tercera de la noche es el
 * acento del realm); `tests/lib/cosmic-themes.test.ts` comprueba que coinciden.
 */
export const SCENE_THEMES: Record<AtmosphereId, SceneTheme> = {
  night: {
    stars: { count: 220, rgb: [247, 244, 234], alpha: 1, twinkle: 0.6 },
    groups: [
      { kind: 'rise', count: 54, mobile: 28, rgb: null, radius: [0.6, 2.2], alpha: [0.15, 0.6] },
    ],
    nebulae: [[150, 198, 188], [185, 176, 214], null],
    nebulaAlpha: 0.11,
  },
  dusk: {
    stars: { count: 70, rgb: [255, 236, 214], alpha: 0.7, twinkle: 0.5 },
    groups: [
      {
        kind: 'ember',
        count: 40,
        mobile: 22,
        rgb: [240, 170, 120],
        radius: [1, 2.8],
        alpha: [0.35, 0.85],
      },
    ],
    nebulae: [
      [214, 120, 130],
      [240, 170, 110],
      [200, 130, 160],
    ],
    nebulaAlpha: 0.18,
  },
  dawn: {
    stars: { count: 0, rgb: [255, 255, 255], alpha: 0, twinkle: 0 },
    groups: [
      {
        kind: 'mote',
        count: 44,
        mobile: 24,
        rgb: [168, 104, 52],
        radius: [1.2, 3.4],
        alpha: [0.3, 0.65],
      },
    ],
    nebulae: [
      [226, 150, 140],
      [238, 196, 130],
      [214, 164, 190],
    ],
    nebulaAlpha: 0.26,
  },
  moon: {
    stars: { count: 150, rgb: [214, 224, 240], alpha: 1, twinkle: 0.8 },
    groups: [
      {
        kind: 'rise',
        count: 26,
        mobile: 14,
        rgb: [207, 216, 230],
        radius: [0.6, 2],
        alpha: [0.2, 0.6],
      },
    ],
    nebulae: [
      [150, 175, 210],
      [207, 216, 230],
      [185, 176, 214],
    ],
    nebulaAlpha: 0.14,
  },
  forest: {
    stars: { count: 40, rgb: [235, 240, 215], alpha: 0.5, twinkle: 0.5 },
    groups: [
      {
        kind: 'firefly',
        count: 24,
        mobile: 12,
        rgb: [222, 232, 140],
        radius: [1.6, 3.4],
        alpha: [0.55, 1],
      },
      {
        kind: 'spore',
        count: 24,
        mobile: 12,
        rgb: [200, 225, 190],
        radius: [0.6, 1.6],
        alpha: [0.2, 0.5],
      },
    ],
    nebulae: [
      [120, 180, 140],
      [216, 196, 138],
      [150, 198, 188],
    ],
    nebulaAlpha: 0.16,
  },
};

/** Cuántas partículas pinta un tema en total, según el tamaño de pantalla. */
export function particleTotal(theme: SceneTheme, small: boolean): number {
  return theme.groups.reduce((sum, group) => sum + (small ? group.mobile : group.count), 0);
}
