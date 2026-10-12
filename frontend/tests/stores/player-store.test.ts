import { beforeEach, describe, expect, it } from 'vitest';

import { usePlayerStore } from '@/stores/player-store';

describe('usePlayerStore', () => {
  beforeEach(() => {
    usePlayerStore.setState({ audioId: null, isPlaying: false, elapsed: 0, minimized: false });
  });

  it('sólo hay una frecuencia activa: abrir otra sustituye a la anterior', () => {
    usePlayerStore.getState().open('a2');
    usePlayerStore.getState().open('a5');

    expect(usePlayerStore.getState().audioId).toBe('a5');
    expect(usePlayerStore.getState().isPlaying).toBe(true);
  });

  it('el control de un audio lo abre, lo pausa si suena y lo reanuda sin reiniciarlo', () => {
    usePlayerStore.getState().toggleAudio('a2');
    expect(usePlayerStore.getState()).toMatchObject({ audioId: 'a2', isPlaying: true });

    usePlayerStore.getState().setElapsed(30);
    usePlayerStore.getState().toggleAudio('a2');
    expect(usePlayerStore.getState()).toMatchObject({ audioId: 'a2', isPlaying: false });

    usePlayerStore.getState().toggleAudio('a2');
    expect(usePlayerStore.getState()).toMatchObject({
      audioId: 'a2',
      isPlaying: true,
      elapsed: 30,
    });
  });

  it('el control de otro audio sustituye al que suena en vez de pausarlo', () => {
    usePlayerStore.getState().open('a2');
    usePlayerStore.getState().toggleAudio('a5');

    expect(usePlayerStore.getState()).toMatchObject({ audioId: 'a5', isPlaying: true, elapsed: 0 });
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

  it('recoger el dock no detiene la escucha ni pierde el tiempo', () => {
    usePlayerStore.getState().open('a2');
    usePlayerStore.getState().setElapsed(45);
    usePlayerStore.getState().minimize();

    const state = usePlayerStore.getState();
    expect(state.minimized).toBe(true);
    expect(state.audioId).toBe('a2');
    expect(state.isPlaying).toBe(true);
    expect(state.elapsed).toBe(45);
  });

  it('desplegar devuelve el dock y elegir un audio también lo despliega', () => {
    usePlayerStore.getState().open('a2');
    usePlayerStore.getState().minimize();
    usePlayerStore.getState().expand();
    expect(usePlayerStore.getState().minimized).toBe(false);

    usePlayerStore.getState().minimize();
    usePlayerStore.getState().open('a2');
    expect(usePlayerStore.getState().minimized).toBe(false);

    usePlayerStore.getState().minimize();
    usePlayerStore.getState().open('a5');
    expect(usePlayerStore.getState().minimized).toBe(false);
  });

  it('sin audio abierto no hay nada que recoger, y cerrar olvida el estado recogido', () => {
    usePlayerStore.getState().minimize();
    expect(usePlayerStore.getState().minimized).toBe(false);

    usePlayerStore.getState().open('a2');
    usePlayerStore.getState().minimize();
    usePlayerStore.getState().close();
    expect(usePlayerStore.getState().minimized).toBe(false);
  });
});
