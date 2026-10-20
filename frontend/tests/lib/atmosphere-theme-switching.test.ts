import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { beginThemeSwitch, THEME_INK_DURATION_PROPERTY } from '@/lib/atmosphere/theme-switching';

const ATTRIBUTE = 'data-theme-switching';
const MS = 900;

describe('beginThemeSwitch', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    document.documentElement.removeAttribute(ATTRIBUTE);
    document.documentElement.style.removeProperty(THEME_INK_DURATION_PROPERTY);
  });

  it('sets the flag and the ink duration, then clears both when the time is up', () => {
    const root = document.documentElement;

    beginThemeSwitch(root, MS);
    expect(root.hasAttribute(ATTRIBUTE)).toBe(true);
    expect(root.style.getPropertyValue(THEME_INK_DURATION_PROPERTY)).toBe(`${MS}ms`);

    vi.advanceTimersByTime(MS - 1);
    expect(root.hasAttribute(ATTRIBUTE)).toBe(true);
    expect(root.style.getPropertyValue(THEME_INK_DURATION_PROPERTY)).toBe(`${MS}ms`);

    vi.advanceTimersByTime(1);
    expect(root.hasAttribute(ATTRIBUTE)).toBe(false);
    expect(root.style.getPropertyValue(THEME_INK_DURATION_PROPERTY)).toBe('');
  });

  it('clears both when cleaned up before the time is up', () => {
    const root = document.documentElement;
    const cleanup = beginThemeSwitch(root, MS);

    expect(root.hasAttribute(ATTRIBUTE)).toBe(true);
    expect(root.style.getPropertyValue(THEME_INK_DURATION_PROPERTY)).toBe(`${MS}ms`);

    cleanup();
    expect(root.hasAttribute(ATTRIBUTE)).toBe(false);
    expect(root.style.getPropertyValue(THEME_INK_DURATION_PROPERTY)).toBe('');
  });

  it('does not leave the flag or the duration hanging on a second switch', () => {
    const root = document.documentElement;

    // Primer cambio cancelado (p. ej. `reduced` cambia a mitad del fundido).
    beginThemeSwitch(root, MS)();
    // Segundo cambio: vuelve a poner la marca y su propio temporizador.
    const second = beginThemeSwitch(root, MS);
    expect(root.hasAttribute(ATTRIBUTE)).toBe(true);
    expect(root.style.getPropertyValue(THEME_INK_DURATION_PROPERTY)).toBe(`${MS}ms`);

    second();
    expect(root.hasAttribute(ATTRIBUTE)).toBe(false);
    expect(root.style.getPropertyValue(THEME_INK_DURATION_PROPERTY)).toBe('');

    // Y si el segundo llega a vencer, también se retira.
    beginThemeSwitch(root, MS);
    vi.advanceTimersByTime(MS);
    expect(root.hasAttribute(ATTRIBUTE)).toBe(false);
    expect(root.style.getPropertyValue(THEME_INK_DURATION_PROPERTY)).toBe('');
  });
});
