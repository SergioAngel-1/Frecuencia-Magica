import { create } from 'zustand';

type NavMenuState = {
  open: boolean;
  openMenu(): void;
  closeMenu(): void;
};

/**
 * El menú de navegación es uno solo y lo abren dos activadores: el botón del
 * header (por debajo de 1024 px) y el aro de la constelación (desde 1024 px).
 * No persiste: un menú no debe reabrirse solo al recargar.
 */
export const useNavMenuStore = create<NavMenuState>()((set) => ({
  open: false,
  openMenu: () => set({ open: true }),
  closeMenu: () => set({ open: false }),
}));
