import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';
import { hasEditorialVisual } from '@/lib/editorial/visual';
import type { EditorialFade, EditorialMedia, EditorialTone } from '@/types/editorial-media';
import { Display } from './display';
import { EditorialImage } from './editorial-image';
import { Kicker, type KickerTone } from './kicker';

export type EditorialBannerAlign = 'left' | 'center' | 'right';

export interface EditorialBannerProps {
  media?: EditorialMedia;
  eyebrow: ReactNode;
  title: ReactNode;
  body?: ReactNode;
  action?: ReactNode;
  align?: EditorialBannerAlign;
  tone?: EditorialTone;
  /**
   * Alto mínimo de la banda cuando tiene materia que enmarcar (foto, zebra o
   * banda). Sin materia se ignora: la banda mide lo que su texto.
   */
  heightClassName?: string;
  /** Bordes de la materia que se funden con la noche; por defecto, los dos. */
  fade?: EditorialFade;
  className?: string;
}

const ALIGN_CLASSES: Record<EditorialBannerAlign, string> = {
  left: 'items-start text-left',
  center: 'items-center text-center',
  right: 'items-end text-right',
};

/** `ivory` no es un acento del `Kicker`: se resuelve con el peldaño `muted`. */
const KICKER_TONES: Record<EditorialTone, KickerTone> = {
  gold: 'gold',
  teal: 'teal',
  lav: 'lav',
  ivory: 'muted',
};

/**
 * Banda editorial a sangre de viewport. Siempre `fm-editorial-full-bleed`:
 * una banda que hereda el ancho de su contenedor queda inset y deja un borde
 * duro junto a las que sí llegan al borde. El texto se alinea con el eje de
 * página (`fm-container`), el mismo que los héroes y el contenido.
 *
 * Con materia (foto o fallback `zebra`/`band`) es una franja con alto propio
 * y el texto al pie, sobre el scrim. Un slot `none` sin foto no pinta nada:
 * entonces la banda es sólo su texto, sin alto mínimo ni aro flotante, y el
 * aire lo pone la vista. Reservar el hueco de una foto que no está dejaba el
 * titular suelto en mitad de un vacío.
 */
export function EditorialBanner({
  media,
  eyebrow,
  title,
  body,
  action,
  align = 'left',
  tone = 'gold',
  heightClassName = 'min-h-[clamp(280px,35vw,520px)]',
  fade = 'both',
  className,
}: EditorialBannerProps) {
  const framed = media ? hasEditorialVisual(media) : false;

  return (
    <section
      className={cn(
        'fm-editorial-full-bleed relative isolate flex flex-col',
        framed && ['overflow-hidden', heightClassName],
        className,
      )}
      data-editorial-banner={framed ? 'framed' : 'text'}
    >
      {media && framed ? (
        <div className="absolute inset-0">
          <EditorialImage
            aspect={media.aspect}
            bandMedia
            fade={fade}
            focalPoint={media.position}
            media={media}
            overlay="bottom"
            scrim="bottom"
          />
          <div
            aria-hidden="true"
            className="fm-banner-veil pointer-events-none absolute inset-0 z-10"
          />
        </div>
      ) : null}
      {framed ? (
        <div
          aria-hidden="true"
          className="border-gold/25 pointer-events-none absolute top-[12%] right-[8%] h-28 w-28 rounded-full border opacity-60"
          data-editorial-geometry="true"
        />
      ) : null}
      <div
        className={cn(
          'fm-container relative z-20 flex flex-col gap-4',
          framed && 'py-block flex-1 justify-end',
          ALIGN_CLASSES[align],
        )}
      >
        <Kicker
          tone={KICKER_TONES[tone]}
          spacing="wide"
          className={framed ? 'fm-kicker-veiled' : undefined}
        >
          {eyebrow}
        </Kicker>
        <Display level="h2" size={framed ? 'lg' : 'md'} className="max-w-4xl">
          {title}
        </Display>
        {body ? (
          <div className="text-fg-body text-lead max-w-2xl leading-relaxed">{body}</div>
        ) : null}
        {action ? <div className="mt-2">{action}</div> : null}
      </div>
    </section>
  );
}
