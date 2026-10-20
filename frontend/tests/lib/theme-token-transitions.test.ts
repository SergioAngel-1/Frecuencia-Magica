import { afterEach, describe, expect, it } from 'vitest';

import {
  beginThemeSwitch,
  THEME_INK_DURATION_PROPERTY,
  THEME_SCRIM_DURATION_PROPERTY,
} from '@/lib/atmosphere/theme-switching';
import { readSource, SRC } from '../helpers/source-files';

const tokens = readSource(`${SRC}/app/tokens.css`).replace(/\s+/g, ' ');
const globals = readSource(`${SRC}/app/globals.css`).replace(/\s+/g, ' ');

/** Los tokens de velo y luz que consumen los degradados anchos del sitio. */
const SCRIM_TOKENS = [
  '--scrim',
  '--scrim-deep',
  '--halo',
  '--nebula-a',
  '--nebula-b',
  '--nebula-c',
  '--nebula-boost',
] as const;

/**
 * Los tokens de los degradados de velo (`rgb(var(--scrim) / .8)`) cambian de golpe con el tema de
 * `<html>`; sin `@property` no transitan y el velo del héroe, el del header y la viñeta saltarían a los
 * colores del tema final antes de que funda nada (una pantalla entera del tema nuevo). Estas guardas
 * evitan que un refactor los deje sin tipo o fuera de la transición de la raíz.
 */
describe('theme token transitions', () => {
  it('registers every scrim token with @property so it interpolates', () => {
    for (const token of SCRIM_TOKENS) {
      expect(tokens, token).toMatch(new RegExp(`@property ${token} \\{[^}]*inherits: true`));
    }
  });

  it('types the triplets as number lists and the boost as a number', () => {
    for (const token of SCRIM_TOKENS.filter((name) => name !== '--nebula-boost')) {
      expect(tokens, token).toMatch(new RegExp(`@property ${token} \\{ *syntax: '<number>\\+'`));
    }
    expect(tokens).toMatch(/@property --nebula-boost \{ *syntax: '<number>'/);
  });

  it('transitions them on the root, with the scrim duration', () => {
    const block = /:root\[data-theme-switching\] \{([^}]*)\}/.exec(globals)?.[1] ?? '';

    for (const token of SCRIM_TOKENS) expect(block, token).toContain(token);
    expect(block).toContain(`transition-duration: var(${THEME_SCRIM_DURATION_PROPERTY})`);
  });
});

describe('beginThemeSwitch durations', () => {
  const root = document.documentElement;

  afterEach(() => {
    root.removeAttribute('data-theme-switching');
    root.style.removeProperty(THEME_INK_DURATION_PROPERTY);
    root.style.removeProperty(THEME_SCRIM_DURATION_PROPERTY);
  });

  it('sets each duration on its own variable', () => {
    const clear = beginThemeSwitch(root, { ink: 1300, scrim: 2100 });

    expect(root.style.getPropertyValue(THEME_INK_DURATION_PROPERTY)).toBe('1300ms');
    expect(root.style.getPropertyValue(THEME_SCRIM_DURATION_PROPERTY)).toBe('2100ms');
    clear();
    expect(root.style.getPropertyValue(THEME_SCRIM_DURATION_PROPERTY)).toBe('');
  });

  it('lets the scrim share the ink duration when it is not given', () => {
    const clear = beginThemeSwitch(root, 900);

    expect(root.style.getPropertyValue(THEME_SCRIM_DURATION_PROPERTY)).toBe('900ms');
    clear();
  });
});
