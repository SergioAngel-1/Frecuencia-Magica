import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createAudioEngine, type EngineTrack } from '@/lib/audio/engine/engine';

import {
  audibleTrackOutputs,
  FakeAudioContext,
  type FakeContextOptions,
  type FakeGainNode,
  type FakeStereoPannerNode,
} from '../helpers/fake-audio-context';

const TONE: EngineTrack = {
  id: 'a1',
  source: { type: 'synth', recipe: { tone: { hz: 432 } } },
  durationSeconds: 1080,
};

const OTHER: EngineTrack = {
  id: 'a2',
  source: { type: 'synth', recipe: { tone: { hz: 528 } } },
  durationSeconds: 680,
};

const BINAURAL: EngineTrack = {
  id: 'b1',
  source: { type: 'synth', recipe: { binaural: { carrierHz: 200, beatHz: 10 } } },
  durationSeconds: 1200,
};

/** Tiempo de un fundido completo (salida + entrada) con los valores por defecto del motor. */
const CROSSFADE_SECONDS = 1;

function setup(options?: FakeContextOptions) {
  const ctx = new FakeAudioContext(options);
  const engine = createAudioEngine({ getContext: () => ctx as unknown as AudioContext });
  return { ctx, engine };
}

/** Deja correr las promesas pendientes (la reanudación del contexto). */
async function flushMicrotasks(): Promise<void> {
  for (let i = 0; i < 5; i += 1) await Promise.resolve();
}

/** Salida maestra: la que desemboca en el destino del contexto. */
function masterOf(ctx: FakeAudioContext): FakeGainNode {
  const master = ctx.gains.find((gain) => gain.connections.includes(ctx.destination));
  if (!master) throw new Error('el motor aún no ha creado su maestro');
  return master;
}

describe('motor de audio', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('sustituir una pista hace bajar la anterior antes de que entre la nueva, sin solapes', () => {
    const { ctx, engine } = setup();

    engine.play(TONE);
    ctx.currentTime = 1;
    engine.play(OTHER);

    // En cada instante del fundido hay como mucho una salida audible.
    for (let t = 1; t <= 1 + CROSSFADE_SECONDS + 0.5; t += 0.01) {
      expect(audibleTrackOutputs(ctx, t)).toBeLessThanOrEqual(1);
    }

    // Tras el fundido sólo queda la nueva.
    expect(audibleTrackOutputs(ctx, 1 + CROSSFADE_SECONDS + 0.5)).toBe(1);
    expect(engine.getSnapshot().trackId).toBe('a2');
  });

  it('pulsar play dos veces seguidas deja una sola fuente sonando', () => {
    const { ctx, engine } = setup();

    engine.play(TONE);
    engine.play(TONE);

    expect(ctx.oscillators).toHaveLength(1);
    expect(engine.getSnapshot().state).toBe('playing');
  });

  it('un binaural crea dos osciladores panoramizados a izquierda y derecha, con la diferencia pedida', () => {
    const { ctx, engine } = setup();

    engine.play(BINAURAL);

    expect(ctx.oscillators).toHaveLength(2);
    const [left, right] = ctx.oscillators;
    expect((left!.connections[0] as FakeStereoPannerNode).pan.value).toBe(-1);
    expect((right!.connections[0] as FakeStereoPannerNode).pan.value).toBe(1);
    expect(left!.frequency.value).toBe(200);
    expect(right!.frequency.value - left!.frequency.value).toBe(10);
  });

  it('setVolume mueve el maestro y acota el valor entre 0 y 1', () => {
    const { ctx, engine } = setup();
    engine.play(TONE);

    engine.setVolume(0.4);
    ctx.currentTime += 1;
    expect(masterOf(ctx).gain.value).toBeCloseTo(0.4);

    engine.setVolume(2);
    ctx.currentTime += 1;
    expect(masterOf(ctx).gain.value).toBe(1);

    engine.setVolume(-1);
    ctx.currentTime += 1;
    expect(masterOf(ctx).gain.value).toBe(0);
  });

  it('con el contexto suspendido el estado queda en blocked y nunca en playing', async () => {
    const { ctx, engine } = setup({ state: 'suspended', resumable: false });

    engine.play(TONE);
    await flushMicrotasks();

    expect(engine.getSnapshot().state).toBe('blocked');
    expect(ctx.oscillators.every((oscillator) => oscillator.started.length === 0)).toBe(true);
    expect(audibleTrackOutputs(ctx, ctx.currentTime)).toBe(0);
  });

  it('si el contexto se reanuda, la pista que estaba bloqueada empieza a sonar', async () => {
    const { ctx, engine } = setup({ state: 'suspended', resumable: true });

    engine.play(TONE);
    await flushMicrotasks();

    expect(engine.getSnapshot().state).toBe('playing');
    expect(ctx.oscillators).toHaveLength(1);
  });

  it('una muestra se detiene al tope y no reanuda la pista que había antes', () => {
    const { ctx, engine } = setup();
    const ended: boolean[] = [];
    engine.subscribe((snapshot) => ended.push(snapshot.ended));

    engine.play(OTHER);
    engine.play(TONE, { preview: 25 });

    // La muestra cuenta desde que entra (tras el fundido de la anterior): 25 s.
    ctx.currentTime = 26;
    vi.advanceTimersByTime(250);

    expect(engine.getSnapshot()).toMatchObject({ state: 'idle', trackId: null });
    expect(ended).toContain(true);
    expect(audibleTrackOutputs(ctx, 26.5)).toBe(0);
  });

  it('elapsed sale del reloj del contexto y se congela al pausar', () => {
    const { ctx, engine } = setup();
    engine.play(TONE);

    ctx.currentTime = 12.5;
    vi.advanceTimersByTime(250);
    expect(engine.getSnapshot().elapsed).toBeCloseTo(12.5);

    engine.pause();
    ctx.currentTime = 20;
    vi.advanceTimersByTime(250);
    expect(engine.getSnapshot()).toMatchObject({ state: 'paused' });
    expect(engine.getSnapshot().elapsed).toBeCloseTo(12.5);

    engine.resume();
    ctx.currentTime = 21;
    vi.advanceTimersByTime(250);
    expect(engine.getSnapshot().elapsed).toBeCloseTo(13.5);
  });
});
