import { create, type StoreApi, type UseBoundStore } from 'zustand';

import { getAudio, isPlayable, PLAYABLE_AUDIOS } from '@/data';
import type {
  AudioEngine,
  EngineSnapshot,
  EngineState,
  PlayOptions,
} from '@/lib/audio/engine/engine';
import { sharedAudioEngine } from '@/lib/audio/engine/shared-engine';
import { toEngineTrack } from '@/lib/audio/engine/track';
import { nextAudioId, previousAudioId } from '@/lib/player/progress';

/** `full`: la pista entera. `preview`: la muestra de unos segundos. */
export type PlayerMode = 'full' | 'preview';

/** Segundos de la muestra; al llegar aquí se detiene y no reanuda nada. */
export const PREVIEW_SECONDS = 25;
/** Clave de `localStorage` del volumen: lo único del reproductor que persiste. */
export const VOLUME_STORAGE_KEY = 'fm.player-volume';
const DEFAULT_VOLUME = 0.8;

type PlayerState = {
  audioId: string | null;
  mode: PlayerMode;
  /** Suena de verdad: el motor está en `playing`. Nunca en verdadero con el motor bloqueado. */
  isPlaying: boolean;
  engineState: EngineState;
  /** Segundos transcurridos, del motor. */
  elapsed: number;
  /** El dock está recogido en su disco flotante; el audio sigue sonando. */
  minimized: boolean;
  /** Volumen maestro, 0–1. */
  volume: number;
  /** Cuántas veces la persona ha abierto una pista. Avanzar sola no lo cambia. */
  opened: number;
  /** Abre un audio y lo reproduce (o la muestra). Reabrir el mismo no reinicia el tiempo. */
  open(id: string, mode?: PlayerMode): void;
  /** Pausa o reanuda el audio abierto. Sin audio abierto no hace nada. */
  toggle(): void;
  /** El control de un audio concreto: pausa si ese audio suena; si no, lo abre o reanuda. */
  toggleAudio(id: string): void;
  close(): void;
  /** Recoge el dock sin detener la escucha. */
  minimize(): void;
  /** Vuelve a desplegar el dock. */
  expand(): void;
  /** Busca una posición en segundos dentro del audio abierto. */
  setElapsed(seconds: number): void;
  setVolume(volume: number): void;
  /** Silencia, o vuelve al volumen que había antes de silenciar. */
  toggleMute(): void;
  next(): void;
  previous(): void;
};

export type PlayerStore = UseBoundStore<StoreApi<PlayerState>>;

type VolumeStorage = Pick<Storage, 'getItem' | 'setItem'>;

function clampVolume(volume: number): number {
  return Math.min(1, Math.max(0, volume));
}

/** Lee el volumen guardado; sin dato, sin almacenamiento o ilegible, el de por defecto. */
function readVolume(storage: VolumeStorage | null): number {
  try {
    const raw = storage?.getItem(VOLUME_STORAGE_KEY);
    if (raw === null || raw === undefined) return DEFAULT_VOLUME;

    const value = Number(raw);
    return Number.isFinite(value) ? clampVolume(value) : DEFAULT_VOLUME;
  } catch {
    return DEFAULT_VOLUME;
  }
}

function writeVolume(storage: VolumeStorage | null, volume: number): void {
  try {
    storage?.setItem(VOLUME_STORAGE_KEY, String(volume));
  } catch {
    // Sin almacenamiento (modo privado, cuota llena) el volumen dura lo que la pestaña.
  }
}

function browserStorage(): VolumeStorage | null {
  try {
    return typeof window === 'undefined' ? null : window.localStorage;
  } catch {
    return null;
  }
}

/** Sólo las pistas listas se pueden abrir: una `soon` nunca llega al motor. */
function isAvailable(id: string): boolean {
  const audio = getAudio(id);
  return audio !== undefined && isPlayable(audio);
}

/**
 * Store del reproductor sobre un motor concreto. El store de la web usa el
 * motor compartido; los tests crean el suyo con un contexto falso.
 *
 * El motor manda sobre lo que suena: `isPlaying`, `elapsed` y el fin de pista
 * llegan de sus avisos. El store sólo guarda qué audio está abierto, en qué
 * modo y las preferencias (ventana del dock, volumen).
 */
