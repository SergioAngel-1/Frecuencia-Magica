import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';
import { mediaLayout } from '@/lib/editorial/media-layout';
import type {
  EditorialMedia,
  EditorialTone,
} from '@/types/editorial-media';
import { EditorialImage } from './editorial-image';

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

const TONE_CLASSES: Record<EditorialTone, string> = {
  gold: 'text-gold',
  teal: 'text-teal',
  lav: 'text-lav',
  ivory: 'text-ivory',
};

const BANNER_LAYOUT = mediaLayout('banner', 'desktop');

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
      className={cn('relative isolate min-h-[clamp(280px,35vw,520px)] overflow-hidden', className)}
    >
      {media ? (
        <div className="absolute inset-0">
          <EditorialImage
            aspect={BANNER_LAYOUT.ratio}
            focalPoint={media.position ?? BANNER_LAYOUT.objectPosition}
            media={media}
            overlay="bottom"
            scrim="bottom"
          />
        </div>
      ) : null}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[8%] top-[12%] h-28 w-28 rounded-full border border-gold/25 opacity-60"
        data-editorial-geometry="true"
      />
      <div
        className={cn(
          'relative z-20 flex min-h-[clamp(280px,35vw,520px)] flex-col justify-end gap-4 p-[clamp(24px,6vw,84px)]',
          ALIGN_CLASSES[align],
        )}
      >
        <p className={cn('font-sans text-[11px] uppercase tracking-[.3em]', TONE_CLASSES[tone])}>
          {eyebrow}
        </p>
        <h2 className="max-w-4xl font-serif text-[clamp(32px,5vw,72px)] leading-[0.95] text-ivory">
          {title}
        </h2>
        {body ? <div className="max-w-2xl text-[17px] leading-relaxed text-ivory/80">{body}</div> : null}
        {action ? <div className="mt-2">{action}</div> : null}
      </div>
    </section>
  );
}
