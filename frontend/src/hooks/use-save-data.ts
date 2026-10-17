'use client';

import { useSyncExternalStore } from 'react';

/** `navigator.connection` aún no está en los tipos de DOM de TypeScript. */
type NetworkInformation = EventTarget & { saveData?: boolean };

function connection(): NetworkInformation | undefined {
  if (typeof navigator === 'undefined') return undefined;

  return (navigator as Navigator & { connection?: NetworkInformation }).connection;
}

function subscribe(onChange: () => void): () => void {
  const info = connection();
  info?.addEventListener('change', onChange);

  return () => info?.removeEventListener('change', onChange);
}

/**
 * `true` si la conexión pide ahorrar datos. En servidor se asume que no; el
 * cliente corrige al hidratar. Sin soporte del navegador, `false`.
 */
export function useSaveData(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => connection()?.saveData === true,
    () => false,
  );
}
