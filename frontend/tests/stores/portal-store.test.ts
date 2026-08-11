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

  it('a los 1300 ms pasa a salida (la vista anterior ya salió)', () => {
    usePortalStore.getState().cross();
    vi.advanceTimersByTime(1300);
    expect(usePortalStore.getState().phase).toBe('out');
  });

  it('a los 2200 ms vuelve a reposo', () => {
    usePortalStore.getState().cross();
    vi.advanceTimersByTime(2200);
    expect(usePortalStore.getState().phase).toBe('idle');
  });

  it('cruzar dos veces seguidas no reinicia la secuencia', () => {
    usePortalStore.getState().cross();
    vi.advanceTimersByTime(1300);
    expect(usePortalStore.getState().phase).toBe('out');
    // En plena salida, un segundo cruce no debe reiniciar la coreografía.
    usePortalStore.getState().cross();
    expect(usePortalStore.getState().phase).toBe('out');
  });
});
