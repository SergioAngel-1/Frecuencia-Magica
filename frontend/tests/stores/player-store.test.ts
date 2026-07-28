import { beforeEach, describe, expect, it } from 'vitest';

import { usePlayerStore } from '@/stores/player-store';

describe('usePlayerStore', () => {
  beforeEach(() => {
    usePlayerStore.setState({ audioId: null, isPlaying: false, elapsed: 0 });
  });

  it('arranca sin audio y en pausa', () => {
    const state = usePlayerStore.getState();
    expect(state.audioId).toBeNull();
    expect(state.isPlaying).toBe(false);
  });

  it('abrir un audio lo reproduce desde el principio', () => {
    usePlayerStore.getState().open('a2');
    const state = usePlayerStore.getState();
    expect(state.audioId).toBe('a2');
    expect(state.isPlaying).toBe(true);
    expect(state.elapsed).toBe(0);
  });

  it('abrir otro audio reinicia el tiempo', () => {
    usePlayerStore.getState().open('a2');
    usePlayerStore.getState().setElapsed(45);
    usePlayerStore.getState().open('a5');
    expect(usePlayerStore.getState().elapsed).toBe(0);
  });

  it('reabrir el mismo audio no reinicia el tiempo', () => {
    usePlayerStore.getState().open('a2');
    usePlayerStore.getState().setElapsed(30);
    usePlayerStore.getState().open('a2');
    expect(usePlayerStore.getState().elapsed).toBe(30);
  });

  it('alternar cambia el estado de reproducción', () => {
    const initial = usePlayerStore.getState().isPlaying;
    usePlayerStore.getState().toggle();
    usePlayerStore.getState().toggle();
    expect(usePlayerStore.getState().isPlaying).toBe(initial);
  });

  it('cerrar limpia el reproductor', () => {
    usePlayerStore.getState().open('a2');
    usePlayerStore.getState().close();
    const state = usePlayerStore.getState();
    expect(state.audioId).toBeNull();
    expect(state.isPlaying).toBe(false);
    expect(state.elapsed).toBe(0);
  });

  it('siguiente cambia al audio siguiente y sigue reproduciendo', () => {
    usePlayerStore.getState().open('a1');
    usePlayerStore.getState().next();
    const state = usePlayerStore.getState();
    expect(state.audioId).toBe('a2');
    expect(state.isPlaying).toBe(true);
  });

  it('anterior cambia al audio anterior y sigue reproduciendo', () => {
    usePlayerStore.getState().open('a2');
    usePlayerStore.getState().previous();
    const state = usePlayerStore.getState();
    expect(state.audioId).toBe('a1');
    expect(state.isPlaying).toBe(true);
  });
});
