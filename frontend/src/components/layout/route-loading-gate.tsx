'use client';

import { useEffect, useState, type ReactNode } from 'react';

import { useRouteWaitStore } from '@/stores/route-wait-store';

/**
 * Puerta de la escena de un `loading.tsx`. En una carga directa (el fallback llega con el HTML,
 * antes de que la app hidrate) la escena va en el árbol, como siempre. En una navegación del
 * cliente la oculta y avisa a `RouteTransition` (`useRouteWaitStore`), que es quien pinta la espera
 * entre vistas, una sola vez, con el tema de la vista de llegada. Se decide al montar: la escena de
 * una carga directa no desaparece porque la app hidrate después.
 */
export function RouteLoadingGate({ children }: { children: ReactNode }) {
  const [inTree] = useState(() => !useRouteWaitStore.getState().hydrated);

  useEffect(() => {
    if (inTree) return;

    const { enter, leave } = useRouteWaitStore.getState();

    enter();

    return leave;
  }, [inTree]);

  return inTree ? children : null;
}
