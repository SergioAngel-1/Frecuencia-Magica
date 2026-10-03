'use client';

import { EditorialImage, FrequencyDisc, type DiscSize } from '@/components/ui';
import { editorialVisual } from '@/lib/editorial/visual';
import { usePlayerStore } from '@/stores/player-store';
import type { EditorialMedia } from '@/types/editorial-media';

export type AudioDiscItem = {
  id: string;
  hz: number;
  band: string;
};

type AudioDiscProps = {
  audio: AudioDiscItem;
  /** Título ya traducido: se pinta bajo el disco y nombra el botón. */
  title: string;
  /** Línea de meta ya compuesta. */
  meta?: string;
  size?: DiscSize;
  /** Portada del audio. Sólo se pinta si hay foto: sin ella, el disco ya es su banda. */
  cover?: EditorialMedia;
  /** `false` cuando el título y la meta ya están escritos al lado del disco. */
  caption?: boolean;
  showPlay?: boolean;
  showEqualizer?: boolean;
  floatDuration?: string;
  floatDelay?: string;
  className?: string;
};

/**
 * Disco de frecuencia conectado al reproductor: el único disco que suena.
 *
 * Home, Biblioteca (destacado y secundarios) y Mi Santuario pintan sus
 * frecuencias con esta pieza, de modo que el gesto (pulsar abre el audio), el
 * estado activo y el nombre accesible son los mismos en todas partes.
 */
export function AudioDisc({
  audio,
  title,
  meta,
  size = 'sm',
  cover,
  caption = true,
  showPlay,
  showEqualizer,
  floatDuration,
  floatDelay,
  className,
}: AudioDiscProps) {
  const open = usePlayerStore((state) => state.open);
  const active = usePlayerStore((state) => state.audioId === audio.id);

  return (
    <FrequencyDisc
      size={size}
      hz={audio.hz}
      band={audio.band}
      title={caption ? title : undefined}
      meta={caption ? meta : undefined}
      cover={
        cover && editorialVisual(cover) === 'photo' ? (
          <EditorialImage
            aspect="1:1"
            className="h-full"
            focalPoint={cover.position}
            media={cover}
            overlay={false}
            scrim="bottom"
          />
        ) : undefined
      }
      active={active}
      showPlay={showPlay}
      showEqualizer={showEqualizer}
      floatDuration={floatDuration}
      floatDelay={floatDelay}
      ariaLabel={[title, `${audio.hz} Hz`, meta].filter(Boolean).join(' — ')}
      onClick={() => open(audio.id)}
      className={className}
    />
  );
}
