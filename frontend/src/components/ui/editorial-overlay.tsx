import { cn } from '@/lib/cn';
import type {
  EditorialOverlayDirection,
  EditorialOverlayProps,
  EditorialTone,
} from '@/types/editorial-media';

const SCRIM_GRADIENTS: Record<EditorialOverlayDirection, string> = {
  left: 'linear-gradient(90deg, rgba(10,18,32,0.86) 0%, rgba(15,27,46,0.58) 44%, transparent 82%)',
  right: 'linear-gradient(270deg, rgba(10,18,32,0.86) 0%, rgba(15,27,46,0.58) 44%, transparent 82%)',
  bottom: 'linear-gradient(180deg, transparent 24%, rgba(15,27,46,0.76) 72%, rgba(10,18,32,0.88) 100%)',
  top: 'linear-gradient(0deg, transparent 24%, rgba(15,27,46,0.76) 72%, rgba(10,18,32,0.88) 100%)',
  none: 'none',
};

const TINTS: Record<EditorialTone, string> = {
  gold: 'rgba(216,185,120,0.08)',
  teal: 'rgba(150,198,188,0.08)',
  lav: 'rgba(185,176,214,0.08)',
  ivory: 'rgba(247,244,234,0.05)',
};

export function EditorialOverlay({
  direction = 'bottom',
  tone = 'gold',
  className,
}: EditorialOverlayProps) {
  const gradient = SCRIM_GRADIENTS[direction];
  const tint = direction === 'none' ? 'transparent' : TINTS[tone];

  return (
    <div
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 z-10', className)}
      style={{
        backgroundImage: `radial-gradient(80% 90% at 50% 0%, ${tint}, transparent 72%), ${gradient}`,
      }}
    />
  );
}

export type { EditorialOverlayDirection, EditorialOverlayProps, EditorialTone };
