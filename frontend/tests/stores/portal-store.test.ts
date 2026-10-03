import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { PORTAL_MAX_HOLD, PORTAL_TIMING } from '@/config/motion';
import { usePortalStore } from '@/stores/portal-store';

const { full, quick } = PORTAL_TIMING;

describe('usePortalStore', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    usePortalStore.setState({ phase: 'idle', mode: 'full' });
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('empieza en reposo', () => {
    expect(usePortalStore.getState().phase).toBe('idle');
  });

  it('cruzar pone la fase de entrada con la coreografía completa', () => {
    usePortalStore.getState().cross();

    expect(usePortalStore.getState().phase).toBe('in');
    expect(usePortalStore.getState().mode).toBe('full');
  });

  it('al cubrir la pantalla espera al destino en vez de revelar por reloj', () => {
    usePortalStore.getState().cross();
    vi.advanceTimersByTime(full.cover);
    expect(usePortalStore.getState().phase).toBe('hold');

    // Sin llegada, la vista anterior no se destapa aunque pase el tiempo.
    vi.advanceTimersByTime(full.settle + full.reveal);
    expect(usePortalStore.getState().phase).toBe('hold');
  });

  it('revela cuando el destino llega con la pantalla ya cubierta', () => {
    usePortalStore.getState().cross();
    vi.advanceTimersByTime(full.cover);
    usePortalStore.getState().arrive();

    expect(usePortalStore.getState().phase).toBe('hold');
    vi.advanceTimersByTime(full.settle);
    expect(usePortalStore.getState().phase).toBe('out');
    vi.advanceTimersByTime(full.reveal);
    expect(usePortalStore.getState().phase).toBe('idle');
  });

  it('si el destino llega antes de cubrir, no revela hasta que la pantalla está cubierta', () => {
    usePortalStore.getState().cross();
    vi.advanceTimersByTime(full.cover / 2);
    usePortalStore.getState().arrive();
    expect(usePortalStore.getState().phase).toBe('in');

    vi.advanceTimersByTime(full.cover / 2);
    expect(usePortalStore.getState().phase).toBe('hold');
    vi.advanceTimersByTime(full.settle);
    expect(usePortalStore.getState().phase).toBe('out');
  });

  it('si el destino no llega, revela igualmente tras la espera máxima', () => {
    usePortalStore.getState().cross();
    vi.advanceTimersByTime(full.cover + PORTAL_MAX_HOLD - 1);
    expect(usePortalStore.getState().phase).toBe('hold');

    vi.advanceTimersByTime(1 + full.settle);
    expect(usePortalStore.getState().phase).toBe('out');
    vi.advanceTimersByTime(full.reveal);
    expect(usePortalStore.getState().phase).toBe('idle');
  });

  it('una llegada repetida no reinicia la revelación', () => {
    usePortalStore.getState().cross();
    vi.advanceTimersByTime(full.cover);
    usePortalStore.getState().arrive();
    vi.advanceTimersByTime(full.settle);
    usePortalStore.getState().arrive();

    vi.advanceTimersByTime(full.reveal);
    expect(usePortalStore.getState().phase).toBe('idle');
  });

  it('el modo breve usa sus propios tiempos', () => {
    usePortalStore.getState().cross('quick');
    expect(usePortalStore.getState().mode).toBe('quick');

    vi.advanceTimersByTime(quick.cover);
    expect(usePortalStore.getState().phase).toBe('hold');
    usePortalStore.getState().arrive();
    vi.advanceTimersByTime(quick.settle + quick.reveal);
    expect(usePortalStore.getState().phase).toBe('idle');
  });

  it('una llegada en reposo no hace nada', () => {
    usePortalStore.getState().arrive();
    vi.advanceTimersByTime(PORTAL_MAX_HOLD);

    expect(usePortalStore.getState().phase).toBe('idle');
  });

  it('cruzar dos veces seguidas no reinicia la secuencia', () => {
    usePortalStore.getState().cross();
    vi.advanceTimersByTime(full.cover);
    expect(usePortalStore.getState().phase).toBe('hold');

    // En plena espera, un segundo cruce no debe reiniciar la coreografía.
    usePortalStore.getState().cross('quick');
    expect(usePortalStore.getState().phase).toBe('hold');
    expect(usePortalStore.getState().mode).toBe('full');
  });
});