export function createPlayerStore(
  engine: AudioEngine,
  storage: VolumeStorage | null = browserStorage(),
): PlayerStore {
  const initialVolume = readVolume(storage);
  engine.setVolume(initialVolume);
  // Volumen al que volver al reactivar el sonido (no se guarda).
  let lastAudibleVolume = initialVolume > 0 ? initialVolume : DEFAULT_VOLUME;

  const store: PlayerStore = create<PlayerState>((set, get) => {
    /** Pone en marcha un audio. Con la misma pista y modo, el motor la reanuda o reintenta. */
    const start = (id: string, mode: PlayerMode) => {
      const audio = getAudio(id);
      const track = audio ? toEngineTrack(audio) : null;
      if (!track) return;

      const options: PlayOptions = mode === 'preview' ? { preview: PREVIEW_SECONDS } : {};
      // Sin Web Audio el motor no acepta la pista: no dejamos un dock abierto sin sonido.
      if (!engine.play(track, options)) return;
      set({ audioId: id, mode });
    };

    return {
      audioId: null,
      mode: 'full',
      isPlaying: false,
      engineState: 'idle',
      elapsed: 0,
      minimized: false,
      volume: initialVolume,
      opened: 0,
      open(id, mode = 'full') {
        if (!isAvailable(id)) return;

        const { audioId, mode: currentMode, engineState, opened } = get();
        // Mismo audio y modo: no reinicia ni cuenta como apertura nueva. Sólo reanuda
        // si estaba en pausa o bloqueado, y desde la misma posición.
        if (audioId === id && currentMode === mode) {
          set({ minimized: false });
          if (engineState !== 'playing') start(id, mode);
          return;
        }

        set({ minimized: false, opened: opened + 1 });
        start(id, mode);
      },
      toggle() {
        const { audioId, mode, isPlaying } = get();
        if (audioId === null) return;

        if (isPlaying) {
          engine.pause();
          return;
        }
        start(audioId, mode);
      },
      toggleAudio(id) {
        const { audioId, isPlaying } = get();
        if (audioId === id && isPlaying) {
          engine.pause();
          return;
        }
        get().open(id);
      },
      close() {
        engine.stop();
        set({ audioId: null, mode: 'full', isPlaying: false, elapsed: 0, minimized: false });
      },
      minimize: () => set((state) => (state.audioId === null ? state : { minimized: true })),
      expand: () => set({ minimized: false }),
      setElapsed(seconds) {
        if (get().audioId === null) return;
        engine.seek(seconds);
      },
      setVolume(next) {
        const volume = clampVolume(next);
        engine.setVolume(volume);
        writeVolume(storage, volume);
        set({ volume });
      },
      toggleMute() {
        const { volume } = get();
        if (volume > 0) {
          lastAudibleVolume = volume;
          get().setVolume(0);
          return;
        }
        get().setVolume(lastAudibleVolume > 0 ? lastAudibleVolume : DEFAULT_VOLUME);
      },
      next() {
        const { audioId } = get();
        if (audioId === null) return;
        start(nextAudioId(audioId, PLAYABLE_AUDIOS), 'full');
      },
      previous() {
        const { audioId } = get();
        if (audioId === null || !PLAYABLE_AUDIOS.some((audio) => audio.id === audioId)) return;
        start(previousAudioId(audioId, PLAYABLE_AUDIOS), 'full');
      },
    };
  });

  /** Lo que el motor dice que pasa: estado, tiempo y fin de pista. */
  const mirror = (snapshot: EngineSnapshot) => {
    const { mode, audioId, close, next } = store.getState();

    if (snapshot.ended) {
      // La muestra termina y se cierra: no vuelve nada de lo anterior.
      if (mode === 'preview') {
        close();
        return;
      }
      // Una pista completa que termina pasa a la siguiente.
      if (audioId !== null) {
        next();
        return;
      }
    }

    store.setState({
      engineState: snapshot.state,
      isPlaying: snapshot.state === 'playing',
      elapsed: snapshot.elapsed,
    });
  };

  engine.subscribe(mirror);
  return store;
}

/** El reproductor de la web, sobre el motor compartido. */
export const usePlayerStore: PlayerStore = createPlayerStore(sharedAudioEngine);

/**
 * La frecuencia activa: el audio abierto en el reproductor, o `null`.
 *
 * El store es la única fuente de verdad de lo que suena (un solo `audioId`):
 * abrir otro audio sustituye al anterior, así que dos frecuencias nunca se
 * solapan. Cualquier vista consulta la activa con este selector, sin un
 * proveedor de React: Zustand no lo necesita.
 */
export function useActiveAudioId(): string | null {
  return usePlayerStore((state) => state.audioId);
}

/**
 * El estado de un audio concreto frente al reproductor: `active` si es el
 * abierto y `playing` si además suena. Lo comparten todos los controles que
 * representan ese audio fuera del dock, para que su play pase a pausa a la
 * vez que el del dock.
 */
export function useAudioPlayback(id: string): { active: boolean; playing: boolean } {
  const active = usePlayerStore((state) => state.audioId === id);
  const playing = usePlayerStore((state) => state.audioId === id && state.isPlaying);

  return { active, playing };
}

/**
 * `true` mientras una frecuencia suena de verdad: el motor está en `playing`.
 * Con el navegador bloqueando el audio es `false`, y el ambiente no se calla
 * por una frecuencia que en realidad no suena.
 */
export function useIsPlayerSounding(): boolean {
  return usePlayerStore((state) => state.audioId !== null && state.isPlaying);
}
