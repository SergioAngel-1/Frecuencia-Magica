import { create } from 'zustand';

type RouteWaitState = {
  /** La app ya hidrató: un fallback que se monte desde ahora es el de una navegación del cliente. */
  hydrated: boolean;
  /** Cuántos fallbacks de `loading.tsx` hay en pantalla durante una navegación del cliente. */
  fallbacks: number;
  markHydrated(): void;
  enter(): void;
  leave(): void;
};

/**
 * Relevo entre el fallback de un `loading.tsx` y la espera de `RouteTransition`. Next monta el
 * fallback en cuanto cambia la ruta, dentro del contenedor que está saliendo: si la escena se
 * pintara ahí, aparecería al 100 %, se desvanecería con la salida y volvería a entrar con el
 * contenedor nuevo. En una navegación del cliente el fallback se oculta (`RouteLoadingGate`) y
 * avisa aquí; `RouteTransition` mantiene su única espera hasta que el fallback se va.
 */
export const useRouteWaitStore = create<RouteWaitState>((set) => ({
  hydrated: false,
  fallbacks: 0,
  markHydrated: () => set({ hydrated: true }),
  enter: () => set((state) => ({ fallbacks: state.fallbacks + 1 })),
  leave: () => set((state) => ({ fallbacks: Math.max(0, state.fallbacks - 1) })),
}));
