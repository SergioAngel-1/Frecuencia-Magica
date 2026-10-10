/** Lo mínimo de `window` para escuchar la red; se inyecta para poder testearlo. */
export interface ConnectivityTarget {
  addEventListener(type: 'online' | 'offline', listener: () => void): void;
  removeEventListener(type: 'online' | 'offline', listener: () => void): void;
}

/**
 * Suscribe `onChange` a los cortes y regresos de la red. Devuelve la baja,
 * con la forma que espera `useSyncExternalStore`.
 */
export function subscribeConnectivity(
  target: ConnectivityTarget,
  onChange: () => void,
): () => void {
  target.addEventListener('online', onChange);
  target.addEventListener('offline', onChange);

  return () => {
    target.removeEventListener('online', onChange);
    target.removeEventListener('offline', onChange);
  };
}

/**
 * ¿Hay red? Sin `navigator` (servidor) o sin `onLine` se asume que sí: el
 * velo de sin conexión sólo aparece ante un corte que el navegador afirma.
 */
export function readOnline(nav: { onLine?: boolean } | undefined): boolean {
  return nav?.onLine !== false;
}
