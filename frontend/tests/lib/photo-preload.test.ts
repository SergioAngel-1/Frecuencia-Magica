import { afterEach, describe, expect, it, vi } from 'vitest';

import { preloadTheme, registerThemedPhoto } from '@/lib/atmosphere/photo-preload';

const cleanups: (() => void)[] = [];

function register(entry: Parameters<typeof registerThemedPhoto>[0]) {
  cleanups.push(registerThemedPhoto(entry));
}

afterEach(() => {
  for (const cleanup of cleanups.splice(0)) cleanup();
  vi.useRealTimers();
});

describe('preloadTheme', () => {
  it('pide sólo las variantes del tema, una vez por src y con sus sizes', async () => {
    const loadImage = vi.fn(async () => {});

    register({ variants: { dusk: '/a-dusk.avif', dawn: '/a-dawn.avif' }, sizes: '100vw' });
    register({ variants: { dusk: '/b-dusk.avif' }, sizes: '50vw' });
    register({ variants: { dusk: '/a-dusk.avif' }, sizes: '25vw' });

    await preloadTheme('dusk', { loadImage });

    expect(loadImage).toHaveBeenCalledTimes(2);
    expect(loadImage).toHaveBeenCalledWith('/a-dusk.avif', '100vw');
    expect(loadImage).toHaveBeenCalledWith('/b-dusk.avif', '50vw');
  });

  it('no pide nada si ninguna foto montada tiene el tema', async () => {
    const loadImage = vi.fn(async () => {});

    register({ variants: { dusk: '/a-dusk.avif' }, sizes: '100vw' });

    await preloadTheme('forest', { loadImage });

    expect(loadImage).not.toHaveBeenCalled();
  });

  it('se resuelve al llegar al tope aunque una imagen no termine', async () => {
    vi.useFakeTimers();
    const loadImage = vi.fn(() => new Promise<void>(() => {}));

    register({ variants: { dusk: '/a-dusk.avif' }, sizes: '100vw' });

    let resolved = false;
    const ready = preloadTheme('dusk', { timeoutMs: 120, loadImage });
    void ready.then(() => {
      resolved = true;
    });

    await vi.advanceTimersByTimeAsync(119);
    expect(resolved).toBe(false);

    await vi.advanceTimersByTimeAsync(1);
    await expect(ready).resolves.toBeUndefined();
    expect(resolved).toBe(true);
  });

  it('una carga que falla no rechaza el conjunto', async () => {
    register({ variants: { dusk: '/a-dusk.avif' }, sizes: '100vw' });
    register({ variants: { dusk: '/b-dusk.avif' }, sizes: '50vw' });

    const loadImage = vi.fn((src: string) => {
      if (src === '/a-dusk.avif') return Promise.reject(new Error('sin red'));
      throw new Error('sin red');
    });

    await expect(preloadTheme('dusk', { loadImage })).resolves.toBeUndefined();
  });
});
