'use client';

import { useCallback, useEffect, useRef } from 'react';

import { PORTAL_TIMING } from '@/config/motion';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { portalModeFor } from '@/lib/portal/cooldown';
import { usePortalStore } from '@/stores/portal-store';

type PortalReveal = {
  /**
   * Cubre la pantalla con el iris del portal y llama a `onCovered` cuando la
   * noche ya la tapa: ahí se cambia el contenido sin que se vea el corte.
   */
  cover(onCovered: () => void): void;
  /** El contenido nuevo ya está montado: la noche puede disolverse. */
  arrive(): void;
};

/**
 * El cruce del portal sin navegar: la misma coreografía que lleva del portal
 * al inicio, pero para revelar algo en la misma vista (el resultado de
 * Descúbrete). No toca el audio ambiental ni el reposo de 24 h del portal:
 * usa siempre la apertura ágil (`brief`) o, con movimiento reducido, el
 * fundido (`quick`).
 *
 * Quien lo usa debe llamar a `arrive()` al montar lo revelado; si no, el
 * velo espera `PORTAL_MAX_HOLD`.
 */
export function usePortalReveal(): PortalReveal {
  const reduced = useReducedMotionSafe();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const cover = useCallback(
    (onCovered: () => void) => {
      const portal = usePortalStore.getState();
      // Con otro cruce en marcha no se encadena un segundo: se cambia ya.
      if (portal.phase !== 'idle') {
        onCovered();
        return;
      }

      const mode = portalModeFor(reduced, false);
      portal.cross(mode, 'reveal');
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(onCovered, PORTAL_TIMING[mode].cover);
    },
    [reduced],
  );

  const arrive = useCallback(() => usePortalStore.getState().arrive(), []);

  return { cover, arrive };
}
