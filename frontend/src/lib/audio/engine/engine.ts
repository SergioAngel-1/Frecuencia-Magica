import type { RandomSource } from './synth';
import { createTrackGraph, type TrackGraph } from './track-graph';
import type { EngineTrack } from './track';

export type { EngineTrack } from './track';
export { toEngineTrack } from './track';

/**
 * `idle`: nada abierto. `playing`: suena de verdad. `paused`: abierta y en
 * pausa. `blocked`: el navegador no deja sonar aún (contexto suspendido); la
 * interfaz no debe fingir que suena.
 */
export type EngineState = 'idle' | 'playing' | 'paused' | 'blocked';

export type EngineSnapshot = {
  state: EngineState;
  trackId: string | null;
  /** Segundos de la pista, del reloj del contexto (o de la posición del archivo). */
  elapsed: number;
  /** `true` sólo en el aviso en que la pista termina o la muestra llega a su tope. */
  ended: boolean;
};

export type PlayOptions = {
  /** Muestra: se detiene a estos segundos y no reanuda nada. */
  preview?: number;
  /** Duración del fundido de entrada, en segundos. */
  fadeIn?: number;
};

export type AudioEngine = {
  /** `false` si no hay Web Audio y la pista no ha podido ponerse en marcha ni quedar pendiente. */
  play(track: EngineTrack, options?: PlayOptions): boolean;
  pause(): void;
  resume(): void;
  stop(): void;
  seek(seconds: number): void;
  /** Volumen maestro, acotado a `[0, 1]`. Pasa por un nodo de ganancia, no por `audio.volume`. */
  setVolume(volume: number): void;
  /** La última foto del motor. Estable entre avisos: apta para `useSyncExternalStore`. */
  getSnapshot(): EngineSnapshot;
  subscribe(listener: (snapshot: EngineSnapshot) => void): () => void;
  /** Detiene la escucha y suelta los avisos. No cierra el contexto, que es compartido. */
  dispose(): void;
};

export type AudioEngineDeps = {
  /**
   * Devuelve el contexto compartido, creándolo si hace falta. Sólo se llama
   * desde un gesto del usuario. `null` si no hay Web Audio.
   */
  getContext: () => AudioContext | null;
  /** Azar para el ruido del mar y la lluvia; por defecto `Math.random`. */
  random?: RandomSource;
};

/** Fundido al sustituir o detener: la anterior baja antes de que entre la nueva. */
export const FADE_OUT_SECONDS = 0.4;
/** Fundido de entrada por defecto de una pista. */
export const FADE_IN_SECONDS = 0.4;
/** Fundido corto al pausar y reanudar, para que el corte no suene a golpe. */
const PAUSE_FADE_SECONDS = 0.15;
const VOLUME_TIME_CONSTANT = 0.02;
/** Cada cuánto se avisa del avance mientras suena. */
export const TICK_MS = 250;

type Current = {
  track: EngineTrack;
  graph: TrackGraph;
  preview: number | undefined;
  options: PlayOptions;
};

/** Una pista que espera al contexto, con la posición en la que se quedó. */
type Pending = { track: EngineTrack; options: PlayOptions; offset: number };

/**
 * Motor de reproducción: una pista a la vez, sobre un único contexto.
 *
 * Sustituir una pista hace bajar la anterior en un fundido corto y sólo
 * entonces entra la nueva; pedir la misma pista mientras suena no hace nada.
 * El avance sale del reloj del contexto, no de un temporizador de interfaz.
 */
