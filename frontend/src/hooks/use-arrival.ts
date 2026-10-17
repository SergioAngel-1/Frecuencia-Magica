'use client';

import { useCallback, useState } from 'react';

import type { ArrivalKey } from '@/config/arrivals';
import { AUDIOS } from '@/data/audios';
import {
  chooseArrival,
  currentAlternative,
  cycleAtmosphere,
  IDLE_ARRIVAL,
  stepAlternative,
  type ArrivalFlow,
} from '@/lib/arrival/flow';
import { usePlayerStore } from '@/stores/player-store';
import { useAtmosphereStore } from '@/stores/atmosphere-store';

/**
 * Subida de la primera pista de una llegada, en segundos. Entra en fundido
 * desde el silencio, sin tocar el volumen guardado del reproductor.
 */
export const ARRIVAL_FADE_IN_SECONDS = 2.5;

export type ArrivalControls = {
  flow: ArrivalFlow;
  /**
   * Elige una entrada: fija la atmósfera y, con el gesto, abre la primera pista.
   * `featuredId` es la pista que recomienda el disco de Descúbrete, si la hay.
   */
  choose(key: ArrivalKey, featuredId?: string): void;
  /** Siguiente (`1`) o anterior (`-1`) alternativa; abre la que queda. */
  step(delta: 1 | -1): void;
  /** «Elegir otra opción»: otra atmósfera, sin reiniciar el flujo ni cortar el sonido. */
  other(): void;
  /** Para el sonido. El panel se queda como estaba. */
  stop(): void;
};

/**
 * Estado de una llegada en la interfaz. La decisión está en las funciones
 * puras (`chooseArrival`, `stepAlternative`, `cycleAtmosphere`); este hook sólo
 * aplica sus efectos: la atmósfera manual y el reproductor.
 */
export function useArrival(): ArrivalControls {
  const [flow, setFlow] = useState<ArrivalFlow>(IDLE_ARRIVAL);
  const setManual = useAtmosphereStore((state) => state.setManual);
  const open = usePlayerStore((state) => state.open);
  const close = usePlayerStore((state) => state.close);

  const choose = useCallback(
    (key: ArrivalKey, featuredId?: string) => {
      const next = chooseArrival(key, {
        catalog: AUDIOS,
        hour: new Date().getHours(),
        ...(featuredId ? { featuredId } : {}),
      });
      setFlow(next);
      if (next.atmosphere) setManual(next.atmosphere);

      const audio = currentAlternative(next);
      if (audio) open(audio.id, 'full', { fadeIn: ARRIVAL_FADE_IN_SECONDS });
    },
    [open, setManual],
  );

  const step = useCallback(
    (delta: 1 | -1) => {
      const next = stepAlternative(flow, delta);
      if (next === flow) return;

      setFlow(next);
      const audio = currentAlternative(next);
      if (audio) open(audio.id);
    },
    [flow, open],
  );

  const other = useCallback(() => {
    const next = cycleAtmosphere(flow);
    setFlow(next);
    if (next.atmosphere) setManual(next.atmosphere);
  }, [flow, setManual]);

  return { flow, choose, step, other, stop: close };
}
