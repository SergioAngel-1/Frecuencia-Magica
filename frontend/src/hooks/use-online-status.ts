'use client';

import { useSyncExternalStore } from 'react';

import { readOnline, subscribeConnectivity } from '@/lib/connectivity';

const subscribe = (onChange: () => void) => subscribeConnectivity(window, onChange);
const getSnapshot = () => readOnline(navigator);
// En servidor y en la hidratación se pinta «en línea»: el velo nunca sale en el HTML.
const getServerSnapshot = () => true;

/** `true` mientras el navegador tenga red; cambia con los eventos `online`/`offline`. */
export function useOnlineStatus(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
