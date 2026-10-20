import { create } from 'zustand';

import {
  ATMOSPHERE_SHIFT_COVER_GRACE_MS,
  ATMOSPHERE_SHIFT_TIMING,
  type AtmosphereShiftMode,
} from '@/config/motion';
import { preloadTheme } from '@/lib/atmosphere/photo-preload';
import type { ShiftRequest } from '@/lib/atmosphere/shift';
import { useAtmosphereStore } from '@/stores/atmosphere-store';

/**
 * Fases del cambio de atmósfera:
 * - `confirming`: se pide confirmación (sólo en un cambio manual).
 * - `in`: la luz del tema nuevo cubre la pantalla.
 * - `hold`: pantalla cubierta; el tema ya está aplicado debajo y el velo muestra su frase.
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
  /**
   * El velo ya cubre la pantalla: aplica el tema y pasa a `hold`. Lo llama `AtmosphereShiftVeil` al
   * acabar su fundido; sin este aviso, el plazo de respaldo lo hace igualmente. Sólo vale en `in`.
   */
  covered(): void;
  /** Cruza sin confirmar (el cambio ya fue una elección explícita). */
  cross(
    request: ShiftRequest,
    options?: { mode?: AtmosphereShiftMode; origin?: ShiftOrigin | null },
  ): void;
};

let timers: ReturnType<typeof setTimeout>[] = [];
let crossing = 0;
/** Cubre el cruce en marcha: la llama el aviso del velo o, si éste no llega, el plazo de respaldo. */
let applyCover: (() => void) | null = null;

function clearTimers() {
  for (const timer of timers) clearTimeout(timer);
  timers = [];
  applyCover = null;
}

/**
 * Aplica la elección al store de tema: la única escritura del cambio. Después avisa a quien la
 * pidió (`onApplied`): con ceremonia, eso ocurre bajo el velo, nunca antes de aceptar.
 */
export function applyChoice(request: ShiftRequest) {
  const atmosphere = useAtmosphereStore.getState();

  if (request.choice === null) atmosphere.clear();
  else atmosphere.setChoice(request.choice, request.feeling);

  request.onApplied?.();
}

/**
 * Secuencia del cambio de atmósfera. El reposo y la salida van por reloj
 * (`ATMOSPHERE_SHIFT_TIMING`); la entrada no: el tema se aplica cuando el velo avisa de que ya
 * cubre la pantalla (`covered`), así que el salto de fondo, imágenes y sonido ocurre siempre debajo
 * de un velo opaco. Un temporizador no puede saber cuándo ha llegado la animación a su final: el
 * velo arranca después de pintar. El plazo de respaldo sólo cubre al velo que nunca avisa.
 */
export const useAtmosphereShiftStore = create<ShiftState>((set, get) => {
  const run = (request: ShiftRequest, mode: AtmosphereShiftMode, origin: ShiftOrigin | null) => {
    const timing = ATMOSPHERE_SHIFT_TIMING[mode];
    const id = ++crossing;

    clearTimers();
    const ready = preloadTheme(request.resolved);
    set({ phase: 'in', mode, request, origin });

    const cover = () => {
      if (id !== crossing || get().phase !== 'in') return;

      applyCover = null;
      applyChoice(request);
      set({ phase: 'hold' });

      let holdElapsed = false;
      let preloadDone = false;

      // La revelación espera a que pasen `hold` y a que las fotos del tema estén
      // listas (la precarga tiene su propio tope), lo que tarde más.
      const revealIfReady = () => {
        if (!holdElapsed || !preloadDone || id !== crossing) return;

        set({ phase: 'out' });
        timers.push(
          setTimeout(() => {
            if (id !== crossing) return;

            set({ phase: 'idle', request: null });
          }, timing.reveal),
        );
      };

      timers.push(
        setTimeout(() => {
          holdElapsed = true;
          revealIfReady();
        }, timing.hold),
      );

      const markReady = () => {
        preloadDone = true;
        revealIfReady();
      };
      void ready.then(markReady, markReady);
    };

    applyCover = cover;
    timers.push(setTimeout(cover, timing.cover + ATMOSPHERE_SHIFT_COVER_GRACE_MS));
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
    covered: () => applyCover?.(),
    cross: (request, { mode = 'full', origin = null } = {}) => {
      if (get().phase !== 'idle') return;

      run(request, mode, origin);
    },
  };
});
