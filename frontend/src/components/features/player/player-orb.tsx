import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

/** La misma luz especular del disco de frecuencia. */
const SHEEN = 'radial-gradient(70% 80% at 32% 22%, rgba(247,244,234,0.24), transparent 62%)';

const RING_RADIUS = 47;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

type PlayerOrbProps = {
  /** Banda del audio que suena. */
  band: string;
  /** Avance 0–100. Con valor, un aro dorado lo dibuja alrededor de la esfera. */
  progress?: number;
  children?: ReactNode;
  className?: string;
};

/**
 * El audio en miniatura: la esfera del disco de frecuencia a escala de
 * control. Es la carátula del dock y, con su aro de avance, el reproductor
 * recogido. Decorativa: quien la contiene pone el nombre accesible.
 */
export function PlayerOrb({ band, progress, children, className }: PlayerOrbProps) {
  const hasRing = progress !== undefined;

  return (
    <span aria-hidden="true" className={cn('relative block shrink-0 rounded-full', className)}>
      {hasRing ? (
        <svg viewBox="0 0 100 100" className="absolute inset-0 size-full -rotate-90">
          <circle
            cx="50"
            cy="50"
            r={RING_RADIUS}
            fill="none"
            strokeWidth="2.5"
            className="stroke-ivory/14"
          />
          <circle
            cx="50"
            cy="50"
            r={RING_RADIUS}
            fill="none"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="stroke-gold"
            strokeDasharray={RING_LENGTH}
            strokeDashoffset={RING_LENGTH * (1 - Math.min(100, Math.max(0, progress)) / 100)}
          />
        </svg>
      ) : null}
      <span
        className={cn(
          'border-glass-brd absolute flex items-center justify-center overflow-hidden rounded-full border',
          hasRing ? 'inset-[5px]' : 'inset-0',
        )}
        style={{ backgroundImage: band }}
      >
        <span className="absolute inset-0" style={{ backgroundImage: SHEEN }} />
        <span className="relative">{children}</span>
      </span>
    </span>
  );
}
