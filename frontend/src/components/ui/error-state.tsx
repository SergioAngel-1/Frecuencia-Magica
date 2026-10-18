import type { ReactNode } from 'react';

import { OrbitalRings } from '@/components/world/orbital-rings';
import { cn } from '@/lib/cn';

export type ErrorTone = 'neutral' | 'warn';

/**
 * El aro roto: un solo trazo con un hueco largo. La circunferencia de r=96
 * es ~603, así que `'470 133'` deja abierto algo menos de un cuarto — se lee
 * como interrupción, no como línea de puntos.
 */
const BROKEN_ARC = '470 133';

interface ErrorStateProps {
  /** Qué ha pasado, en la voz de la interfaz. Sin disculpas ni vaguedad. */
  title: string;
  /** Qué puede hacer la persona a continuación. */
  body?: string;
  /** Acción de recuperación: normalmente reintentar. */
  action?: ReactNode;
  tone?: ErrorTone;
  className?: string;
}

/**
 * Fallo con salida.
 *
 * Misma composición que el vacío, pero el aro está partido: la geometría
 * cuenta la avería antes de que se lea el texto. `tone="warn"` tiñe el aro
 * de terracota, el único color añadido a la paleta.
 */
export function ErrorState({ title, body, action, tone = 'neutral', className }: ErrorStateProps) {
  const stroke =
    tone === 'warn'
      ? 'color-mix(in srgb, var(--color-warn) 55%, transparent)'
      : 'color-mix(in srgb, var(--color-fg) 20%, transparent)';

  return (
    <div
      role="alert"
      className={cn('flex flex-col items-center px-6 py-[50px] text-center', className)}
    >
      <OrbitalRings
        size={120}
        spin={200}
        direction="ccw"
        rings={[
          { r: 96, stroke, width: 1, dash: BROKEN_ARC },
          { r: 62, stroke: 'color-mix(in srgb, var(--color-fg) 10%, transparent)', width: 0.7 },
        ]}
      />

      <p className="text-fg-soft mt-[26px] max-w-[34ch] font-serif text-[clamp(20px,2.6vw,24px)] leading-[1.4]">
        {title}
      </p>

      {body ? (
        <p className="text-fg-meta text-body mt-[12px] max-w-[42ch] font-sans leading-[1.7]">
          {body}
        </p>
      ) : null}

      {action ? <div className="mt-[28px]">{action}</div> : null}
    </div>
  );
}
