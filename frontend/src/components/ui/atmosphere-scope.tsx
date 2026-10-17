import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';
import type { AtmosphereId, AtmosphereScheme } from '@/types/atmosphere';

interface AtmosphereScopeProps {
  /** Atmósfera que tiñe esta sección: la misma clave que `[data-atmosphere]` en `tokens.css`. */
  atmosphere: AtmosphereId;
  /**
   * Esquema de la atmósfera (`data-scheme`). Lo pasa el consumidor desde
   * `ATMOSPHERES[atmosphere].scheme`: este componente no importa `config/`.
   */
  scheme: AtmosphereScheme;
  children: ReactNode;
  className?: string;
}

/**
 * Re-tematiza una sección con los tokens de una atmósfera. El bloque
 * `[data-atmosphere]` de `tokens.css` redefine la escalera de texto, los acentos
 * y el vidrio para todo lo que cuelga de este contenedor.
 *
 * Fija `text-fg` (`color: var(--color-fg)`) en su contenedor: la tinta es la de la
 * atmósfera de la sección y los hijos sin color propio, como un `Display`, la heredan.
 *
 * Presentacional y sin estado. Sólo añade los atributos: no decide la atmósfera.
 */
export function AtmosphereScope({ atmosphere, scheme, children, className }: AtmosphereScopeProps) {
  return (
    <div data-atmosphere={atmosphere} data-scheme={scheme} className={cn('text-fg', className)}>
      {children}
    </div>
  );
}
