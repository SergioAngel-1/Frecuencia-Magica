import type { CSSProperties } from 'react';
import Image from 'next/image';

import { cn } from '@/lib/cn';
import { editorialVisual } from '@/lib/editorial/visual';
import type {
  EditorialFade,
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
  priority?: boolean;
  scrim?: EditorialOverlayDirection | boolean;
  overlay?: EditorialOverlayDirection | boolean;
  focalPoint?: string;
  /** Bordes de la materia que se funden con la noche. Por defecto, ninguno. */
  fade?: EditorialFade;
  /** `sizes` de la caja, cuando quien la pinta sabe más que el contrato del slot. */
  sizes?: string;
  className?: string;
}

const FADE_CLASSES: Record<EditorialFade, string> = {
  both: 'fm-fade-top fm-fade-bottom',
  top: 'fm-fade-top',
  bottom: 'fm-fade-bottom',
  none: '',
};

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
 *
 * El fundido (`fade`) enmascara la capa de medios entera, materia y scrim
 * con el mismo alfa: si sólo se fundiera la foto, el scrim (88 % de noche en
 * su borde) seguiría dibujando la arista. El contenido vive fuera de este
 * componente y nunca se enmascara; en el borde fundido, el texto queda sobre
 * la noche, que ya cumple el contraste por sí sola.
 */
export function EditorialImage({
  media,
  aspect,
  priority,
  scrim,
  overlay,
  focalPoint,
  fade = 'none',
  sizes,
  className,
}: EditorialImageProps) {
  const visual = editorialVisual(media);
  if (visual === 'none') return null;

  const scrimDirection = directionOrDefault(scrim, 'bottom');
  const overlayDirection = directionOrDefault(overlay, 'bottom');

  return (
    <div
      className={cn(
        'relative isolate h-full min-h-full overflow-hidden',
        FADE_CLASSES[fade],
        className,
      )}
      data-media-slot={media.slot}
      data-media-visual={visual}
    >
      <EditorialMatter
        aspect={aspect}
        focalPoint={focalPoint}
        media={media}
        priority={priority}
        sizes={sizes}
        visual={visual}
      />
      {scrimDirection ? <EditorialOverlay direction={scrimDirection} /> : null}
      {overlayDirection ? <EditorialOverlay direction={overlayDirection} tone="teal" /> : null}
    </div>
  );
}

type EditorialMatterProps = Pick<
  EditorialImageProps,
  'media' | 'aspect' | 'priority' | 'focalPoint' | 'sizes'
> & {
  visual: Exclude<EditorialVisual, 'none'>;
};

/** La capa de materia: foto, banda del ítem o zebra. */
function EditorialMatter({
  media,
  aspect,
  priority,
  focalPoint,
  sizes,
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

  // El foco viaja como variables: el de móvil sólo rige por debajo de 768 px.
  const focus = {
    '--fm-pos': focalPoint ?? media.position ?? '50% 50%',
    ...(media.mobilePosition ? { '--fm-pos-mobile': media.mobilePosition } : {}),
  } as CSSProperties;

  return (
    <Image
      alt={media.alt}
      className="object-cover object-[var(--fm-pos-mobile,var(--fm-pos))] md:object-[var(--fm-pos)]"
      fill
      priority={priority ?? media.priority}
      sizes={sizes ?? media.sizes}
      src={media.src}
      style={focus}
    />
  );
}
