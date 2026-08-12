import { cn } from '@/lib/cn';
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
 */
export function MediaSkeleton({
  slot,
  label,
  aspect = '16:9',
  tone = 'gold',
  animated = true,
  className,
}: MediaSkeletonProps) {
  return (
    <div
      className={cn(
        'relative isolate overflow-hidden bg-void',
        ASPECT_CLASSES[aspect],
        className,
      )}
      data-media-slot={slot}
    >
      <span className="sr-only">{label}</span>
      <div
        aria-hidden="true"
        className={cn(
          'fm-editorial-zebra pointer-events-none absolute inset-0',
          animated && 'fm-editorial-zebra-sweep',
        )}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[12%] rounded-[38%] border border-gold/25 opacity-70"
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
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_100%_at_30%_10%,rgba(247,244,234,0.16),transparent_60%)]"
      />
    </div>
  );
}

export type { MediaSkeletonProps };
