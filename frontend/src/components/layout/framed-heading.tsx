import type { ReactNode } from 'react';

import { Display, EditorialImage, Kicker } from '@/components/ui';
import type { KickerTone } from '@/components/ui/kicker';
import { cn } from '@/lib/cn';
import type { EditorialMedia } from '@/types/editorial-media';

export interface FramedHeadingProps {
  media: EditorialMedia;
  kicker: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** Id del titular; nombra la sección (`aria-labelledby`). */
  titleId: string;
  tone?: KickerTone;
  className?: string;
}

/**
 * Encabezado de sección con foto, contenido: una tarjeta dentro del eje de página,
 * no una banda a sangre. Va justo tras un héroe sin pegarle una segunda banda
 * (`band-rhythm.test`): el hueco lateral y las esquinas la separan. Con un slot
 * sin foto queda sólo el texto sobre la noche. Presentacional: recibe el texto
 * traducido.
 */
export function FramedHeading({
  media,
  kicker,
  title,
  description,
  titleId,
  tone = 'teal',
  className,
}: FramedHeadingProps) {
  return (
    <section
      aria-labelledby={titleId}
      className={cn(
        'rounded-card-lg text-fg relative isolate min-h-[clamp(280px,30vw,400px)] overflow-hidden',
        className,
      )}
      data-editorial-media={media.slot}
    >
      <div className="absolute inset-0">
        <EditorialImage
          aspect="16:8"
          className="h-full"
          focalPoint={media.position}
          media={media}
          overlay="left"
          scrim="left"
          sizes="(max-width: 1279px) calc(100vw - 40px), 1240px"
        />
      </div>
      <div className="relative z-10 flex min-h-[inherit] flex-col justify-end gap-4 p-6 md:p-10">
        <Kicker tone={tone} spacing="wide">
          {kicker}
        </Kicker>
        <Display level="h2" size="lg" id={titleId} className="max-w-measure-title-xl">
          {title}
        </Display>
        {description ? (
          <p className="text-fg-body text-body max-w-measure-wide leading-[1.8]">{description}</p>
        ) : null}
      </div>
    </section>
  );
}
