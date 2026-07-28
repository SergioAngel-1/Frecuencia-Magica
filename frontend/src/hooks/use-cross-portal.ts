'use client';

import { useCallback, useEffect, useRef } from 'react';

import { useRouter } from '@/i18n/navigation';
import { useAmbientStore } from '@/stores/ambient-store';
import { usePortalStore } from '@/stores/portal-store';

/**
 * Hook que orquesta el cruce del portal: activa el audio ambiental si estaba
 * apagado, dispara la coreografía visual y navega a `/inicio` en el momento
 * exacto en que el círculo del overlay cubre la pantalla (1000 ms).
 *
 * Devuelve una función estable que puede pasarse como `onClick` sin causar
 * re-renderizados del botón.
 */
export function useCrossPortal(): () => void {
  const router = useRouter();
  const navTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (navTimerRef.current) clearTimeout(navTimerRef.current);
    };
  }, []);

  const cross = useCallback(() => {
    const { phase } = usePortalStore.getState();
    if (phase !== 'idle') return;

    if (!useAmbientStore.getState().enabled) {
      useAmbientStore.getState().toggle();
    }

    usePortalStore.getState().cross();

    navTimerRef.current = setTimeout(() => {
      router.push('/inicio');
    }, 1000);
  }, [router]);

  return cross;
}
