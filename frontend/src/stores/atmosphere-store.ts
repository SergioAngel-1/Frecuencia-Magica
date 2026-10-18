import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { ATMOSPHERE_STORAGE_KEY, ATMOSPHERE_STORE_VERSION } from '@/config/atmospheres';
import { isAtmosphereId } from '@/lib/atmosphere/resolve';
import type { AtmosphereId } from '@/types/atmosphere';

type AtmosphereState = {
  /** Tema que la persona eligió; `null` («Automático») si sigue el de cada lugar. */
  choice: AtmosphereId | null;
  setChoice(id: AtmosphereId): void;
  clear(): void;
};

/**
 * Elección de tema, global: manda en todo el sitio. Vive en `localStorage` y dura
 * entre visitas; sin ella, cada lugar usa el tema que sugiere.
 */
export const useAtmosphereStore = create<AtmosphereState>()(
  persist(
    (set) => ({
      choice: null,
      setChoice: (id) => set({ choice: id }),
      clear: () => set({ choice: null }),
    }),
    {
      name: ATMOSPHERE_STORAGE_KEY,
      version: ATMOSPHERE_STORE_VERSION,
      // En el servidor no hay `localStorage`: `createJSONStorage` lo absorbe
      // y el store funciona sin persistir.
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ choice: state.choice }),
      // Un valor guardado que no es uno de los cinco temas se descarta.
      merge: (persisted, current) => {
        const choice = (persisted as { choice?: unknown } | undefined)?.choice;

        return { ...current, choice: isAtmosphereId(choice) ? choice : null };
      },
    },
  ),
);
