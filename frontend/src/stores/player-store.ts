import { create } from 'zustand';

import { AUDIOS } from '@/data';
import { nextAudioId, previousAudioId } from '@/lib/player/progress';

type PlayerState = {
  audioId: string | null;
  isPlaying: boolean;
  /** Segundos transcurridos del audio abierto. Acepta un actualizador funcional. */
  elapsed: number;
  /** El dock está recogido en su disco flotante; el audio sigue sonando. */
  minimized: boolean;
  /** Abre un audio y lo reproduce. Reabrir el mismo audio no reinicia el tiempo. */
  open(id: string): void;
  toggle(): void;
  /**
   * El gesto de un control de play/pausa ligado a un audio concreto (el disco
   * grande, la frecuencia de un producto): pausa si ese audio suena y, si no,
   * lo abre o lo reanuda.
   */
  toggleAudio(id: string): void;
  close(): void;
  /** Recoge el dock sin detener la escucha. */
  minimize(): void;
  /** Vuelve a desplegar el dock. */
  expand(): void;
  setElapsed(seconds: number | ((elapsed: number) => number)): void;
  next(): void;
  previous(): void;
};

/** Índice del audio actual en el catálogo real, o -1 si no hay audio abierto. */
function indexInCatalog(audioId: string | null): number {
  if (audioId === null) return -1;

  return AUDIOS.findIndex((audio) => audio.id === audioId);
}

/**
 * Estado del reproductor de audio. Transversal: la Home y el resultado de
 * Descúbrete lo abren desde fuera del Resonario.
 *
 * Sin persistencia deliberada: el reproductor no debe resucitar solo al
 * recargar la página.
 */
export const usePlayerStore = create<PlayerState>((set, get) => ({
  audioId: null,
  isPlaying: false,
  elapsed: 0,
  minimized: false,
  open: (id) => {
    // Pulsar el mismo disco no debe cortar la escucha: sólo reinicia el
    // tiempo cuando el audio abierto cambia de verdad. Elegir un audio siempre
    // despliega el dock: es la confirmación de que ha empezado a sonar.
    if (get().audioId === id) {
      set({ isPlaying: true, minimized: false });
      return;
    }

    set({ audioId: id, isPlaying: true, elapsed: 0, minimized: false });
  },
  toggle: () => set((state) => ({ isPlaying: !state.isPlaying })),
  toggleAudio: (id) => {
    const { audioId, isPlaying, open } = get();

    if (audioId === id && isPlaying) {
      set({ isPlaying: false });
      return;
    }

    open(id);
  },
  close: () => set({ audioId: null, isPlaying: false, elapsed: 0, minimized: false }),
  minimize: () => set((state) => (state.audioId === null ? state : { minimized: true })),
  expand: () => set({ minimized: false }),
  setElapsed: (seconds) =>
    set((state) => ({
      elapsed: typeof seconds === 'function' ? seconds(state.elapsed) : seconds,
    })),
  next: () => {
    const { audioId } = get();
    if (audioId === null) return;

    set({ audioId: nextAudioId(audioId, AUDIOS), isPlaying: true, elapsed: 0 });
  },
  previous: () => {
    const { audioId } = get();
    if (audioId === null || indexInCatalog(audioId) === -1) return;

    set({ audioId: previousAudioId(audioId, AUDIOS), isPlaying: true, elapsed: 0 });
  },
}));

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

/** `true` mientras una frecuencia suena de verdad (abierta y sin pausa). */
export function useIsPlayerSounding(): boolean {
  return usePlayerStore((state) => state.audioId !== null && state.isPlaying);
}
