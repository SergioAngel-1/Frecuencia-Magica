import { create } from 'zustand';

import { PORTAL_TIMING } from '@/config/motion';

export type PortalPhase = 'idle' | 'in' | 'out';

type PortalState = {
  phase: PortalPhase;
  /** Dispara la coreografía de cruce: `in` → `out` → `idle`. */
  cross(): void;
  setPhase(phase: PortalPhase): void;
};

let navigateTimer: ReturnType<typeof setTimeout> | null = null;
let settleTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * Fase del cruce de portal. La coreografía es fija: al cruzar entra el overlay
 * (`in`), a los 1000 ms el consumidor navega y pasa a `out`, y a los 1900 ms
 * vuelve a reposo. Un cruce en marcha no se reinicia.
 */
export const usePortalStore = create<PortalState>((set, get) => ({
  phase: 'idle',
  setPhase: (phase) => set({ phase }),
  cross: () => {
    if (get().phase !== 'idle') return;

    if (navigateTimer) clearTimeout(navigateTimer);
    if (settleTimer) clearTimeout(settleTimer);

    set({ phase: 'in' });
    navigateTimer = setTimeout(() => set({ phase: 'out' }), PORTAL_TIMING.navigate);
    settleTimer = setTimeout(() => set({ phase: 'idle' }), PORTAL_TIMING.settle);
  },
}));
