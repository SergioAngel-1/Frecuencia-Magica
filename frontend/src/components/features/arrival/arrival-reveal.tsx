'use client';

import type { ReactNode } from 'react';

import { Collapse } from '@/components/ui';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';

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
    <Collapse
      open={open}
      className={reduced ? 'transition-opacity duration-200 ease-[ease]' : 'duration-500 ease-out'}
    >
      {children}
    </Collapse>
  );
}
