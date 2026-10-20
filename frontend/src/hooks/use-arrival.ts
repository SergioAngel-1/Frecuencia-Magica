'use client';

import { useCallback, useMemo, useState } from 'react';

import type { ArrivalKey } from '@/config/arrivals';
import { AUDIOS } from '@/data/audios';
import {
  ARRIVAL_FADE_IN_SECONDS,
  arrivalFadeIn,
  chooseArrival,
  currentAlternative,
  IDLE_ARRIVAL,
  nextAtmosphere,
  restoreArrival,
  stepAlternative,
  type ArrivalFlow,
} from '@/lib/arrival/flow';
import { useAtmosphere } from '@/hooks/use-atmosphere';
import { useAtmosphereShift } from '@/hooks/use-atmosphere-shift';
import { useMounted } from '@/hooks/use-mounted';
import type { AtmosphereId } from '@/types/atmosphere';
import { usePlayerStore } from '@/stores/player-store';
import { useArrivalStore } from '@/stores/arrival-store';

export type ArrivalControls = {
  flow: ArrivalFlow;
  /**
   * Tema visible que pintan el bloque, el panel y Descúbrete; antes de montar,
   * la noche (sin desajuste de hidratación).
   */
  atmosphere: AtmosphereId;
  /** Elige una entrada: fija el tema global y, con el gesto, abre la primera pista. */
  choose(key: ArrivalKey, featuredId?: string): void;
  /**
   * Elige una entrada sin sonido: fija el tema y la guarda, nada más. Lo usa el
   * portal, donde la persona puede elegir antes de cruzar sin que suene nada.
   * `onApplied` corre sólo si el tema se aplica: si se rechaza la confirmación,
   * no se escribe nada más (p. ej. el ánimo del diario).
   */
  pick(key: ArrivalKey, options?: { onApplied?: () => void }): void;
  /** Siguiente (`1`) o anterior (`-1`) alternativa; abre la que queda. */
  step(delta: 1 | -1): void;
  /** «Elegir otra opción»: otra atmósfera, desde la activa, sin cortar el sonido. */
  other(): void;
  /** Para el sonido. El panel se queda como estaba. */
  stop(): void;
};

export type ArrivalOptions = {
  /**
   * Muestra la última llegada guardada al montar, sin sonido. La piden la Home y el
   * portal; Descúbrete tiene su propia entrada y no debe heredar la de otra vista.
   */
  restore?: boolean;
};

/**
 * Estado de una llegada en la interfaz. La decisión está en las funciones
 * puras (`chooseArrival`, `restoreArrival`, `stepAlternative`, `nextAtmosphere`);
 * este hook sólo aplica sus efectos sobre el store de tema, el de llegada y el
 * reproductor. El tema es el visible (elección o el que sugiere el lugar), no un
 * estado propio: así «otra opción» parte del real también en modo automático.
 */
export function useArrival({ restore = false }: ArrivalOptions = {}): ArrivalControls {
  const [flow, setFlow] = useState<ArrivalFlow>(IDLE_ARRIVAL);
  const mounted = useMounted();
  const { atmosphereId } = useAtmosphere();
  const shift = useAtmosphereShift();
  const savedKey = useArrivalStore((state) => state.key);
  const setSavedKey = useArrivalStore((state) => state.setKey);
  const open = usePlayerStore((state) => state.open);
  const close = usePlayerStore((state) => state.close);

  // Sin elección hecha en esta vista, la última guardada se restaura sin sonar. Se
  // deriva en lugar de copiarse a `flow`: así no hay un efecto ni un render de más.
  const restored = useMemo<ArrivalFlow>(
    () =>
      restore && mounted && savedKey
        ? restoreArrival(savedKey, { catalog: AUDIOS, hour: new Date().getHours() })
        : IDLE_ARRIVAL,
    [restore, mounted, savedKey],
  );
  const current = flow.key === null ? restored : flow;

  const atmosphere: AtmosphereId = mounted ? atmosphereId : 'night';

  // Nada de lo que sigue a elegir ocurre antes de que el tema se aplique: si el cambio pide
  // confirmación y la persona la rechaza, ni la respuesta, ni la llegada guardada, ni el sonido
  // cambian. `commit` corre cuando el tema queda aplicado (bajo el velo, si lo hay).
  const select = useCallback(
    (
      key: ArrivalKey,
      {
        featuredId,
        sound = false,
        onApplied,
      }: { featuredId?: string; sound?: boolean; onApplied?: () => void },
    ) => {
      const next = chooseArrival(key, {
        catalog: AUDIOS,
        hour: new Date().getHours(),
        ...(featuredId ? { featuredId } : {}),
      });
      const commit = () => {
        setFlow(next);
        setSavedKey(key);
        onApplied?.();

        const audio = sound ? currentAlternative(next) : null;
        if (audio) open(audio.id, 'full', { fadeIn: ARRIVAL_FADE_IN_SECONDS });
      };

      if (next.response) {
        shift(next.response.atmosphere, { source: 'feeling', feeling: key, onApplied: commit });
      } else {
        commit();
      }
    },
    [shift, setSavedKey, open],
  );

  const pick = useCallback(
    (key: ArrivalKey, options: { onApplied?: () => void } = {}) => select(key, options),
    [select],
  );

  const choose = useCallback(
    (key: ArrivalKey, featuredId?: string) =>
      select(key, { sound: true, ...(featuredId ? { featuredId } : {}) }),
    [select],
  );

  const step = useCallback(
    (delta: 1 | -1) => {
      const next = stepAlternative(current, delta);
      if (next === current) return;

      setFlow(next);
      const audio = currentAlternative(next);
      // Lo decide el estado del reproductor en este instante, no el de la última render.
      const fadeIn = arrivalFadeIn(usePlayerStore.getState());
      if (audio) open(audio.id, 'full', { fadeIn });
    },
    [current, open],
  );

  const other = useCallback(() => {
    if (!current.response) return;
    shift(nextAtmosphere(current.response, atmosphereId), { source: 'feeling' });
  }, [current, atmosphereId, shift]);

  return { flow: current, atmosphere, choose, pick, step, other, stop: close };
}
