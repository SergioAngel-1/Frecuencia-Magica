import Image from 'next/image';

import { cn } from '@/lib/cn';
import { editorialVisual } from '@/lib/editorial/visual';
import type {
  EditorialMedia,
  EditorialMediaAspect,
  EditorialOverlayDirection,
  EditorialVisual,
} from '@/types/editorial-media';
import { Band } from './band';
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

/**
 * Materia fotográfica de un slot. Sin `src` pinta el fallback del contrato
 * (`editorialVisual`): zebra estática, la banda del ítem o nada. Un slot `none`
 * no deja marco ni scrim: la vista descansa sobre el world engine.
 */
export function EditorialImage({
  media,
  aspect,
  fill = true,
  priority,
  scrim,
  overlay,
  focalPoint,
  className,
}: EditorialImageProps) {
  const visual = editorialVisual(media);
  if (visual === 'none') return null;

  const scrimDirection = directionOrDefault(scrim, 'bottom');
  const overlayDirection = directionOrDefault(overlay, 'bottom');

  return (
    <div
      className={cn(
        'relative isolate overflow-hidden',
        fill ? 'h-full min-h-full' : 'w-full',
        className,
      )}
      data-media-slot={media.slot}
      data-media-visual={visual}
    >
      <EditorialMatter
        aspect={aspect}
        fill={fill}
        focalPoint={focalPoint}
        media={media}
        priority={priority}
        visual={visual}
      />
      {scrimDirection ? <EditorialOverlay direction={scrimDirection} /> : null}
      {overlayDirection ? <EditorialOverlay direction={overlayDirection} tone="teal" /> : null}
    </div>
  );
}

type EditorialMatterProps = Pick<
  EditorialImageProps,
  'media' | 'aspect' | 'fill' | 'priority' | 'focalPoint'
> & {
  visual: Exclude<EditorialVisual, 'none'>;
};

/** La capa de materia: foto, banda del ítem o zebra. */
function EditorialMatter({
  media,
  aspect,
  fill,
  priority,
  focalPoint,
  visual,
}: EditorialMatterProps) {
  if (visual === 'band' && media.band) {
    return (
      <Band className="h-full w-full" gradient={media.band}>
        <span className="sr-only">{media.alt}</span>
      </Band>
    );
  }

  if (visual === 'zebra' || !media.src) {
    return (
      <MediaSkeleton
        aspect={aspect ?? media.aspect}
        className="h-full w-full"
        label={media.alt}
        slot={media.slot}
      />
    );
  }

  const objectPosition = focalPoint ?? media.position ?? '50% 50%';

  return fill ? (
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
  );
}
