import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { ATMOSPHERE_STORAGE_KEY } from '@/config/atmospheres';
import { isAtmosphereId } from '@/lib/atmosphere/resolve';
import type { AtmosphereId } from '@/types/atmosphere';

type AtmosphereState = {
  /** Atmósfera que la persona eligió a mano; `null` si sigue la del sitio. */
  manual: AtmosphereId | null;
  setManual(id: AtmosphereId): void;
  clear(): void;
};

/**
 * Elección manual de atmósfera. Vive en `sessionStorage` (no en `localStorage`):
 * la elección dura lo que la sesión, y una pestaña nueva arranca con la
 * atmósfera de su sitio.
 */
export const useAtmosphereStore = create<AtmosphereState>()(
  persist(
    (set) => ({
      manual: null,
      setManual: (id) => set({ manual: id }),
      clear: () => set({ manual: null }),
    }),
    {
      name: ATMOSPHERE_STORAGE_KEY,
      // En el servidor no hay `sessionStorage`: `createJSONStorage` lo absorbe
      // y el store funciona sin persistir.
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ manual: state.manual }),
      // Un valor guardado que no es una de las nueve atmósferas se descarta.
      merge: (persisted, current) => {
        const manual = (persisted as { manual?: unknown } | undefined)?.manual;

        return { ...current, manual: isAtmosphereId(manual) ? manual : null };
      },
    },
  ),
);
