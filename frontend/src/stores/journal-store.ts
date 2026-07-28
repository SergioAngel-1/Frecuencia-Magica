import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type JournalEntry = {
  id: string;
  mood: number;
  text: string;
  createdAt: string;
};

type JournalState = {
  entries: JournalEntry[];
  draft: { mood: number | null; text: string };
  setMood(i: number): void;
  setText(t: string): void;
  save(now: Date): void;
  discard(): void;
};

export const useJournalStore = create<JournalState>()(
  persist(
    (set) => ({
      entries: [],
      draft: { mood: null, text: '' },
      setMood: (i) =>
        set((state) => ({ draft: { ...state.draft, mood: i } })),
      setText: (t) =>
        set((state) => ({ draft: { ...state.draft, text: t } })),
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
    { name: 'fm.journal' },
  ),
);
