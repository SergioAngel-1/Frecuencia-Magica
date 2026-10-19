import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import {
  ARRIVAL_STORAGE_KEY,
  ARRIVAL_STORE_VERSION,
  ARRIVALS,
  type ArrivalKey,
} from '@/config/arrivals';

type ArrivalState = {
  /** Entrada que la persona eligió (estado del diario o intención); `null` si no eligió ninguna. */
  key: ArrivalKey | null;
  setKey(key: ArrivalKey): void;
  clear(): void;
};

/** Sólo una clave del registro `ARRIVALS` es válida; cualquier otro valor se descarta. */
function isArrivalKey(value: unknown): value is ArrivalKey {
  return typeof value === 'string' && Object.prototype.hasOwnProperty.call(ARRIVALS, value);
}

/**
 * Última llegada elegida, persistida entre visitas. Permite que la Home responda a lo
 * elegido en el portal sin volver a sonar: no abre pistas ni cambia el tema.
 */
export const useArrivalStore = create<ArrivalState>()(
  persist(
    (set) => ({
      key: null,
      setKey: (key) => set({ key }),
      clear: () => set({ key: null }),
    }),
    {
      name: ARRIVAL_STORAGE_KEY,
      version: ARRIVAL_STORE_VERSION,
      // En el servidor no hay `localStorage`: `createJSONStorage` lo absorbe.
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ key: state.key }),
      // Un valor guardado que no está en `ARRIVALS` (p. ej. una entrada retirada) se descarta.
      merge: (persisted, current) => {
        const key = (persisted as { key?: unknown } | undefined)?.key;

        return { ...current, key: isArrivalKey(key) ? key : null };
      },
    },
  ),
);
