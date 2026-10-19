import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { beginThemeSwitch } from '@/lib/atmosphere/theme-switching';

const ATTRIBUTE = 'data-theme-switching';
const MS = 900;

describe('beginThemeSwitch', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    document.documentElement.removeAttribute(ATTRIBUTE);
  });

  it('sets the flag and clears it when the time is up', () => {
    const root = document.documentElement;

    beginThemeSwitch(root, MS);
    expect(root.hasAttribute(ATTRIBUTE)).toBe(true);

    vi.advanceTimersByTime(MS - 1);
    expect(root.hasAttribute(ATTRIBUTE)).toBe(true);

    vi.advanceTimersByTime(1);
    expect(root.hasAttribute(ATTRIBUTE)).toBe(false);
  });

  it('clears the flag when cleaned up before the time is up', () => {
    const root = document.documentElement;
    const cleanup = beginThemeSwitch(root, MS);

    expect(root.hasAttribute(ATTRIBUTE)).toBe(true);
    cleanup();
    expect(root.hasAttribute(ATTRIBUTE)).toBe(false);
  });

  it('does not leave the flag hanging on a second switch', () => {
    const root = document.documentElement;

    // Primer cambio cancelado (p. ej. `reduced` cambia a mitad del fundido).
    beginThemeSwitch(root, MS)();
    // Segundo cambio: vuelve a poner el atributo y su propio temporizador.
    const second = beginThemeSwitch(root, MS);
    expect(root.hasAttribute(ATTRIBUTE)).toBe(true);

    second();
    expect(root.hasAttribute(ATTRIBUTE)).toBe(false);

    // Y si el segundo llega a vencer, también se retira.
    beginThemeSwitch(root, MS);
    vi.advanceTimersByTime(MS);
    expect(root.hasAttribute(ATTRIBUTE)).toBe(false);
  });
});
