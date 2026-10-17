import { describe, expect, it } from 'vitest';

import { ATMOSPHERES } from '@/config/atmospheres';
import type { AtmosphereId } from '@/types/atmosphere';

import {
  brightest,
  contrast,
  darkest,
  gradientStops,
  over,
  parseColor,
  readTokensCss,
  resolvedTokens,
  type RGB,
} from '../helpers/css-tokens';

/**
 * Guarda de contraste de las atmósferas (DESIGN.md § Atmósferas, «Contraste como guarda»).
 *
 * Cada token se mide sobre todas las superficies en las que puede caer: el punto
 * más claro y el más oscuro del fondo, los del degradado de respaldo y el vidrio
 * (`surface` y `surface-strong`) compuesto sobre cada uno de ellos. Un texto con
 * alfa se compone sobre cada superficie antes de medir.
 *
 * Umbrales: texto y acentos aptos como texto, 4,5:1 (WCAG AA). El foco y los
 * bordes que identifican un control (`line-strong`), 3:1 (WCAG 1.4.11).
 *
 * `line` es el borde decorativo del vidrio: no identifica nada por sí solo, así
 * que no le aplica 3:1. Se mide con 1,5:1, el mínimo para que el borde se vea
 * sobre el fondo. Los controles que necesiten más usan `line-strong`.
 */
const CSS = readTokensCss();
const IDS = Object.keys(ATMOSPHERES) as AtmosphereId[];

const TEXT = [
  '--color-fg',
  '--color-fg-body',
  '--color-fg-soft',
  '--color-fg-muted',
  '--color-fg-meta',
] as const;
const ACCENTS = ['--color-accent', '--color-accent-2', '--color-accent-3'] as const;

const TEXT_MIN = 4.5;
const LINE_MIN = 1.5;
const FOCUS_MIN = 3;

/**
 * Excepción de `line` en la noche: 1,45:1. La noche es la v1 sin cambios
 * (`glass-brd`, oro al 20 %) y mide 1,49:1 sobre el punto más oscuro del vacío;
 * no se toca, así que el suelo es ese valor medido con margen y cualquier
 * regresión por debajo falla. Decisión tomada: `line` es un borde decorativo
 * (1,5:1 en las ocho atmósferas nuevas) y `line-strong` (controles y foco)
 * llega a 3:1.
 */
const LINE_FLOOR: Partial<Record<AtmosphereId, number>> = { night: 1.45 };

/** Todas las superficies en las que puede caer un token de la atmósfera. */
function surfacesOf(id: AtmosphereId): { values: Record<string, string>; bases: RGB[] } {
  const values = resolvedTokens(CSS, `[data-atmosphere='${id}']`);
  const background = gradientStops(values['--atmo-bg']!);
  const backdrop = gradientStops(values['--atmo-backdrop']!);
  const grounds: RGB[] = [
    brightest(background),
    darkest(background),
    brightest(backdrop),
    darkest(backdrop),
  ];
  const surface = parseColor(values['--color-surface']!);
  const surfaceStrong = parseColor(values['--color-surface-strong']!);

  return {
    values,
    bases: [
      ...grounds,
      ...grounds.map((ground) => over(surface, ground)),
      ...grounds.map((ground) => over(surfaceStrong, ground)),
    ],
  };
}

describe('atmosphere contrast guard', () => {
  it.each(IDS)('%s: the five text tiers reach 4.5:1 on every surface', (id) => {
    const { values, bases } = surfacesOf(id);
    const failures: string[] = [];

    for (const name of TEXT) {
      const text = parseColor(values[name]!);

      for (const base of bases) {
        const ratio = contrast(over(text, base), base);
        if (ratio < TEXT_MIN) failures.push(`${name} ${ratio.toFixed(2)}:1`);
      }
    }

    expect(failures).toEqual([]);
  });

  it.each(IDS)('%s: text accents reach 4.5:1 on every surface', (id) => {
    const { values, bases } = surfacesOf(id);
    const failures: string[] = [];

    for (const name of ACCENTS) {
      const accent = parseColor(values[name]!);

      for (const base of bases) {
        const ratio = contrast(accent, base);
        if (ratio < TEXT_MIN) failures.push(`${name} ${ratio.toFixed(2)}:1`);
      }
    }

    expect(failures).toEqual([]);
  });

  it.each(IDS)('%s: ink on accent fills reaches 4.5:1', (id) => {
    const { values } = surfacesOf(id);
    const ratio = contrast(
      parseColor(values['--color-on-accent']!),
      parseColor(values['--color-accent']!),
    );

    expect(ratio).toBeGreaterThanOrEqual(TEXT_MIN);
  });

  it.each(IDS)('%s: decorative line reaches 1.5:1 and focus or strong line 3:1', (id) => {
    const { values, bases } = surfacesOf(id);
    const failures: string[] = [];
    const checks: [string, number][] = [
      ['--color-line', LINE_FLOOR[id] ?? LINE_MIN],
      ['--color-line-strong', FOCUS_MIN],
    ];

    for (const [name, min] of checks) {
      const line = parseColor(values[name]!);

      for (const base of bases) {
        const ratio = contrast(over(line, base), base);
        if (ratio < min) failures.push(`${name} ${ratio.toFixed(2)}:1 (min ${min})`);
      }
    }

    expect(failures).toEqual([]);
  });
});
