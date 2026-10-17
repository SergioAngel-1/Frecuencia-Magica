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
  resolveVar,
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
  '--color-on-media': '#f7f4ea',
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

  // `var()` se resuelve donde se declara: sin esta redeclaración el velo y la luz
  // (`bg-scrim/NN`, `bg-halo/NN`) heredarían el valor de `:root` dentro de una sección.
  it.each(IDS)('%s re-declares scrim and halo so they follow the scope', (id) => {
    const declared = ruleDeclarations(CSS, blockOf(id));

    expect(declared['--color-scrim'], `${id} --color-scrim`).toBe('rgb(var(--scrim))');
    expect(declared['--color-halo'], `${id} --color-halo`).toBe('rgb(var(--halo))');
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

/**
 * Los valores por defecto (`@theme` para los `--color-*`, `:root` para escrim,
 * halo y fondos) son los de la noche: un elemento fuera de cualquier bloque de
 * atmósfera pinta la noche. Si uno se edita en un sitio solo, este test falla.
 */
describe('default tokens are the night values', () => {
  // Sólo los tokens de la atmósfera: `@theme` tiene más (p. ej. `--font-cormorant`, que inyecta next/font).
  const theme = ruleDeclarations(CSS, '@theme');
  const root = ruleDeclarations(CSS, ':root');
  const lookup = (name: string) => theme[name] ?? root[name];
  const night = resolvedTokens(CSS, blockOf('night'));

  it.each(ATMOSPHERE_TOKENS)('%s defaults to the night value', (name) => {
    const raw = theme[name] ?? root[name];
    expect(raw, `${name} sin valor por defecto`).toBeDefined();
    expect(flat(resolveVar(raw!, lookup))).toBe(flat(night[name]!));
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

/**
 * `themeColor` (color de la barra del navegador) debe ser una parada de `--atmo-bg`.
 * Qué parada usa cada atmósfera, medido sobre `tokens.css` (no se cambió ningún valor):
 * - Parada del 45 % (la de la mitad): night, dusk, dawn, moon, study, store, marisol.
 * - Parada del 0 % (la superior): forest, gathering.
 * No es consistente entre atmósferas; el test sólo exige que sea una de las paradas.
 */
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
