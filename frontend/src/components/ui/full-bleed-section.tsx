import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';
import type {
  EditorialFade,
  EditorialMedia,
  EditorialMediaAspect,
  EditorialMediaMode,
  EditorialOverlayDirection,
  EditorialScrimTone,
} from '@/types/editorial-media';
import { mediaLayout } from '@/lib/editorial/media-layout';
import { mediaSizes } from '@/lib/editorial/media-sizes';
import { EditorialImage } from './editorial-image';

export interface FullBleedSectionProps {
  media?: EditorialMedia;
  mode: EditorialMediaMode;
  children: ReactNode;
  overlay?: EditorialOverlayDirection | boolean;
  /**
   * Segundo velo, tintado, en la misma dirección del scrim. Por defecto se
   * pinta; `false` deja un solo velo más ligero, para una imagen de bajo
   * contraste que ya trae su propia luz, y `'mobile'` lo conserva sólo por
   * debajo de 768 px, donde el texto cae sobre la parte más luminosa.
   */
  tint?: boolean | 'mobile';
  /**
   * Bordes de la imagen que se funden con la noche. Por defecto los dos: una
   * banda a sangre nunca termina en arista. Lo que roza el header funde sólo
   * el inferior (`'bottom'`). En `anchored` el borde inferior funde siempre.
   */
  fade?: EditorialFade;
  /** `sizes` explícito; sin él se deriva del modo y del ratio (`mediaSizes`). */
  sizes?: string;
  minHeight?: string;
  /** Id del titular que nombra la sección (`aria-labelledby`). */
  labelledBy?: string;
  className?: string;
  /**
   * Clases de la capa de medios. Para recomponer la caja de la imagen en un
   * breakpoint (p. ej. bajarla en móvil para que el sujeto quede bajo el
   * texto) sin tocar el foco del contrato, que no mueve nada cuando la imagen
   * ya llena la caja en ese eje.
   */
  mediaClassName?: string;
  contentClassName?: string;
  /** Esquema de los velos: `light` sobre una atmósfera clara (ver `EditorialOverlay`). */
  scrimTone?: EditorialScrimTone;
}

const MODE_CLASSES: Record<EditorialMediaMode, string> = {
  viewport: 'min-h-[100svh]',
  banner: 'min-h-[clamp(280px,35vw,520px)]',
  portrait: 'min-h-[clamp(420px,70vw,760px)]',
  cover: 'min-h-[clamp(320px,52vw,640px)]',
  split: 'min-h-[clamp(420px,70vh,860px)]',
  quiet: 'min-h-[clamp(280px,32vw,480px)]',
  // El alto lo decide el contenido; la imagen, su ratio.
  anchored: '',
};

const ANCHORED_ASPECT: Record<EditorialMediaAspect, string> = {
  viewport: 'aspect-[16/9]',
  '16:9': 'aspect-[16/9]',
  '16:8': 'aspect-[16/8]',
  '3:4': 'aspect-[3/4]',
  '1:1': 'aspect-square',
};

function getMinHeightStyle(minHeight?: string): { minHeight?: string } | undefined {
  if (!minHeight || minHeight.startsWith('min-')) return undefined;
  return { minHeight };
}

/** En `anchored` la imagen termina antes que la sección: su borde inferior funde siempre. */
function anchoredFade(fade: EditorialFade): EditorialFade {
  return fade === 'top' || fade === 'both' ? 'both' : 'bottom';
}

export function FullBleedSection({
  media,
  mode,
  children,
  overlay,
  tint = true,
  fade = 'both',
  sizes,
  minHeight,
  labelledBy,
  className,
  mediaClassName,
  contentClassName,
  scrimTone,
}: FullBleedSectionProps) {
  const layout = mediaLayout(mode, 'desktop');
  const defaultOverlay = layout.overlay;
  const overlayDirection =
    overlay === false
      ? false
      : typeof overlay === 'string'
        ? overlay
        : overlay === true || media
          ? defaultOverlay
          : false;
  const anchored = mode === 'anchored';

  return (
    <section
      className={cn(
        // `grid` estira el contenido al alto mínimo: un `h-full` contra un
        // `min-height` no resuelve y `items-center|end` quedaba sin efecto.
        // En `anchored` la imagen se recorta en su propia capa: la sección no,
        // para que lo que flota sobre la noche (un aura) pueda derramarse.
        'fm-editorial-full-bleed relative isolate grid',
        !anchored && 'overflow-hidden',
        MODE_CLASSES[mode],
        className,
      )}
      aria-labelledby={labelledBy}
      style={getMinHeightStyle(minHeight)}
    >
      {media ? (
        <div
          className={cn(
            anchored
              ? // Imagen y contenido comparten celda: la sección mide lo que
                // el mayor de los dos, y la foto nunca se estira con el texto.
                cn('col-start-1 row-start-1 w-full self-start', ANCHORED_ASPECT[media.aspect])
              : 'absolute inset-0',
            mediaClassName,
          )}
        >
          <EditorialImage
            aspect={media.aspect}
            bandMedia
            className="h-full"
            fade={anchored ? anchoredFade(fade) : fade}
            focalPoint={media.position ?? layout.objectPosition}
            media={media}
            overlay={tint ? overlayDirection : false}
            overlayClassName={tint === 'mobile' ? 'md:hidden' : undefined}
            scrim={overlayDirection}
            scrimTone={scrimTone}
            sizes={sizes ?? mediaSizes(mode, media.aspect)}
          />
        </div>
      ) : null}
      <div
        className={cn(
          'relative z-20 min-w-0',
          anchored && 'col-start-1 row-start-1',
          contentClassName,
        )}
      >
        {children}
      </div>
    </section>
  );
}
