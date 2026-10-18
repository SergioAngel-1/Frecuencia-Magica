import type { CSSProperties } from 'react';
import Image from 'next/image';

import { LandscapeDrift } from '@/components/world/landscape-drift';
import { ThemedPhoto } from '@/components/world/themed-photo';
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
import { ASPECT_CLASSES, MediaSkeleton } from './media-skeleton';

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
  /**
   * Materia de una banda a sangre: dentro de una `BandChain`, el borde que
   * comparte con su vecina funde aunque `fade` no lo pida.
   */
  bandMedia?: boolean;
  /** Clases del velo tintado (`overlay`), p. ej. para pintarlo sólo en móvil. */
  overlayClassName?: string;
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
  bandMedia = false,
  overlayClassName,
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
      data-band-media={bandMedia ? 'true' : undefined}
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
      {overlayDirection ? (
        <EditorialOverlay direction={overlayDirection} tone="teal" className={overlayClassName} />
      ) : null}
    </div>
  );
}

type EditorialMatterProps = Pick<
  EditorialImageProps,
  'media' | 'aspect' | 'priority' | 'focalPoint' | 'sizes'
> & {
  visual: Exclude<EditorialVisual, 'none'>;
};

/** La capa de materia: foto, banda del ítem, zebra o el degradado de la atmósfera. */
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

  // El degradado de la atmósfera activa: `--atmo-backdrop` hereda del scope más
  // cercano (o de `<html>`). Mismo ratio que la foto, para que la caja no salte.
  if (visual === 'atmosphere') {
    return (
      <div
        className={cn('relative h-full w-full', ASPECT_CLASSES[aspect ?? media.aspect])}
        data-media-visual-atmosphere="true"
        style={{ background: 'var(--atmo-backdrop)' }}
      >
        <span className="sr-only">{media.alt}</span>
      </div>
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

  const photoSizes = sizes ?? media.sizes;
  const photoClass =
    'object-cover object-[var(--fm-pos-mobile,var(--fm-pos))] md:object-[var(--fm-pos)]';

  // Con imagen propia en algún tema, la foto la monta un hijo cliente que lee el tema activo.
  if (media.variants && Object.keys(media.variants).length > 0) {
    return (
      <ThemedPhoto
        className={photoClass}
        media={{ ...media, src: media.src }}
        priority={priority ?? media.priority ?? false}
        sizes={photoSizes}
        style={focus}
      />
    );
  }

  const photo = (
    <Image
      alt={media.alt}
      className={photoClass}
      fill
      priority={priority ?? media.priority}
      sizes={photoSizes}
      src={media.src}
      style={focus}
    />
  );

  // El paisaje de una atmósfera deriva despacio; el resto de fotos queda quieto.
  if (media.fallback !== 'atmosphere') return photo;

  return (
    <LandscapeDrift className="absolute inset-0">
      <div className="relative h-full w-full">{photo}</div>
    </LandscapeDrift>
  );
}
