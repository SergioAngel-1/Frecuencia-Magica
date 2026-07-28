'use client';

import { AnimatePresence, motion } from 'motion/react';
import type { ReactNode } from 'react';

import { DURATION, EASE } from '@/config/motion';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { usePathname } from '@/i18n/navigation';

/**
 * Fundido entre realms.
 *
 * Sólo opacidad, sin desplazamiento: el prototipo cruza de un mundo a otro
 * sin mover la cámara, y añadir un `translateY` rompería la continuidad
 * espacial. El desplazamiento se reserva para las entradas escalonadas
 * dentro de cada vista.
 */
export function RouteTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reducedMotion = useReducedMotionSafe();

  if (reducedMotion) return <>{children}</>;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: DURATION.base, ease: EASE.soft } }}
        exit={{ opacity: 0, transition: { duration: DURATION.fast, ease: EASE.soft } }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
