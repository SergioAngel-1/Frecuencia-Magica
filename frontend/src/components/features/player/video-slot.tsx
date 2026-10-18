'use client';

import { useTranslations } from 'next-intl';

import { EditorialImage } from '@/components/ui';
import { videoState, type VideoEntry } from '@/config/videos';
import { cn } from '@/lib/cn';
import type { EditorialMedia } from '@/types/editorial-media';

import { VideoPlayer } from './video-player';

type VideoSlotProps = {
  video: VideoEntry;
  /** El póster ya resuelto (`videoPosterMedia`). */
  media: EditorialMedia;
  /** Nombre del video, ya traducido: la región accesible y el título del póster. */
  title: string;
  /** Foco del póster cuando el recorte deja fuera lo que cuenta. */
  focalPoint?: string;
  /** La caja (ratio y ancho) la pone quien lo coloca. */
  className?: string;
};

/**
 * Espacio de un video de Marisol. Con fuente monta `VideoPlayer`; sin ella
 * muestra el póster con «Próximamente», **sin botón de play ni reloj**: un
 * control que no reproduce nada es justo lo que el sitio no quiere (spec §8).
 * El estado sale de `videoState`: el espacio pasa solo a «ready» cuando el
 * registro (`config/videos.ts`) gana su `src`.
 */
export function VideoSlot({ video, media, title, focalPoint, className }: VideoSlotProps) {
  const t = useTranslations('video');
  const tPlayer = useTranslations('player');

  if (videoState(video) === 'ready') {
    return (
      <VideoPlayer
        src={video.src!}
        className={className}
        duration={video.duration ?? 0}
        labels={{
          region: t('region', { title }),
          play: tPlayer('play'),
          pause: tPlayer('pause'),
          seek: t('seek'),
          mute: tPlayer('mute'),
          unmute: tPlayer('unmute'),
          fullscreen: tPlayer('fullscreen'),
          exitFullscreen: tPlayer('exitFullscreen'),
        }}
        poster={
          <EditorialImage
            aspect={media.aspect}
            className="h-full"
            focalPoint={focalPoint ?? media.position}
            media={media}
            overlay={false}
            scrim="bottom"
          />
        }
      />
    );
  }

  return (
    <div
      role="group"
      aria-label={t('region', { title })}
      data-video-state="soon"
      className={cn('relative isolate overflow-hidden', className)}
    >
      <div className="absolute inset-0">
        <EditorialImage
          aspect={media.aspect}
          className="h-full"
          focalPoint={focalPoint ?? media.position}
          media={media}
          overlay={false}
          scrim={false}
        />
      </div>
      {/* Vidrio denso: se lee igual sobre cualquier póster y en cualquier atmósfera. */}
      <div className="absolute inset-x-3 bottom-3 z-10 sm:inset-x-5 sm:bottom-5">
        <div className="fm-surface-strong rounded-card shadow-glow-card inline-flex max-w-full flex-col gap-1 px-5 py-4">
          <span className="text-accent text-label tracking-kicker font-sans uppercase">
            {t('soon')}
          </span>
          <span className="text-fg text-serif-sm font-serif leading-tight">{title}</span>
        </div>
      </div>
    </div>
  );
}
