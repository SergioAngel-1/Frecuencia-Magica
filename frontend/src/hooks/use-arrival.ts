'use client';

import { useCallback, useState } from 'react';

import type { ArrivalKey } from '@/config/arrivals';
import { AUDIOS } from '@/data/audios';
import {
  ARRIVAL_FADE_IN_SECONDS,
  arrivalFadeIn,
  chooseArrival,
  currentAlternative,
  IDLE_ARRIVAL,
  nextAtmosphere,
  stepAlternative,
  type ArrivalFlow,
} from '@/lib/arrival/flow';
import { useMounted } from '@/hooks/use-mounted';
import type { AtmosphereId } from '@/types/atmosphere';
import { usePlayerStore } from '@/stores/player-store';
import { useAtmosphereStore } from '@/stores/atmosphere-store';

export type ArrivalControls = {
  flow: ArrivalFlow;
  /**
   * Tema que pintan el bloque, el panel y Descúbrete: el que la persona eligió,
   * o la noche. Antes de montar, la noche (sin desajuste de hidratación).
   */
  atmosphere: AtmosphereId;
  /** Elige una entrada: fija el tema global y, con el gesto, abre la primera pista. */
  choose(key: ArrivalKey, featuredId?: string): void;
  /** Siguiente (`1`) o anterior (`-1`) alternativa; abre la que queda. */
  step(delta: 1 | -1): void;
  /** «Elegir otra opción»: otra atmósfera, desde la activa, sin cortar el sonido. */
  other(): void;
  /** Para el sonido. El panel se queda como estaba. */
  stop(): void;
};

/**
 * Estado de una llegada en la interfaz. La decisión está en las funciones
 * puras (`chooseArrival`, `stepAlternative`, `nextAtmosphere`); este hook sólo
 * aplica sus efectos sobre el store de tema y el reproductor. El tema sale del
 * store, no de un estado propio: así «otra opción» parte del real.
 */
export function useArrival(): ArrivalControls {
  const [flow, setFlow] = useState<ArrivalFlow>(IDLE_ARRIVAL);
  const mounted = useMounted();
  const choice = useAtmosphereStore((state) => state.choice);
  const setChoice = useAtmosphereStore((state) => state.setChoice);
  const open = usePlayerStore((state) => state.open);
  const close = usePlayerStore((state) => state.close);

  const atmosphere: AtmosphereId = mounted && choice ? choice : 'night';

  const choose = useCallback(
    (key: ArrivalKey, featuredId?: string) => {
      const next = chooseArrival(key, {
        catalog: AUDIOS,
        hour: new Date().getHours(),
        ...(featuredId ? { featuredId } : {}),
      });
      setFlow(next);
      if (next.response) setChoice(next.response.atmosphere);

      const audio = currentAlternative(next);
      if (audio) open(audio.id, 'full', { fadeIn: ARRIVAL_FADE_IN_SECONDS });
    },
    [open, setChoice],
  );

  const step = useCallback(
    (delta: 1 | -1) => {
      const next = stepAlternative(flow, delta);
      if (next === flow) return;

      setFlow(next);
      const audio = currentAlternative(next);
      // Lo decide el estado del reproductor en este instante, no el de la última render.
      const fadeIn = arrivalFadeIn(usePlayerStore.getState());
      if (audio) open(audio.id, 'full', { fadeIn });
    },
    [flow, open],
  );

  const other = useCallback(() => {
    if (!flow.response) return;
    setChoice(nextAtmosphere(flow.response, choice ?? 'night'));
  }, [flow, choice, setChoice]);

  return { flow, atmosphere, choose, step, other, stop: close };
}
