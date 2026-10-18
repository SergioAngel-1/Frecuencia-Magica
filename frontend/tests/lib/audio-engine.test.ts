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

describe('vigilancia del contexto y cobertura del motor', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('si el navegador suspende el contexto durante la reproducción, deja de decir que suena', () => {
    const { ctx, engine } = setup({ resumable: false });
    engine.play(TONE);
    ctx.currentTime = 5;

    ctx.setState('suspended');

    expect(engine.getSnapshot()).toMatchObject({ state: 'blocked', trackId: 'a1' });
    expect(audibleTrackOutputs(ctx, 6)).toBe(0);
    engine.dispose();
  });

  it('al reanudarse el contexto, la pista vuelve desde donde se quedó', () => {
    const { ctx, engine } = setup({ resumable: false });
    engine.play(TONE);
    ctx.currentTime = 5;
    ctx.setState('suspended');

    ctx.setState('running');
    ctx.currentTime = 7;
    vi.advanceTimersByTime(250);

    expect(engine.getSnapshot().state).toBe('playing');
    expect(engine.getSnapshot().elapsed).toBeCloseTo(7);
    expect(audibleTrackOutputs(ctx, 7.5)).toBe(1);
    engine.dispose();
  });

  it('reanudar desde pausa con el contexto suspendido queda en blocked, nunca en playing', () => {
    const { ctx, engine } = setup({ resumable: false });
    engine.play(TONE);
    engine.pause();
    ctx.setState('suspended');

    engine.resume();

    expect(engine.getSnapshot().state).toBe('blocked');
    engine.dispose();
  });

  it('un reemplazo A→B→C dentro del fundido deja sólo C audible, nunca dos a la vez', () => {
    const { ctx, engine } = setup({ resumable: false });
    engine.play(TONE);
    ctx.currentTime = 1;
    engine.play(OTHER);
    ctx.currentTime = 1.1;
    engine.play({ ...OTHER, id: 'a3' });

    for (let t = 1; t <= 3; t += 0.01) {
      expect(audibleTrackOutputs(ctx, t)).toBeLessThanOrEqual(1);
    }
    expect(engine.getSnapshot().trackId).toBe('a3');
    expect(audibleTrackOutputs(ctx, 3)).toBe(1);
    engine.dispose();
  });

  it('pausar mientras el motor está bloqueado no cambia su estado', () => {
    const { ctx, engine } = setup({ state: 'suspended', resumable: false });
    engine.play(TONE);

    engine.pause();

    expect(engine.getSnapshot().state).toBe('blocked');
    expect(ctx.oscillators.every((oscillator) => oscillator.started.length === 0)).toBe(true);
    engine.dispose();
  });

  it('seek lleva el reloj a la posición pedida, acotada a la duración, y el avance sigue desde ahí', () => {
    const { ctx, engine } = setup({ resumable: false });
    engine.play(TONE);

    engine.seek(100);
    expect(engine.getSnapshot().elapsed).toBeCloseTo(100);

    ctx.currentTime = 1;
    vi.advanceTimersByTime(250);
    expect(engine.getSnapshot().elapsed).toBeCloseTo(101);

    engine.seek(999999);
    expect(engine.getSnapshot().elapsed).toBeCloseTo(TONE.durationSeconds);
    engine.dispose();
  });

  it('una muestra suspendida no termina mientras está bloqueada; al reanudarse termina en su tope', () => {
    const { ctx, engine } = setup({ resumable: false });
    const endings: boolean[] = [];
    engine.subscribe((snapshot) => endings.push(snapshot.ended));
    engine.play(TONE, { preview: 25 });
    ctx.currentTime = 10;
    ctx.setState('suspended');

    ctx.currentTime = 40;
    vi.advanceTimersByTime(250);
    expect(endings).not.toContain(true);
    expect(engine.getSnapshot()).toMatchObject({ state: 'blocked', ended: false });

    // Retoma en 10 s: el tope de 25 s se alcanza con el reloj en 55 s.
    ctx.setState('running');
    ctx.currentTime = 55;
    vi.advanceTimersByTime(250);
    expect(endings).toContain(true);
    expect(engine.getSnapshot().state).toBe('idle');
    engine.dispose();
  });

  it('dispose quita el listener de estado del contexto', () => {
    const { ctx, engine } = setup({ resumable: false });
    engine.play(TONE);
    expect(ctx.stateListenerCount).toBe(1);

    engine.dispose();
    expect(ctx.stateListenerCount).toBe(0);
  });
});

/** Un `<audio>` simulado: registra su origen y cuántas veces se pausa o reproduce. */
class FakeMediaElement {
  static instances: FakeMediaElement[] = [];
  preload = '';
  currentTime = 0;
  played = 0;
  paused = 0;

  constructor(readonly src: string) {
    FakeMediaElement.instances.push(this);
  }

  play(): Promise<void> {
    this.played += 1;
    return Promise.resolve();
  }

  pause(): void {
    this.paused += 1;
  }
}

describe('fuente de archivo', () => {
  const FILE: EngineTrack = {
    id: 'f1',
    source: { type: 'file', src: '/audio/full.mp3', sampleSrc: '/audio/sample.mp3' },
    durationSeconds: 600,
  };

  beforeEach(() => {
    vi.useFakeTimers();
    FakeMediaElement.instances = [];
    vi.stubGlobal('Audio', FakeMediaElement);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('la muestra usa sampleSrc y la pista completa usa su archivo', () => {
    const { engine } = setup();

    engine.play(FILE, { preview: 25 });
    expect(FakeMediaElement.instances.at(-1)?.src).toBe('/audio/sample.mp3');

    engine.stop();
    engine.play(FILE);
    expect(FakeMediaElement.instances.at(-1)?.src).toBe('/audio/full.mp3');
    engine.dispose();
  });

  it('parar un archivo respeta el fundido: el elemento se pausa al terminar la rampa, no antes', () => {
    const { engine } = setup();
    engine.play(FILE);
    const element = FakeMediaElement.instances.at(-1)!;

    engine.stop();
    expect(element.paused).toBe(0);

    vi.advanceTimersByTime(500);
    expect(element.paused).toBeGreaterThan(0);
    engine.dispose();
  });
});

describe('solape al reanudar tras una suspensión', () => {
  it('con el reloj congelado al reanudarse, la pista anterior calla de golpe: nunca dos salidas audibles', () => {
    const { ctx, engine } = setup({ resumable: false });
    engine.play(TONE);
    ctx.currentTime = 5;
    ctx.setState('suspended');

    // El navegador vuelve a `running` sin que avance el reloj del contexto.
    ctx.setState('running');

    const counts: number[] = [];
    for (let t = 5; t <= 6; t += 0.05) counts.push(audibleTrackOutputs(ctx, t));
    expect(Math.max(...counts)).toBeLessThanOrEqual(1);
    engine.dispose();
  });
});
