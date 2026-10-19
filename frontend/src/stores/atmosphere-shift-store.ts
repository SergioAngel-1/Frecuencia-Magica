import { create } from 'zustand';

import { ATMOSPHERE_SHIFT_TIMING, type AtmosphereShiftMode } from '@/config/motion';
import type { ShiftRequest } from '@/lib/atmosphere/shift';
import { useAtmosphereStore } from '@/stores/atmosphere-store';

/**
 * Fases del cambio de atmósfera:
 * - `confirming`: se pide confirmación (sólo en un cambio manual).
 * - `in`: la luz del tema nuevo cubre la pantalla.
 * - `hold`: pantalla cubierta; el tema ya está aplicado debajo y el velo muestra su nombre.
 * - `out`: el velo se disuelve sobre el mundo nuevo.
 */
export type ShiftPhase = 'idle' | 'confirming' | 'in' | 'hold' | 'out';

/** Punto de la pantalla del que nace la onda, en fracción del viewport (0–1). */
export type ShiftOrigin = { x: number; y: number };

type ShiftState = {
  phase: ShiftPhase;
  mode: AtmosphereShiftMode;
  request: ShiftRequest | null;
  origin: ShiftOrigin | null;
  /** Pide confirmación para el cambio. Uno en marcha no se pisa. */
  ask(request: ShiftRequest, origin?: ShiftOrigin | null): void;
  /** Acepta la confirmación: empieza el cruce. */
  confirm(mode?: AtmosphereShiftMode): void;
  /** Rechaza la confirmación: nada cambia. */
  cancel(): void;
  /** Cruza sin confirmar (el cambio ya fue una elección explícita). */
  cross(
    request: ShiftRequest,
    options?: { mode?: AtmosphereShiftMode; origin?: ShiftOrigin | null },
  ): void;
};

let timers: ReturnType<typeof setTimeout>[] = [];

function clearTimers() {
  for (const timer of timers) clearTimeout(timer);
  timers = [];
}

/** Aplica la elección al store de tema: la única escritura del cambio. */
export function applyChoice(request: ShiftRequest) {
  const atmosphere = useAtmosphereStore.getState();

  if (request.choice === null) atmosphere.clear();
  else atmosphere.setChoice(request.choice, request.feeling);
}

/**
 * Secuencia del cambio de atmósfera. La entrada y el reposo van por reloj
 * (`ATMOSPHERE_SHIFT_TIMING`); el tema se aplica en el instante en que la pantalla queda
 * cubierta, así que el salto de fondo, imágenes y sonido ocurre siempre debajo del velo.
 */
export const useAtmosphereShiftStore = create<ShiftState>((set, get) => {
  const run = (request: ShiftRequest, mode: AtmosphereShiftMode, origin: ShiftOrigin | null) => {
    const timing = ATMOSPHERE_SHIFT_TIMING[mode];

    clearTimers();
    set({ phase: 'in', mode, request, origin });

    timers.push(
      setTimeout(() => {
        applyChoice(request);
        set({ phase: 'hold' });

        timers.push(
          setTimeout(() => {
            set({ phase: 'out' });
            timers.push(setTimeout(() => set({ phase: 'idle', request: null }), timing.reveal));
          }, timing.hold),
        );
      }, timing.cover),
    );
  };

  return {
    phase: 'idle',
    mode: 'full',
    request: null,
    origin: null,
    ask: (request, origin = null) => {
      if (get().phase !== 'idle') return;

      set({ phase: 'confirming', request, origin });
    },
    confirm: (mode = 'full') => {
      const { phase, request, origin } = get();
      if (phase !== 'confirming' || !request) return;

      run(request, mode, origin);
    },
    cancel: () => {
      if (get().phase !== 'confirming') return;

      set({ phase: 'idle', request: null, origin: null });
    },
    cross: (request, { mode = 'full', origin = null } = {}) => {
      if (get().phase !== 'idle') return;

      run(request, mode, origin);
    },
  };
});
