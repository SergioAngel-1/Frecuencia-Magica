import type { CSSProperties } from 'react';

import { cn } from '@/lib/cn';
import { zebraVariant } from '@/lib/editorial/zebra';
import type {
  EditorialMediaAspect,
  MediaSkeletonProps,
  EditorialTone,
} from '@/types/editorial-media';

const ASPECT_CLASSES: Record<EditorialMediaAspect, string> = {
  viewport: 'min-h-[100svh]',
  '16:9': 'aspect-[16/9]',
  '16:8': 'aspect-[16/8]',
  '3:4': 'aspect-[3/4]',
  '1:1': 'aspect-square',
};

const TONE_CLASSES: Record<EditorialTone, string> = {
  gold: 'border-gold/35',
  teal: 'border-teal/35',
  lav: 'border-lav/35',
  ivory: 'border-ivory/25',
};

/**
 * Zebra editorial: a deliberate art-direction absence, never an empty box or
 * a fake image. The label remains available to assistive technology while every
 * visual layer stays decorative.
 *
 * La capa de bandas mide 124% del contenedor (`-inset-x-[12%]`) para que el
 * barrido horizontal nunca deje ver el fondo liso en un borde. El ángulo y la
 * fase salen del id del slot (`zebraVariant`), no del azar.
 */
export function MediaSkeleton({
  slot,
  label,
  aspect = '16:9',
  tone = 'gold',
  animated = true,
  className,
}: MediaSkeletonProps) {
  const variant = zebraVariant(slot);
  const zebraStyle = {
    '--fm-zebra-angle': `${variant.angle}deg`,
    animationDelay: `${variant.delay}s`,
  } as CSSProperties;

  return (
    <div
      className={cn('bg-void relative isolate overflow-hidden', ASPECT_CLASSES[aspect], className)}
      data-media-slot={slot}
    >
      <span className="sr-only">{label}</span>
      <div
        aria-hidden="true"
        className={cn(
          'fm-editorial-zebra pointer-events-none absolute -inset-x-[12%] inset-y-0',
          animated && 'fm-editorial-zebra-sweep',
        )}
        style={zebraStyle}
      />
      <div
        aria-hidden="true"
        className="border-gold/25 pointer-events-none absolute inset-[12%] rounded-[38%] border opacity-70"
        data-editorial-geometry="true"
      />
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-[20%] rotate-12 rounded-full border opacity-60',
          TONE_CLASSES[tone],
          animated && 'animate-fm-float-s',
        )}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_100%_at_30%_10%,rgba(247,244,234,0.07),transparent_60%)]"
      />
    </div>
  );
}

export type { MediaSkeletonProps };
