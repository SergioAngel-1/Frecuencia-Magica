import type { CSSProperties } from 'react';

import { cn } from '@/lib/cn';

export type SkeletonVariant = 'text' | 'disc' | 'card' | 'band';

/** Barrido de luz. Sustituye al spinner: nunca un spinner como carga principal. */
const SHIMMER =
  'linear-gradient(90deg, rgba(247,244,234,0.04), rgba(247,244,234,0.10), rgba(247,244,234,0.04))';

const VARIANT_CLASSES: Record<SkeletonVariant, string> = {
  text: 'h-[1em] rounded-[4px]',
  disc: 'aspect-square rounded-full',
  card: 'rounded-card',
  band: 'rounded-card',
};

interface SkeletonProps {
  variant?: SkeletonVariant;
  className?: string;
  style?: CSSProperties;
}

/**
 * Silueta de carga. Se compone para reproducir la forma de la vista que
 * está llegando — un disco donde habrá un disco, una banda donde habrá una
 * banda — de modo que la página no salte al resolverse.
 *
 * El contenedor que lo agrupa debe llevar `aria-busy="true"`.
 */
export function Skeleton({ variant = 'text', className, style }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn('animate-fm-shimmer w-full', VARIANT_CLASSES[variant], className)}
      style={{ backgroundImage: SHIMMER, backgroundSize: '200% 100%', ...style }}
    />
  );
}
