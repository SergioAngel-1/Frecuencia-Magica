import { getSharedAudioContext } from './context';
import type { AudioEngine, EngineSnapshot, PlayOptions } from './engine';
import type { EngineTrack } from './track';

/** Una orden que espera al motor real; se reproduce en cuanto carga, en orden. */
type PendingOp = (engine: AudioEngine) => void;

const IDLE_SNAPSHOT: EngineSnapshot = { state: 'idle', trackId: null, elapsed: 0, ended: false };

/**
 * Fachada del motor compartido: implementa `AudioEngine` sin arrastrar el
 * motor real (motor, síntesis y grafo) al chunk inicial. Hasta que carga
 * responde con un estado `idle` local y encola las órdenes; `play` crea o
 * reanuda el contexto compartido dentro de la misma llamada —tiene que ocurrir
 * en el gesto de la persona— y devuelve un booleano síncrono.
 */
function createSharedEngine(): AudioEngine {
  let real: AudioEngine | null = null;
  let unsubscribeReal: (() => void) | null = null;
  let loading: Promise<void> | null = null;
  let latest: EngineSnapshot = IDLE_SNAPSHOT;
  const listeners = new Set<(snapshot: EngineSnapshot) => void>();
  const queued: PendingOp[] = [];

  /** Arranca la carga del motor la primera vez que hace falta; `null` mientras carga. */
  function ensureEngine(): AudioEngine | null {
    if (loading === null) {
      loading = import('./engine')
        .then(({ createAudioEngine }) => {
          const engine = createAudioEngine({ getContext: getSharedAudioContext });
          real = engine;
          unsubscribeReal = engine.subscribe((snapshot) => {
            latest = snapshot;
            for (const listener of listeners) listener(snapshot);
          });
          for (const op of queued.splice(0)) op(engine);
        })
        .catch(() => {
          // Sin motor no se pierde la escucha: se reintenta en la próxima orden.
          loading = null;
        });
    }

    return real;
  }

  function enqueue(op: PendingOp): void {
    if (real) op(real);
    else queued.push(op);
  }

  function play(track: EngineTrack, options: PlayOptions = {}): boolean {
    const context = getSharedAudioContext();
    if (!context) return false;

    // Debe nacer o reanudarse en el gesto, no cuando resuelva la carga.
    if (context.state === 'suspended') void context.resume();

    ensureEngine();
    enqueue((engine) => {
      engine.play(track, options);
    });
    return true;
  }

  // Precarga en un momento ocioso, ya con la primera pintura hecha.
  if (typeof window !== 'undefined') {
    const win = window as Window & { requestIdleCallback?: (callback: () => void) => number };
    if (typeof win.requestIdleCallback === 'function') {
      win.requestIdleCallback(() => ensureEngine());
    } else {
      setTimeout(() => ensureEngine(), 1);
    }
  }

  return {
    play,
    pause: () => enqueue((engine) => engine.pause()),
    resume: () => enqueue((engine) => engine.resume()),
    stop: () => enqueue((engine) => engine.stop()),
    seek: (seconds) => enqueue((engine) => engine.seek(seconds)),
    setVolume: (volume) => enqueue((engine) => engine.setVolume(volume)),
    getSnapshot: () => latest,
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    dispose() {
      unsubscribeReal?.();
      unsubscribeReal = null;
      real?.dispose();
      real = null;
      loading = null;
      queued.length = 0;
      listeners.clear();
    },
  };
}

/** El motor de la web: uno solo, sobre el contexto compartido con el drone. */
export const sharedAudioEngine: AudioEngine = createSharedEngine();
