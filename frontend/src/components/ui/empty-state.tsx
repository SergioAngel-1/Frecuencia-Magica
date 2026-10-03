import type { ReactNode } from 'react';

import { OrbitalRings } from '@/components/world/orbital-rings';
import { cn } from '@/lib/cn';

interface EmptyStateProps {
  /** Encabezado. Una invitación a actuar, nunca un lamento. */
  title: string;
  /** Frase de apoyo opcional. */
  body?: string;
  /** Acción de salida: normalmente un `Button` que lleva a donde sí hay algo. */
  action?: ReactNode;
  /** Sustituye la constelación apagada por otra composición. */
  illustration?: ReactNode;
  className?: string;
}

/**
 * Vacío con dirección.
 *
 * La ilustración por defecto es una constelación dormida: los mismos aros
 * del resto del mundo, pero tenues y con el nodo apagado. Nunca una caja
 * gris ni un icono genérico — el vacío sigue perteneciendo al universo.
 */
export function EmptyState({ title, body, action, illustration, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center px-6 py-[50px] text-center', className)}>
      {illustration ?? (
        <OrbitalRings
          size={120}
          spin={140}
          rings={[
            { r: 96, stroke: 'rgba(247,244,234,0.14)', width: 0.8 },
            { r: 62, stroke: 'rgba(247,244,234,0.10)', width: 0.7, dash: '1 8' },
          ]}
        >
          <OrbitalRings.Node angle={-90} radius={96} color="rgba(247,244,234,0.28)" size={6} />
        </OrbitalRings>
      )}

      <p className="text-fg-muted mt-[26px] max-w-[34ch] font-serif text-[clamp(20px,2.6vw,24px)] leading-[1.4] italic">
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
