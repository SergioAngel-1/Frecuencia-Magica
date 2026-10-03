'use client';

import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

/**
 * `false` en el servidor y durante la hidratación; `true` desde que el cliente
 * ya pintó. Sirve para estado persistido en `localStorage` (diario, carrito):
 * el servidor renderiza vacío y el cliente ya tiene datos, y pintar ambos en
 * el primer render provoca un desajuste de hidratación. Se lee el valor real
 * sólo cuando `useMounted()` es `true`.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
