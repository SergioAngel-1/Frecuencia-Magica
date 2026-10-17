'use client';

import type { ReactNode } from 'react';
import { div as Mdiv } from 'motion/react-m';

import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { driftPlan } from '@/lib/editorial/drift';

/**
 * Deriva lenta del paisaje de una atmósfera: un desplazamiento y una escala
 * muy suaves en bucle, sólo con `transform`. Con movimiento reducido no se
 * monta y el hijo se pinta tal cual.
 */
export function LandscapeDrift({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotionSafe();
  const plan = driftPlan(reduced);

  if (!plan) return <div className={className}>{children}</div>;

  return (
    <Mdiv
      className={className}
      animate={{
        x: ['0%', `-${plan.shiftPercent}%`, '0%'],
        scale: [1, plan.scale, 1],
      }}
      transition={{ duration: plan.seconds, repeat: Infinity, ease: 'easeInOut' }}
    >
      {children}
    </Mdiv>
  );
}
