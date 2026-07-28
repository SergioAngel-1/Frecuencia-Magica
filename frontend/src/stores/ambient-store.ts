import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AmbientState = {
  /** Si el drone ambiental suena. Arranca apagado: los navegadores bloquean
   * el audio sin un gesto previo del usuario. */
  enabled: boolean;
  toggle(): void;
};

/** Preferencia de audio ambiental, persistida entre sesiones. */
export const useAmbientStore = create<AmbientState>()(
  persist(
    (set) => ({
      enabled: false,
      toggle: () => set((state) => ({ enabled: !state.enabled })),
    }),
    { name: 'fm.ambient' },
  ),
);
