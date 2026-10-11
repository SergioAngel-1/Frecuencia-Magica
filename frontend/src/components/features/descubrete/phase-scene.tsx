'use client';

import type { ReactNode } from 'react';
import { AnimatePresence, useIsPresent } from 'motion/react';
import { div as Mdiv } from 'motion/react-m';

import { EASE, PHASE_FADE } from '@/config/motion';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';

/**
 * Cambio de fase del quiz: la escena entera (fondo, halo, aros y paso) se
 * funde a la noche antes de que amanezca la siguiente. Sin esto, el fondo
 * saltaba en seco de la atmósfera de las preguntas a la sintonía y sólo el
 * texto tenía fundido. Las preguntas de una misma fase siguen cambiando con
 * el `Swap` interior. Sólo opacidad: una escala sobre una sección de 100vw
 * desbordaría el ancho.
 */
export function PhaseScene({ phase, children }: { phase: string; children: ReactNode }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <ScenePane key={phase}>{children}</ScenePane>
    </AnimatePresence>
  );
}

function ScenePane({ children }: { children: ReactNode }) {
  const reduced = useReducedMotionSafe();
  // La escena que se va no recibe clics: el paso siguiente ya está decidido.
  const present = useIsPresent();

  return (
    <Mdiv
      inert={!present}
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { duration: reduced ? 0 : PHASE_FADE.enter, ease: EASE.soft },
      }}
      exit={{
        opacity: 0,
        transition: { duration: reduced ? 0 : PHASE_FADE.exit, ease: EASE.soft },
      }}
    >
      {children}
    </Mdiv>
  );
}
