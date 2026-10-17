import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';

import {
  JOURNAL_STORE_VERSION,
  migrateJournal,
  stampLegacyVersion,
  type StoredJournal,
} from '@/lib/journal/migrate';
import type { MoodId } from '@/types/mood';

/** Una entrada del diario. `mood` es `null` sólo si el dato guardado no se reconoce. */
export type JournalEntry = StoredJournal['entries'][number];

type JournalState = {
  entries: JournalEntry[];
  draft: { mood: MoodId | null; text: string };
  setMood(mood: MoodId): void;
  setText(t: string): void;
  save(now: Date): void;
  discard(): void;
};

/**
 * `localStorage` con una red de seguridad al leer: un blob sin versión pasa
 * por `migrate`. Si `localStorage` no existe (servidor), el acceso lanza aquí y
 * `createJSONStorage` deja el store sin persistencia, como antes.
 */
function journalStorage(): StateStorage {
  const storage = localStorage;

  return {
    getItem: (name) => stampLegacyVersion(storage.getItem(name)),
    setItem: (name, value) => storage.setItem(name, value),
    removeItem: (name) => storage.removeItem(name),
  };
}

export const useJournalStore = create<JournalState>()(
  persist(
    (set) => ({
      entries: [],
      draft: { mood: null, text: '' },
      setMood: (mood) => set((state) => ({ draft: { ...state.draft, mood } })),
      setText: (t) => set((state) => ({ draft: { ...state.draft, text: t } })),
      save: (now) =>
        set((state) => {
          if (!state.draft.text.trim() || state.draft.mood === null) return state;

          const entry: JournalEntry = {
            id: crypto.randomUUID(),
            mood: state.draft.mood,
            text: state.draft.text.trim(),
            createdAt: now.toISOString(),
          };

          return {
            entries: [entry, ...state.entries],
            draft: { mood: null, text: '' },
          };
        }),
      discard: () => set({ draft: { mood: null, text: '' } }),
    }),
    {
      name: 'fm.journal',
      version: JOURNAL_STORE_VERSION,
      storage: createJSONStorage(journalStorage),
      // Lo guardado en la v0 (ánimo por índice) se convierte a ids; lo que no se
      // reconoce queda en `null` y no se pierde la entrada.
      migrate: (persisted, fromVersion) => migrateJournal(persisted, fromVersion),
    },
  ),
);
