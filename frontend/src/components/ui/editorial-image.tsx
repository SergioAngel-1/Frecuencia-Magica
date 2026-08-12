import Image from 'next/image';

import { EDITORIAL_MEDIA_REGISTRY } from '@/config/editorial-media';
import { cn } from '@/lib/cn';
import type {
  EditorialMedia,
  EditorialOverlayDirection,
} from '@/types/editorial-media';
import { EditorialOverlay } from './editorial-overlay';
import { MediaSkeleton } from './media-skeleton';

export interface EditorialImageProps {
  media: EditorialMedia;
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
  fill = true,
  priority,
  scrim,
  overlay,
  focalPoint,
  className,
}: EditorialImageProps) {
  const definition = EDITORIAL_MEDIA_REGISTRY[media.slot];
  const scrimDirection = directionOrDefault(scrim, 'bottom');
  const overlayDirection = directionOrDefault(overlay, 'bottom');
  const objectPosition = focalPoint ?? media.position ?? definition.position;

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
          aspect={definition.aspect}
          label={media.alt}
          slot={media.slot}
        />
      )}
      {scrimDirection ? <EditorialOverlay direction={scrimDirection} /> : null}
      {overlayDirection ? <EditorialOverlay direction={overlayDirection} tone="teal" /> : null}
    </div>
  );
}
