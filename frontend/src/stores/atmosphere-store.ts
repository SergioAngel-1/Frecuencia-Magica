import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { ATMOSPHERE_STORAGE_KEY, ATMOSPHERE_STORE_VERSION } from '@/config/atmospheres';
import { ARRIVALS, type ArrivalKey } from '@/config/arrivals';
import { isAtmosphereId } from '@/lib/atmosphere/resolve';
import type { AtmosphereId } from '@/types/atmosphere';

type AtmosphereState = {
  /** Tema que la persona eligió; `null` («Automático») si sigue el de cada lugar. */
  choice: AtmosphereId | null;
  /**
   * Emoción de origen de la elección (`mood:*` o `intent:*`); `null` si eligió una
   * tarjeta de tema o si está en automático. Permite nombrar la emoción, no deducirla.
   */
  feeling: ArrivalKey | null;
  setChoice(id: AtmosphereId, feeling?: ArrivalKey | null): void;
  clear(): void;
};

/** Sólo una clave del registro `ARRIVALS` es válida; cualquier otro valor se descarta. */
function isArrivalKey(value: unknown): value is ArrivalKey {
  return typeof value === 'string' && Object.prototype.hasOwnProperty.call(ARRIVALS, value);
}

/**
 * Elección de tema, global: manda en todo el sitio. Vive en `localStorage` y dura
 * entre visitas; sin ella, cada lugar usa el tema que sugiere.
 */
export const useAtmosphereStore = create<AtmosphereState>()(
  persist(
    (set) => ({
      choice: null,
      feeling: null,
      setChoice: (id, feeling = null) => set({ choice: id, feeling }),
      clear: () => set({ choice: null, feeling: null }),
    }),
    {
      name: ATMOSPHERE_STORAGE_KEY,
      version: ATMOSPHERE_STORE_VERSION,
      // En el servidor no hay `localStorage`: `createJSONStorage` lo absorbe
      // y el store funciona sin persistir.
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ choice: state.choice, feeling: state.feeling }),
      // Un valor guardado que no es uno de los cinco temas se descarta, y sin
      // elección no hay emoción que nombrar.
      merge: (persisted, current) => {
        const saved = persisted as { choice?: unknown; feeling?: unknown } | undefined;
        const choice = isAtmosphereId(saved?.choice) ? saved.choice : null;
        const feeling = choice !== null && isArrivalKey(saved?.feeling) ? saved.feeling : null;

        return { ...current, choice, feeling };
      },
    },
  ),
);
