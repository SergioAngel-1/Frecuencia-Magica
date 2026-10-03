import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type CartState = {
  items: Record<string, number>;
  add(id: string): void;
  remove(id: string): void;
  setQuantity(id: string, n: number): void;
  clear(): void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: {},
      add: (id) =>
        set((state) => ({
          items: { ...state.items, [id]: (state.items[id] ?? 0) + 1 },
        })),
      remove: (id) =>
        set((state) => {
          const current = state.items[id];
          if (!current || current <= 1) {
            const { [id]: _, ...rest } = state.items;
            return { items: rest };
          }
          return { items: { ...state.items, [id]: current - 1 } };
        }),
      setQuantity: (id, n) =>
        set((state) => {
          if (n <= 0) {
            const { [id]: _, ...rest } = state.items;
            return { items: rest };
          }
          return { items: { ...state.items, [id]: n } };
        }),
      clear: () => set({ items: {} }),
    }),
    { name: 'fm.cart' },
  ),
);
