import { create } from 'zustand';

import { PORTAL_MAX_HOLD, PORTAL_TIMING, type PortalMode } from '@/config/motion';

/**
 * Fases del cruce:
 * - `in`: la noche cubre la pantalla.
 * - `hold`: pantalla cubierta; se espera a que llegue el destino.
 * - `out`: la noche se disuelve sobre el destino.
 */
export type PortalPhase = 'idle' | 'in' | 'hold' | 'out';

type PortalState = {
  phase: PortalPhase;
  /** Coreografía en curso: el iris completo o el fundido breve. */
  mode: PortalMode;
  /** Inicia el cruce. Uno en marcha no se reinicia. */
  cross(mode?: PortalMode): void;
  /** El destino ya está montado: la revelación puede empezar. */
  arrive(): void;
  setPhase(phase: PortalPhase): void;
};

let coverTimer: ReturnType<typeof setTimeout> | null = null;
let holdTimer: ReturnType<typeof setTimeout> | null = null;
let revealTimer: ReturnType<typeof setTimeout> | null = null;
let settleTimer: ReturnType<typeof setTimeout> | null = null;
let arrived = false;
let revealing = false;

function clearTimers() {
  for (const timer of [coverTimer, holdTimer, revealTimer, settleTimer]) {
    if (timer) clearTimeout(timer);
  }
  coverTimer = holdTimer = revealTimer = settleTimer = null;
}

/**
 * Fase del cruce de portal. La entrada (`in`) dura lo que fija el modo; la
 * salida no va por reloj sino por llegada: el overlay sólo empieza a
 * disolverse cuando la pantalla está cubierta **y** el destino ha llegado
 * (`arrive`). Así la vista anterior nunca se asoma a través del velo, tarde
 * lo que tarde la ruta. Si el destino no llega, `PORTAL_MAX_HOLD` revela
 * igualmente.
 */
export const usePortalStore = create<PortalState>((set, get) => {
  const reveal = () => {
    if (revealing) return;
    revealing = true;
    if (holdTimer) clearTimeout(holdTimer);

    const timing = PORTAL_TIMING[get().mode];

    revealTimer = setTimeout(() => {
      set({ phase: 'out' });
      settleTimer = setTimeout(() => set({ phase: 'idle' }), timing.reveal);
    }, timing.settle);
  };

  return {
    phase: 'idle',
    mode: 'full',
    setPhase: (phase) => set({ phase }),
    cross: (mode = 'full') => {
      if (get().phase !== 'idle') return;

      clearTimers();
      arrived = false;
      revealing = false;

      set({ phase: 'in', mode });
      coverTimer = setTimeout(() => {
        set({ phase: 'hold' });
        if (arrived) reveal();
        else holdTimer = setTimeout(reveal, PORTAL_MAX_HOLD);
      }, PORTAL_TIMING[mode].cover);
    },
    arrive: () => {
      const { phase } = get();
      if (phase !== 'in' && phase !== 'hold') return;

      arrived = true;
      if (phase === 'hold') reveal();
    },
  };
});
