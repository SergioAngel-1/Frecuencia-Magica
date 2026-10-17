import { describe, expect, it } from 'vitest';

import { ATMOSPHERES } from '@/config/atmospheres';
import type { AtmosphereId } from '@/types/atmosphere';

import {
  ATMOSPHERE_TOKENS,
  gradientStops,
  brightest,
  darkest,
  luminance,
  parseColor,
  parseTriplet,
  readTokensCss,
  resolvedTokens,
  ruleDeclarations,
} from '../helpers/css-tokens';

const CSS = readTokensCss();
const IDS = Object.keys(ATMOSPHERES) as AtmosphereId[];

const blockOf = (id: AtmosphereId) => `[data-atmosphere='${id}']`;

/** Normaliza espacios para comparar gradientes escritos en varias líneas. */
const flat = (value: string) =>
  value.replace(/\s+/g, ' ').replace(/\(\s/g, '(').replace(/\s\)/g, ')').trim();

/**
 * Valores de la v1 (`night`) tal como estaban en `@theme` y `:root` antes de
 * las atmósferas. La noche no debe cambiar nada.
 */
const V1_NIGHT: Record<string, string> = {
  '--color-fg': '#f7f4ea',
  '--color-fg-body': 'rgb(247 244 234 / 0.82)',
  '--color-fg-soft': 'rgb(247 244 234 / 0.7)',
  '--color-fg-muted': 'rgb(247 244 234 / 0.6)',
  '--color-fg-meta': 'rgb(247 244 234 / 0.55)',
  '--color-accent': '#d8b978',
  '--color-accent-2': '#96c6bc',
  '--color-accent-3': '#b9b0d6',
  '--color-line': 'rgba(216, 185, 120, 0.2)',
  '--color-surface': 'rgba(247, 244, 234, 0.045)',
  '--color-on-accent': '#12213a',
  '--atmo-bg': 'radial-gradient(140% 100% at 50% -10%, #16273f 0%, #0f1b2e 45%, #0a1220 100%)',
};

describe('atmosphere token blocks', () => {
  it('has one block per AtmosphereId and no block for an unknown id', () => {
    const declared = [...CSS.matchAll(/\[data-atmosphere='([a-z-]+)'\]\s*\{/g)].map((m) => m[1]);

    expect([...new Set(declared)].sort()).toEqual([...IDS].sort());
  });

  it.each(IDS)('%s defines every token of the set', (id) => {
    const declared = ruleDeclarations(CSS, blockOf(id));

    for (const name of ATMOSPHERE_TOKENS) {
      expect(declared, `${id} ${name}`).toHaveProperty(name);
    }
  });

  it('keeps the theme as runtime variables, not inlined at build time', () => {
    expect(CSS).not.toMatch(/@theme\s+inline/);
  });
});

describe('night is the v1 surface, unchanged', () => {
  it('repeats the current values exactly', () => {
    const values = resolvedTokens(CSS, blockOf('night'));

    for (const [name, expected] of Object.entries(V1_NIGHT)) {
      expect(values[name], name).toBe(expected);
    }
  });

  it('paints the same gradient as the app background it replaces', () => {
    const root = resolvedTokens(CSS, ':root');

    expect(flat(resolvedTokens(CSS, blockOf('night'))['--atmo-bg']!)).toBe(
      flat(root['--fm-night']!),
    );
  });
});

describe('atmosphere scheme matches the text it uses', () => {
  it.each(IDS)('%s: light schemes carry dark text, dark and warm carry light text', (id) => {
    const values = resolvedTokens(CSS, blockOf(id));
    const fg = parseColor(values['--color-fg']!);
    const stops = gradientStops(values['--atmo-bg']!);

    if (ATMOSPHERES[id].scheme === 'light') {
      expect(luminance(fg)).toBeLessThan(luminance(darkest(stops)));
    } else {
      expect(luminance(fg)).toBeGreaterThan(luminance(brightest(stops)));
    }
  });
});

describe('atmosphere values', () => {
  it.each(IDS)('%s: theme-color is a stop of its background gradient', (id) => {
    const values = resolvedTokens(CSS, blockOf(id));
    const theme = parseColor(ATMOSPHERES[id].themeColor);
    const stops = gradientStops(values['--atmo-bg']!);

    expect(
      stops.some((stop) => stop.r === theme.r && stop.g === theme.g && stop.b === theme.b),
      `${id} themeColor ${ATMOSPHERES[id].themeColor}`,
    ).toBe(true);
  });

  it.each(IDS)('%s: scrim and halo are RGB triplets', (id) => {
    const values = resolvedTokens(CSS, blockOf(id));

    expect(() => parseTriplet(values['--scrim']!)).not.toThrow();
    expect(() => parseTriplet(values['--halo']!)).not.toThrow();
  });
});
