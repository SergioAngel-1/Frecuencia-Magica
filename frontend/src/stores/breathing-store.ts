import { create } from 'zustand';

type BreathingState = {
  open: boolean;
  show(): void;
  hide(): void;
};

/**
 * La guía de respiración es una sola y la abren dos activadores: el botón del
 * header y el de la llegada en la Home. No persiste: la práctica se abre
 * cuando la persona la pide, nunca sola al recargar.
 */
export const useBreathingStore = create<BreathingState>()((set) => ({
  open: false,
  show: () => set({ open: true }),
  hide: () => set({ open: false }),
}));
