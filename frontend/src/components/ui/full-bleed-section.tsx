import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';
import type {
  EditorialMedia,
  EditorialMediaMode,
  EditorialOverlayDirection,
} from '@/types/editorial-media';
import { mediaLayout } from '@/lib/editorial/media-layout';
import { EditorialImage } from './editorial-image';

export interface FullBleedSectionProps {
  media?: EditorialMedia;
  mode: EditorialMediaMode;
  children: ReactNode;
  overlay?: EditorialOverlayDirection | boolean;
  minHeight?: string;
  className?: string;
  contentClassName?: string;
}

const MODE_CLASSES: Record<EditorialMediaMode, string> = {
  viewport: 'min-h-[100svh]',
  banner: 'min-h-[clamp(280px,35vw,520px)]',
  portrait: 'min-h-[clamp(420px,70vw,760px)]',
  cover: 'min-h-[clamp(320px,52vw,640px)]',
  split: 'min-h-[clamp(420px,70vh,860px)]',
  quiet: 'min-h-[clamp(280px,32vw,480px)]',
};

function getMinHeightStyle(minHeight?: string): { minHeight?: string } | undefined {
  if (!minHeight || minHeight.startsWith('min-')) return undefined;
  return { minHeight };
}

export function FullBleedSection({
  media,
  mode,
  children,
  overlay,
  minHeight,
  className,
  contentClassName,
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

  return (
    <section
      className={cn(
        'fm-editorial-full-bleed relative isolate overflow-hidden',
        MODE_CLASSES[mode],
        className,
      )}
      style={getMinHeightStyle(minHeight)}
    >
      {media ? (
        <div className="absolute inset-0">
          <EditorialImage
            aspect={media.aspect}
            className="h-full"
            focalPoint={media.position ?? layout.objectPosition}
            media={media}
            overlay={overlayDirection}
            scrim={overlayDirection}
          />
        </div>
      ) : null}
      <div className={cn('relative z-20 h-full', contentClassName)}>{children}</div>
    </section>
  );
}
