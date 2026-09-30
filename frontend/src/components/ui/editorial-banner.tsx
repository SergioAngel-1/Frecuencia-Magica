import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';
import type { EditorialMedia, EditorialTone } from '@/types/editorial-media';
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
 */
export function EditorialBanner({
  media,
  eyebrow,
  title,
  body,
  action,
  align = 'left',
  tone = 'gold',
  className,
}: EditorialBannerProps) {
  return (
    <section
      className={cn(
        'fm-editorial-full-bleed relative isolate flex min-h-[clamp(280px,35vw,520px)] flex-col overflow-hidden',
        className,
      )}
    >
      {media ? (
        <div className="absolute inset-0">
          <EditorialImage
            aspect={media.aspect}
            focalPoint={media.position}
            media={media}
            overlay="bottom"
            scrim="bottom"
          />
        </div>
      ) : null}
      <div
        aria-hidden="true"
        className="border-gold/25 pointer-events-none absolute top-[12%] right-[8%] h-28 w-28 rounded-full border opacity-60"
        data-editorial-geometry="true"
      />
      <div
        className={cn(
          'fm-container relative z-20 flex min-h-[clamp(280px,35vw,520px)] flex-1 flex-col justify-end gap-4 py-[clamp(24px,6vw,84px)]',
          ALIGN_CLASSES[align],
        )}
      >
        <Kicker tone={KICKER_TONES[tone]} spacing="wide">
          {eyebrow}
        </Kicker>
        <Display level="h2" size="lg" className="max-w-4xl">
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
