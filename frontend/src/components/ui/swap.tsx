'use client';

import type { ReactNode } from 'react';
import { AnimatePresence, useIsPresent, useReducedMotion } from 'motion/react';
import { div as Mdiv } from 'motion/react-m';

import { EASE, SWAP_PACE, type SwapPace } from '@/config/motion';

interface SwapProps {
  /** Identidad del contenido: al cambiar, el anterior sale y el nuevo entra. */
  id: string;
  children: ReactNode;
  /** Ritmo del intercambio (`SWAP_PACE`): ágil por defecto, `calm` para recorridos. */
  pace?: SwapPace;
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
 * Lo que sale queda inerte: mientras se funde no recibe clics ni foco, así
 * que un doble clic no actúa dos veces sobre un paso que ya se va.
 *
 * Sólo `opacity` y `transform`. Con movimiento reducido el cambio es
 * inmediato.
 */
export function Swap({ id, children, pace = 'default', className }: SwapProps) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <SwapPane key={id} pace={pace} className={className}>
        {children}
      </SwapPane>
    </AnimatePresence>
  );
}

function SwapPane({
  children,
  pace,
  className,
}: {
  children: ReactNode;
  pace: SwapPace;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const present = useIsPresent();
  const enter = reduced ? 0 : SWAP_PACE[pace].enter;
  const exit = reduced ? 0 : SWAP_PACE[pace].exit;

  return (
    <Mdiv
      inert={!present}
      initial={{ opacity: 0, y: reduced ? 0 : 10 }}
      animate={{ opacity: 1, y: 0, transition: { duration: enter, ease: EASE.soft } }}
      exit={{ opacity: 0, y: reduced ? 0 : -6, transition: { duration: exit, ease: EASE.soft } }}
      className={className}
    >
      {children}
    </Mdiv>
  );
}
