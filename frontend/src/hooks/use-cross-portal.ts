'use client';

import { useCallback, useEffect, useRef } from 'react';

import { PORTAL_TIMING } from '@/config/motion';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { useRouter } from '@/i18n/navigation';
import {
  markPortalCrossed,
  readLastPortalCross,
  shouldPlayPortalChoreography,
} from '@/lib/portal/cooldown';
import { useAmbientStore } from '@/stores/ambient-store';
import { usePortalStore } from '@/stores/portal-store';

/** Fundido corto cuando la coreografía completa no toca (reciente o reduced). */
const QUICK_MS = 250;

/**
 * Hook que orquesta el cruce del portal: activa el audio ambiental si estaba
 * apagado, dispara la coreografía visual y navega a `/inicio` en el momento
 * exacto en que el círculo del overlay cubre la pantalla (1000 ms).
 *
 * La coreografía completa sólo se reproduce la primera vez o tras la ventana
 * de reposo de 24 h (`lib/portal/cooldown`); los cruces recientes usan un
 * fundido corto. Con movimiento reducido el overlay es un fundido
 * instantáneo: la navegación y la coreografía se acortan para no dejar una
 * pantalla negra parpadeando.
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

    const quick = reduced || !fullChoreography;
    const timing = quick ? { navigate: QUICK_MS, reveal: QUICK_MS, settle: QUICK_MS } : undefined;
    usePortalStore.getState().cross(timing);

    navTimerRef.current = setTimeout(() => {
      router.push('/inicio');
    }, quick ? QUICK_MS : PORTAL_TIMING.navigate);
  }, [router, reduced]);

  return cross;
}
