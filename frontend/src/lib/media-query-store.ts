/**
 * Un único `matchMedia` por consulta, compartido por todos los suscriptores.
 *
 * Sin esto, cada hook que mira una media query registra su propio objeto
 * `MediaQueryList` y su listener (`useReducedMotionSafe` lo hacía en 28 sitios).
 * Aquí una consulta tiene una entrada; su listener del navegador se registra
 * con el primer suscriptor, avisa a todos cuando cambia el valor y se retira
 * al quedarse sin suscriptores.
 *
 * Lo consume `useMediaQuery` vía `useSyncExternalStore`: `subscribe` y la
 * lectura son estables por consulta y el servidor siempre ve `false`.
 */

type MediaQueryEntry = {
  mql: MediaQueryList;
  listeners: Set<() => void>;
  /** Último valor visto: lo que devuelve la lectura mientras hay suscriptores. */
  value: boolean;
  /** Listener único del navegador para esta consulta. */
  handleChange: () => void;
};

const entries = new Map<string, MediaQueryEntry>();

/** En servidor o sin `matchMedia` (happy-dom parcial) ninguna consulta casa. */
function canMatch(): boolean {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function';
}

/**
 * Suscribe `onChange` a los cambios de `query`. Devuelve la función para
 * darse de baja; la última baja retira el listener del navegador.
 */
export function subscribeMediaQuery(query: string, onChange: () => void): () => void {
  if (!canMatch()) return () => {};

  let entry = entries.get(query);
  if (!entry) {
    const mql = window.matchMedia(query);
    const created: MediaQueryEntry = {
      mql,
      listeners: new Set(),
      value: mql.matches,
      handleChange: () => {
        const next = created.mql.matches;
        if (next === created.value) return;
        created.value = next;
        // Copia: un suscriptor puede darse de baja durante el aviso.
        for (const listener of [...created.listeners]) listener();
      },
    };
    mql.addEventListener('change', created.handleChange);
    entries.set(query, created);
    entry = created;
  }

  const current = entry;
  current.listeners.add(onChange);

  return () => {
    current.listeners.delete(onChange);
    if (current.listeners.size > 0) return;
    current.mql.removeEventListener('change', current.handleChange);
    if (entries.get(query) === current) entries.delete(query);
  };
}

/** Valor actual de `query`: el último visto si hay suscriptores, o una lectura directa. */
export function getMediaQueryMatch(query: string): boolean {
  const entry = entries.get(query);
  if (entry) return entry.value;
  return canMatch() ? window.matchMedia(query).matches : false;
}