export function createAudioEngine(deps: AudioEngineDeps): AudioEngine {
  const random: RandomSource = deps.random ?? Math.random;
  let ctx: AudioContext | null = null;
  let master: GainNode | null = null;
  let volume = 1;
  let current: Current | null = null;
  let state: EngineState = 'idle';
  // El reloj: los segundos `offset` se contaron desde `clockBase` (instante del contexto).
  let clockBase = 0;
  let offset = 0;
  let clockRunning = false;
  let pending: Pending | null = null;
  let timer: ReturnType<typeof setInterval> | null = null;
  let latest: EngineSnapshot = { state: 'idle', trackId: null, elapsed: 0, ended: false };
  const listeners = new Set<(snapshot: EngineSnapshot) => void>();

  /** El contexto y su maestro, creados la primera vez que el motor los necesita. */
  function ensureContext(): AudioContext | null {
    if (ctx) return ctx;

    ctx = deps.getContext();
    if (ctx) {
      master = ctx.createGain();
      master.gain.value = volume;
      master.connect(ctx.destination);
      ctx.addEventListener('statechange', onContextStateChange);
    }
    return ctx;
  }

  /**
   * El navegador puede suspender el contexto con una pista sonando (llamada,
   * segundo plano, Siri): se trata como un bloqueo, guardando la posición. Al
   * volver a `running`, la pista retoma desde ahí.
   */
  function onContextStateChange(): void {
    if (!ctx) return;

    if (ctx.state === 'running') {
      if (state === 'blocked' && pending) {
        const next = pending;
        pending = null;
        startTrack(ctx, next.track, next.options, next.offset);
      }
      return;
    }

    if (state === 'playing' && current) {
      block(ctx, current.track, current.options, elapsedNow());
    }
  }

  function elapsedNow(): number {
    // Sin pista sonando, bloqueado: la posición que se guardó al bloquear.
    if (!current) return pending?.offset ?? 0;
    if (!ctx) return 0;

    const position = current.graph.position();
    if (position !== null) return position;
    if (!clockRunning) return offset;

    return Math.max(0, offset + (ctx.currentTime - clockBase));
  }

  function emit(ended = false): void {
    latest = {
      state,
      trackId: current?.track.id ?? pending?.track.id ?? null,
      elapsed: elapsedNow(),
      ended,
    };
    for (const listener of listeners) listener(latest);
  }

  function startTimer(): void {
    if (timer === null) timer = setInterval(tick, TICK_MS);
  }

  function stopTimer(): void {
    if (timer !== null) {
      clearInterval(timer);
      timer = null;
    }
  }

  /** Baja la ganancia de una pista en `FADE_OUT_SECONDS` y la detiene al terminar. */
  function fadeOutAndStop(track: Current, now: number): void {
    const gain = track.graph.output.gain;
    gain.cancelScheduledValues(now);
    gain.setValueAtTime(gain.value, now);
    gain.linearRampToValueAtTime(0, now + FADE_OUT_SECONDS);
    track.graph.stop(now + FADE_OUT_SECONDS);
  }

  /** Lo que suena ahora termina en silencio, sin dejar nada abierto. */
  function finish(): void {
    if (current && ctx) fadeOutAndStop(current, ctx.currentTime);
    current = null;
    offset = 0;
    clockRunning = false;
    stopTimer();
    state = 'idle';
  }

  function tick(): void {
    if (!current || state !== 'playing') return;

    const limit =
      current.preview === undefined
        ? current.track.durationSeconds
        : Math.min(current.preview, current.track.durationSeconds);

    if (elapsedNow() >= limit) {
      finish();
      emit(true);
      return;
    }
    emit();
  }

  /** Empieza la pista: la anterior baja, y la nueva entra cuando ella acaba. */
  function startTrack(
    context: AudioContext,
    track: EngineTrack,
    options: PlayOptions,
    startAt = 0,
  ): void {
    const now = context.currentTime;
    const masterNode = master;
    if (!masterNode) return;

    let entry = now;
    if (current) {
      fadeOutAndStop(current, now);
      entry = now + FADE_OUT_SECONDS;
    }

    const graph = createTrackGraph(context, track, masterNode, random);
    const gain = graph.output.gain;
    gain.setValueAtTime(0, now);
    gain.setValueAtTime(0, entry);
    gain.linearRampToValueAtTime(1, entry + (options.fadeIn ?? FADE_IN_SECONDS));
    graph.start();
    if (startAt > 0) graph.seek(startAt);

    current = { track, graph, preview: options.preview, options };
    offset = startAt;
    clockBase = entry;
    clockRunning = true;
    state = 'playing';
    startTimer();
    emit();
  }

  /**
   * El navegador no deja sonar: se calla lo que hubiera, se recuerda la pista y
   * se reintenta al reanudarse el contexto. Nunca queda en `playing`.
   */
  function block(
    context: AudioContext,
    track: EngineTrack,
    options: PlayOptions,
    resumeAt: number,
  ): void {
    if (current) fadeOutAndStop(current, context.currentTime);
    current = null;
    offset = 0;
    clockRunning = false;
    stopTimer();

    const token: Pending = { track, options, offset: resumeAt };
    pending = token;
    state = 'blocked';
    emit();

    void context.resume().then(
      () => {
        if (pending !== token || context.state !== 'running') return;
        pending = null;
        startTrack(context, track, options, token.offset);
      },
      () => undefined,
    );
  }

  function play(track: EngineTrack, options: PlayOptions = {}): boolean {
    const same = current !== null && current.track.id === track.id;
    const samePreview = current?.preview === options.preview;

    if (same && samePreview) {
      // Pulsar la misma pista mientras suena no la reinicia; si está en pausa, la reanuda.
      if (state === 'paused') resume();
      return true;
    }

    // Reintentar la misma pista tras un bloqueo la retoma donde se quedó.
    const carried =
      pending && pending.track.id === track.id && pending.options.preview === options.preview
        ? pending.offset
        : 0;

    const context = ensureContext();
    if (!context) return false;

    if (context.state !== 'running') {
      block(context, track, options, carried);
      return true;
    }

    pending = null;
    startTrack(context, track, options, carried);
    return true;
  }

  function pause(): void {
    if (!current || !ctx || state !== 'playing') return;

    offset = elapsedNow();
    clockRunning = false;
    const now = ctx.currentTime;
    const gain = current.graph.output.gain;
    gain.cancelScheduledValues(now);
    gain.setValueAtTime(gain.value, now);
    gain.linearRampToValueAtTime(0, now + PAUSE_FADE_SECONDS);
    current.graph.pause();

    stopTimer();
    state = 'paused';
    emit();
  }

  function resume(): void {
    if (!current || !ctx || state !== 'paused') return;
    // Con el contexto suspendido no se reanuda: queda bloqueada, en la misma posición.
    if (ctx.state !== 'running') {
      block(ctx, current.track, current.options, offset);
      return;
    }

    const now = ctx.currentTime;
    clockBase = now;
    clockRunning = true;
    const gain = current.graph.output.gain;
    gain.cancelScheduledValues(now);
    gain.setValueAtTime(gain.value, now);
    gain.linearRampToValueAtTime(1, now + PAUSE_FADE_SECONDS);
    current.graph.resume();

    state = 'playing';
    startTimer();
    emit();
  }

  function stop(): void {
    pending = null;
    finish();
    emit();
  }

  function seek(seconds: number): void {
    if (!current || !ctx) return;

    const target = Math.min(Math.max(seconds, 0), current.track.durationSeconds);
    current.graph.seek(target);
    offset = target;
    clockBase = ctx.currentTime;
    emit();
  }

  function setVolume(next: number): void {
    volume = Math.min(1, Math.max(0, next));
    if (master && ctx) {
      master.gain.setTargetAtTime(volume, ctx.currentTime, VOLUME_TIME_CONSTANT);
    }
  }

  return {
    play,
    pause,
    resume,
    stop,
    seek,
    setVolume,
    getSnapshot: () => latest,
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    dispose() {
      pending = null;
      ctx?.removeEventListener('statechange', onContextStateChange);
      if (current && ctx) fadeOutAndStop(current, ctx.currentTime);
      current = null;
      stopTimer();
      state = 'idle';
      listeners.clear();
    },
  };
}
