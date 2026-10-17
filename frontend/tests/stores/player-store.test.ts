import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { AUDIOS, PLAYABLE_AUDIOS } from '@/data';
import { createAudioEngine, type AudioEngine } from '@/lib/audio/engine/engine';
import { createPlayerStore, PREVIEW_SECONDS, VOLUME_STORAGE_KEY } from '@/stores/player-store';

import {
  audibleTrackOutputs,
  FakeAudioContext,
  type FakeContextOptions,
} from '../helpers/fake-audio-context';

/** Almacenamiento en memoria con la forma que usa el store (`getItem`/`setItem`). */
class MemoryStorage {
  private readonly values = new Map<string, string>();

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }

  keys(): string[] {
    return [...this.values.keys()];
  }
}

type Env = {
  ctx: FakeAudioContext;
  engine: AudioEngine;
  storage: MemoryStorage;
  store: ReturnType<typeof createPlayerStore>;
};

/** Un store real sobre el motor real y un contexto falso con reloj controlable. */
function setup(options?: FakeContextOptions): Env {
  const ctx = new FakeAudioContext(options);
  const engine = createAudioEngine({ getContext: () => ctx as unknown as AudioContext });
  const storage = new MemoryStorage();
  const store = createPlayerStore(engine, storage);
  return { ctx, engine, storage, store };
}

describe('createPlayerStore', () => {
  let env: Env;

  beforeEach(() => {
    vi.useFakeTimers();
    env = setup();
  });

  afterEach(() => {
    env.engine.dispose();
    vi.useRealTimers();
  });

  const state = () => env.store.getState();

  it('sólo hay una frecuencia activa: abrir otra sustituye a la anterior', () => {
    state().open('a2');
    state().open('a5');

    expect(state().audioId).toBe('a5');
    expect(state().isPlaying).toBe(true);
  });

  it('el control de un audio lo abre, lo pausa si suena y lo reanuda sin reiniciarlo', () => {
    state().toggleAudio('a2');
    expect(state()).toMatchObject({ audioId: 'a2', isPlaying: true });

    state().setElapsed(30);
    state().toggleAudio('a2');
    expect(state()).toMatchObject({ audioId: 'a2', isPlaying: false });

    state().toggleAudio('a2');
    expect(state()).toMatchObject({ audioId: 'a2', isPlaying: true, elapsed: 30 });
  });

  it('el control de otro audio sustituye al que suena en vez de pausarlo', () => {
    state().open('a2');
    state().toggleAudio('a5');

    expect(state()).toMatchObject({ audioId: 'a5', isPlaying: true, elapsed: 0 });
  });

  it('arranca sin audio y en pausa', () => {
    expect(state().audioId).toBeNull();
    expect(state().isPlaying).toBe(false);
  });

  it('abrir un audio lo reproduce desde el principio', () => {
    state().open('a2');
    expect(state()).toMatchObject({ audioId: 'a2', isPlaying: true, elapsed: 0 });
  });

  it('abrir otro audio reinicia el tiempo', () => {
    state().open('a2');
    state().setElapsed(45);
    state().open('a5');

    expect(state().elapsed).toBe(0);
  });

  it('reabrir el mismo audio no reinicia el tiempo', () => {
    state().open('a2');
    state().setElapsed(30);
    state().open('a2');

    expect(state().elapsed).toBe(30);
  });

  it('alternar sin audio abierto no hace nada, y con audio pausa y reanuda', () => {
    state().toggle();
    expect(state()).toMatchObject({ audioId: null, isPlaying: false });

    state().open('a2');
    state().toggle();
    expect(state().isPlaying).toBe(false);
    state().toggle();
    expect(state().isPlaying).toBe(true);
  });

  it('cerrar limpia el reproductor', () => {
    state().open('a2');
    state().close();

    expect(state()).toMatchObject({ audioId: null, isPlaying: false, elapsed: 0 });
  });

  it('siguiente cambia al audio siguiente y sigue reproduciendo', () => {
    state().open('a1');
    state().next();

    expect(state()).toMatchObject({ audioId: 'a2', isPlaying: true });
  });

  it('anterior cambia al audio anterior y sigue reproduciendo', () => {
    state().open('a2');
    state().previous();

    expect(state()).toMatchObject({ audioId: 'a1', isPlaying: true });
  });

  it('recoger el dock no detiene la escucha ni pierde el tiempo', () => {
    state().open('a2');
    state().setElapsed(45);
    state().minimize();

    expect(state()).toMatchObject({ minimized: true, audioId: 'a2', isPlaying: true, elapsed: 45 });
  });

  it('desplegar devuelve el dock y elegir un audio también lo despliega', () => {
    state().open('a2');
    state().minimize();
    state().expand();
    expect(state().minimized).toBe(false);

    state().minimize();
    state().open('a2');
    expect(state().minimized).toBe(false);

    state().minimize();
    state().open('a5');
    expect(state().minimized).toBe(false);
  });

  it('sin audio abierto no hay nada que recoger, y cerrar olvida el estado recogido', () => {
    state().minimize();
    expect(state().minimized).toBe(false);

    state().open('a2');
    state().minimize();
    state().close();
    expect(state().minimized).toBe(false);
  });

  it('la muestra se detiene al tope y no reanuda la pista que había antes', () => {
    state().open('a2');
    state().open('a5', 'preview');
    expect(state()).toMatchObject({ audioId: 'a5', mode: 'preview', isPlaying: true });

    // La muestra cuenta desde que entra, tras el fundido de la anterior.
    env.ctx.currentTime = PREVIEW_SECONDS + 1;
    vi.advanceTimersByTime(250);

    expect(state()).toMatchObject({ audioId: null, isPlaying: false });
    expect(audibleTrackOutputs(env.ctx, PREVIEW_SECONDS + 1.5)).toBe(0);
  });

  it('al terminar una pista completa avanza a la siguiente', () => {
    state().open('a1');
    env.ctx.currentTime = 18 * 60 + 1;
    vi.advanceTimersByTime(250);

    expect(state()).toMatchObject({ audioId: 'a2', isPlaying: true });
  });

  it('un audio sin material (soon) no se abre ni por el control ni por la muestra', () => {
    state().open('n3');
    state().open('m1', 'preview');
    state().toggleAudio('g1');

    expect(state().audioId).toBeNull();
  });

  it('siguiente y anterior nunca llevan a una pista soon, dando la vuelta entera', () => {
    const playableIds = new Set(PLAYABLE_AUDIOS.map((audio) => audio.id));
    const soonIds = AUDIOS.filter((audio) => !playableIds.has(audio.id)).map((audio) => audio.id);
    expect(soonIds.length).toBeGreaterThan(0);

    state().open('a1');
    for (let i = 0; i < PLAYABLE_AUDIOS.length * 2; i += 1) {
      state().next();
      expect(playableIds.has(state().audioId!)).toBe(true);
    }
    for (let i = 0; i < PLAYABLE_AUDIOS.length * 2; i += 1) {
      state().previous();
      expect(playableIds.has(state().audioId!)).toBe(true);
    }
  });

  it('el volumen se acota entre 0 y 1 y se guarda en su propia clave', () => {
    state().setVolume(1.7);
    expect(state().volume).toBe(1);
    expect(env.storage.keys()).toContain(VOLUME_STORAGE_KEY);

    state().setVolume(-3);
    expect(state().volume).toBe(0);

    state().setVolume(0.35);
    expect(state().volume).toBe(0.35);
    expect(env.storage.getItem(VOLUME_STORAGE_KEY)).toBe('0.35');
  });

  it('el volumen guardado se recupera al crear el reproductor de nuevo', () => {
    state().setVolume(0.35);

    const again = createPlayerStore(env.engine, env.storage);
    expect(again.getState().volume).toBe(0.35);
  });

  it('solo el volumen se guarda: el resto del reproductor no persiste', () => {
    state().open('a2');
    state().setElapsed(20);
    state().minimize();

    expect(env.storage.keys()).toEqual([]);
  });

  it('silenciar y reactivar recuerda el volumen anterior', () => {
    state().setVolume(0.6);

    state().toggleMute();
    expect(state().volume).toBe(0);

    state().toggleMute();
    expect(state().volume).toBe(0.6);
  });

  it('con el motor bloqueado isPlaying no se queda en verdadero', () => {
    env.engine.dispose();
    env = setup({ state: 'suspended', resumable: false });

    state().open('a2');

    expect(state()).toMatchObject({ audioId: 'a2', isPlaying: false, engineState: 'blocked' });
  });
});

