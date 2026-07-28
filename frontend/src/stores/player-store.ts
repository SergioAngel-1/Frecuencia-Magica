import { create } from 'zustand';

import { AUDIOS } from '@/data';
import { nextAudioId, previousAudioId } from '@/lib/player/progress';

type PlayerState = {
  audioId: string | null;
  isPlaying: boolean;
  /** Segundos transcurridos del audio abierto. */
  elapsed: number;
  /** Abre un audio y lo reproduce. Reabrir el mismo audio no reinicia el tiempo. */
  open(id: string): void;
  toggle(): void;
  close(): void;
  setElapsed(seconds: number): void;
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
 * Descúbrete lo abren desde fuera de la Biblioteca.
 *
 * Sin persistencia deliberada: el reproductor no debe resucitar solo al
 * recargar la página.
 */
export const usePlayerStore = create<PlayerState>((set, get) => ({
  audioId: null,
  isPlaying: false,
  elapsed: 0,
  open: (id) => {
    // Pulsar el mismo disco no debe cortar la escucha: sólo reinicia el
    // tiempo cuando el audio abierto cambia de verdad.
    if (get().audioId === id) {
      set({ isPlaying: true });
      return;
    }

    set({ audioId: id, isPlaying: true, elapsed: 0 });
  },
  toggle: () => set((state) => ({ isPlaying: !state.isPlaying })),
  close: () => set({ audioId: null, isPlaying: false, elapsed: 0 }),
  setElapsed: (seconds) => set({ elapsed: seconds }),
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
