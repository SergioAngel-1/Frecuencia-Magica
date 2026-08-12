import Image from 'next/image';

import { cn } from '@/lib/cn';
import type {
  EditorialMedia,
  EditorialMediaAspect,
  EditorialOverlayDirection,
} from '@/types/editorial-media';
import { EditorialOverlay } from './editorial-overlay';
import { MediaSkeleton } from './media-skeleton';

export interface EditorialImageProps {
  media: EditorialMedia;
  aspect?: EditorialMediaAspect;
  fill?: boolean;
  priority?: boolean;
  scrim?: EditorialOverlayDirection | boolean;
  overlay?: EditorialOverlayDirection | boolean;
  focalPoint?: string;
  className?: string;
}

function directionOrDefault(
  value: EditorialOverlayDirection | boolean | undefined,
  fallback: EditorialOverlayDirection,
): EditorialOverlayDirection | undefined {
  if (value === false) return undefined;
  if (value === true) return fallback;
  return value;
}

export function EditorialImage({
  media,
  aspect = '16:9',
  fill = true,
  priority,
  scrim,
  overlay,
  focalPoint,
  className,
}: EditorialImageProps) {
  const scrimDirection = directionOrDefault(scrim, 'bottom');
  const overlayDirection = directionOrDefault(overlay, 'bottom');
  const objectPosition = focalPoint ?? media.position ?? '50% 50%';

  return (
    <div
      className={cn(
        'relative isolate overflow-hidden',
        fill ? 'h-full min-h-full' : 'w-full',
        className,
      )}
      data-media-slot={media.slot}
    >
      {media.src ? (
        fill ? (
          <Image
            alt={media.alt}
            className="object-cover"
            fill
            priority={priority ?? media.priority}
            sizes={media.sizes}
            src={media.src}
            style={{ objectPosition }}
          />
        ) : (
          <Image
            alt={media.alt}
            className="h-auto w-full object-cover"
            height={900}
            priority={priority ?? media.priority}
            sizes={media.sizes}
            src={media.src}
            style={{ objectPosition }}
            width={1600}
          />
        )
      ) : (
        <MediaSkeleton
          aspect={aspect}
          label={media.alt}
          slot={media.slot}
        />
      )}
      {scrimDirection ? <EditorialOverlay direction={scrimDirection} /> : null}
      {overlayDirection ? <EditorialOverlay direction={overlayDirection} tone="teal" /> : null}
    </div>
  );
}