describe('sin Web Audio', () => {
  it('abrir una pista sin contexto de audio no deja nada abierto ni un dock vacío', () => {
    const engine = createAudioEngine({ getContext: () => null });
    const store = createPlayerStore(engine, new MemoryStorage());

    store.getState().open('a2');
    store.getState().open('a3', 'preview');

    expect(store.getState()).toMatchObject({ audioId: null, mode: 'full', isPlaying: false });
    engine.dispose();
  });
});

describe('aperturas explícitas', () => {
  it('abrir cuenta como apertura y avanzar la pista sola no', () => {
    const env = setup();
    env.store.getState().open('a1');
    const afterOpen = env.store.getState().opened;

    env.store.getState().next();
    env.store.getState().previous();
    expect(env.store.getState().opened).toBe(afterOpen);

    env.store.getState().open('a2');
    expect(env.store.getState().opened).toBe(afterOpen + 1);
    env.engine.dispose();
  });
});

describe('reabrir la pista abierta', () => {
  it('reabrir la misma pista no cuenta como apertura y no vuelve a recoger el dock', () => {
    const env = setup();
    env.store.getState().open('a1');
    const afterOpen = env.store.getState().opened;

    env.store.getState().minimize();
    env.store.getState().open('a1');

    expect(env.store.getState().opened).toBe(afterOpen);
    expect(env.store.getState().minimized).toBe(false);
    env.engine.dispose();
  });
});
