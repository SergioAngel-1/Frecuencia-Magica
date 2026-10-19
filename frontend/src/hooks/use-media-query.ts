'use client';

import { useCallback, useSyncExternalStore } from 'react';

import { getMediaQueryMatch, subscribeMediaQuery } from '@/lib/media-query-store';

/** En servidor no hay ventana: `false`, y el cliente corrige al hidratar. */
const getServerSnapshot = (): boolean => false;

/**
 * `true` mientras la media query se cumple. En servidor, `false`: el cliente
 * corrige al hidratar (como `useReducedMotionSafe`). Las suscripciones se
 * comparten por consulta en `lib/media-query-store`.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => subscribeMediaQuery(query, onChange),
    [query],
  );

  const getSnapshot = useCallback(() => getMediaQueryMatch(query), [query]);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
