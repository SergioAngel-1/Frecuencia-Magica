import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { usePortalStore } from '@/stores/portal-store';

describe('usePortalStore', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    usePortalStore.setState({ phase: 'idle' });
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('empieza en reposo', () => {
    expect(usePortalStore.getState().phase).toBe('idle');
  });

  it('cruzar pone la fase de entrada', () => {
    usePortalStore.getState().cross();
    expect(usePortalStore.getState().phase).toBe('in');
  });

  it('a los mil milisegundos pasa a salida', () => {
    usePortalStore.getState().cross();
    vi.advanceTimersByTime(1000);
    expect(usePortalStore.getState().phase).toBe('out');
  });

  it('a los mil novecientos vuelve a reposo', () => {
    usePortalStore.getState().cross();
    vi.advanceTimersByTime(1900);
    expect(usePortalStore.getState().phase).toBe('idle');
  });

  it('cruzar dos veces seguidas no reinicia la secuencia', () => {
    usePortalStore.getState().cross();
    vi.advanceTimersByTime(1000);
    expect(usePortalStore.getState().phase).toBe('out');
    // En plena salida, un segundo cruce no debe reiniciar la coreografía.
    usePortalStore.getState().cross();
    expect(usePortalStore.getState().phase).toBe('out');
  });
});
