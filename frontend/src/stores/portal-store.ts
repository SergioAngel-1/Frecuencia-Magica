import { create } from 'zustand';

import { PORTAL_TIMING } from '@/config/motion';

export type PortalPhase = 'idle' | 'in' | 'out';

/** Timing de la coreografía; `cross` acepta sobreescribirlo (p. ej. con movimiento reducido). */
export type PortalTiming = {
  /** Momento en que el overlay cubre la pantalla y el consumidor navega. */
  navigate: number;
  /** Momento en que el overlay empieza a disolverse (la vista anterior ya salió). */
  reveal: number;
  /** Momento en que el overlay vuelve a reposo. */
  settle: number;
};

type PortalState = {
  phase: PortalPhase;
  /** Dispara la coreografía de cruce: `in` → `out` → `idle`. */
  cross(timing?: Partial<PortalTiming>): void;
  setPhase(phase: PortalPhase): void;
};

let navigateTimer: ReturnType<typeof setTimeout> | null = null;
let settleTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * Fase del cruce de portal. La coreografía es fija: al cruzar entra el overlay
 * (`in`), en `navigate` ms el consumidor navega, en `reveal` ms el overlay
 * empieza a disolverse —cuando la vista anterior ya terminó su salida— y en
 * `settle` ms vuelve a reposo. Un cruce en marcha no se reinicia. Con
 * movimiento reducido el consumidor pasa un timing corto (fundido instantáneo).
 */
export const usePortalStore = create<PortalState>((set, get) => ({
  phase: 'idle',
  setPhase: (phase) => set({ phase }),
  cross: (timing) => {
    if (get().phase !== 'idle') return;

    if (navigateTimer) clearTimeout(navigateTimer);
    if (settleTimer) clearTimeout(settleTimer);

    const { reveal, settle } = { ...PORTAL_TIMING, ...timing };

    set({ phase: 'in' });
    navigateTimer = setTimeout(() => set({ phase: 'out' }), reveal);
    settleTimer = setTimeout(() => set({ phase: 'idle' }), settle);
  },
}));
