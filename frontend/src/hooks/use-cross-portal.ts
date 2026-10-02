'use client';

import { useCallback, useEffect, useRef } from 'react';

import { PORTAL_TIMING, type PortalMode } from '@/config/motion';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { useRouter } from '@/i18n/navigation';
import {
  markPortalCrossed,
  readLastPortalCross,
  shouldPlayPortalChoreography,
} from '@/lib/portal/cooldown';
import { useAmbientStore } from '@/stores/ambient-store';
import { usePortalStore } from '@/stores/portal-store';

/**
 * Hook que orquesta el cruce del portal: activa el audio ambiental si estaba
 * apagado, dispara la coreografía visual y navega a `/inicio` en el momento
 * exacto en que la noche termina de cubrir la pantalla (`cover`). El destino
 * se precarga al pulsar, para que la espera a oscuras sea mínima.
 *
 * La coreografía completa sólo se reproduce la primera vez o tras la ventana
 * de reposo de 24 h (`lib/portal/cooldown`); los cruces recientes y el
 * movimiento reducido usan el fundido breve (`quick`).
 *
 * Devuelve una función estable que puede pasarse como `onClick` sin causar
 * re-renderizados del botón.
 */
export function useCrossPortal(): () => void {
  const router = useRouter();
  const reduced = useReducedMotionSafe();
  const navTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (navTimerRef.current) clearTimeout(navTimerRef.current);
    };
  }, []);

  const cross = useCallback(() => {
    const { phase } = usePortalStore.getState();
    if (phase !== 'idle') return;

    const fullChoreography = shouldPlayPortalChoreography(readLastPortalCross(), Date.now());
    markPortalCrossed();

    if (!useAmbientStore.getState().enabled) {
      useAmbientStore.getState().toggle();
    }

    const mode: PortalMode = reduced || !fullChoreography ? 'quick' : 'full';
    usePortalStore.getState().cross(mode);

    router.prefetch('/inicio');
    navTimerRef.current = setTimeout(() => {
      router.push('/inicio');
    }, PORTAL_TIMING[mode].cover);
  }, [router, reduced]);

  return cross;
}
