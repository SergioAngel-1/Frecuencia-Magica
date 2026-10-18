'use client';

import type { ReactNode } from 'react';

import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { cn } from '@/lib/cn';

type ArrivalRevealProps = {
  open: boolean;
  children: ReactNode;
};

/**
 * Muestra u oculta un bloque sin salto. La fila de rejilla pasa de `0fr` a `1fr`,
 * así lo que hay debajo se desplaza de forma gradual, y el bloque se funde con
 * `opacity`. Cerrado queda inerte: ni foco ni lectura. Con movimiento reducido
 * no hay desplazamiento: sólo un fundido corto.
 */
export function ArrivalReveal({ open, children }: ArrivalRevealProps) {
  const reduced = useReducedMotionSafe();

  return (
    <div
      inert={!open}
      className={cn(
        'grid',
        reduced
          ? 'transition-opacity duration-200'
          : 'transition-[grid-template-rows,opacity] duration-500 ease-out',
        open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
      )}
    >
      <div className="min-h-0 overflow-hidden">{children}</div>
    </div>
  );
}
