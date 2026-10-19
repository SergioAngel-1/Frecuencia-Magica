import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { AudioEngine, EngineTrack } from '@/lib/audio/engine/engine';

import { FakeAudioContext, type FakeContextOptions } from '../helpers/fake-audio-context';

const TONE: EngineTrack = {
  id: 'a1',
  source: { type: 'synth', recipe: { tone: { hz: 432 } } },
  durationSeconds: 1080,
};

/** Contexto falso que recuerda la última instancia creada por el contexto compartido. */
class RecordingContext extends FakeAudioContext {
  static last: RecordingContext | null = null;

  constructor(options?: FakeContextOptions) {
    super(options);
    RecordingContext.last = this;
  }
}

/** Fachada recién evaluada, con su estado y su módulo de contexto en limpio. */
async function freshEngine(): Promise<AudioEngine> {
  vi.resetModules();
  const { sharedAudioEngine } = await import('@/lib/audio/engine/shared-engine');
  return sharedAudioEngine;
}

describe('fachada del motor compartido', () => {
  beforeEach(() => {
    RecordingContext.last = null;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('expone un estado idle desde el primer momento, sin cargar el motor', async () => {
    vi.stubGlobal('AudioContext', RecordingContext);
    const engine = await freshEngine();

    expect(engine.getSnapshot()).toMatchObject({ state: 'idle', trackId: null, ended: false });
  });

  it('devuelve false sin Web Audio y no encola nada', async () => {
    vi.stubGlobal('AudioContext', undefined);
    vi.stubGlobal('webkitAudioContext', undefined);
    const engine = await freshEngine();

    expect(engine.play(TONE)).toBe(false);
  });

  it('crea el contexto en el gesto y encola la reproducción hasta que el motor carga', async () => {
    vi.stubGlobal('AudioContext', RecordingContext);
    const engine = await freshEngine();

    expect(engine.play(TONE)).toBe(true);
    // El contexto nace dentro de la llamada (el gesto); el grafo aún no, porque
    // el motor real entra en un chunk aparte.
    expect(RecordingContext.last).not.toBeNull();
    expect(RecordingContext.last?.oscillators).toHaveLength(0);

    await vi.waitFor(() => {
      expect(RecordingContext.last?.oscillators.length).toBe(1);
    });
    engine.dispose();
  });

  it('reenvía los avisos del motor real a quien se suscribió antes de que cargara', async () => {
    vi.stubGlobal('AudioContext', RecordingContext);
    const engine = await freshEngine();
    const states: string[] = [];
    engine.subscribe((snapshot) => states.push(snapshot.state));

    engine.play(TONE);

    await vi.waitFor(() => expect(states).toContain('playing'));
    engine.dispose();
  });
});
