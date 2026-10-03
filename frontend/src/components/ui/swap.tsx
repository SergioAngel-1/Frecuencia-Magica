'use client';

import type { ReactNode } from 'react';
import { AnimatePresence, useReducedMotion } from 'motion/react';
import { div as Mdiv } from 'motion/react-m';

import { DURATION, EASE } from '@/config/motion';

interface SwapProps {
  /** Identidad del contenido: al cambiar, el anterior sale y el nuevo entra. */
  id: string;
  children: ReactNode;
  className?: string;
}

/**
 * Intercambio de contenido sin salto.
 *
 * Cuando una zona cambia lo que muestra —un paso por el siguiente, un
 * formulario por su confirmación, una lista por su filtrado—, el contenido
 * anterior se funde y se va antes de que el nuevo emerja. Sin esto, React
 * sustituye un bloque por otro en el mismo fotograma y la entrada suave del
 * nuevo no tapa el corte del viejo.
 *
 * Sólo `opacity` y `transform`. Con movimiento reducido el cambio es
 * inmediato.
 */
export function Swap({ id, children, className }: SwapProps) {
  const reduced = useReducedMotion();
  const enter = reduced ? 0 : DURATION.reveal;
  const exit = reduced ? 0 : DURATION.fast * 0.6;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Mdiv
        key={id}
        initial={{ opacity: 0, y: reduced ? 0 : 10 }}
        animate={{ opacity: 1, y: 0, transition: { duration: enter, ease: EASE.soft } }}
        exit={{ opacity: 0, y: reduced ? 0 : -6, transition: { duration: exit, ease: EASE.soft } }}
        className={className}
      >
        {children}
      </Mdiv>
    </AnimatePresence>
  );
}
