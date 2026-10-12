'use client';

import { useTranslations } from 'next-intl';

import { FrequencyDisc, type DiscSize } from '@/components/ui';
import { resolveAudioCover } from '@/lib/editorial/audio-cover';
import { useAudioPlayback, usePlayerStore } from '@/stores/player-store';
import type { EditorialMedia } from '@/types/editorial-media';

import { AudioCover } from './audio-cover';

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
  /**
   * Otra materia en lugar de la portada del audio (el destacado del resonario
   * pinta `resonario.featured`). Sin valor, el disco pinta la portada de su
   * audio, la misma en todo el sitio.
   */
  cover?: EditorialMedia;
  /** `false` cuando el título y la meta ya están escritos al lado del disco. */
  caption?: boolean;
  /**
   * Pinta el control de play, que comparte estado con el reproductor: pasa a
   * pausa mientras este audio suena, y pulsar el disco entonces lo pausa.
   */
  showPlay?: boolean;
  showEqualizer?: boolean;
  floatDuration?: string;
  floatDelay?: string;
  className?: string;
};

/** Ancho que ocupa la portada en cada escala del disco. */
const COVER_SIZES: Record<DiscSize, string> = {
  xs: '92px',
  sm: '150px',
  md: '190px',
  lg: '(min-width: 1024px) 380px, 84vw',
};

/**
 * Disco de frecuencia conectado al reproductor: el único disco que suena.
 *
 * Home, Resonario (destacado y secundarios) y Mi Santuario pintan sus
 * frecuencias con esta pieza, de modo que el gesto (pulsar abre el audio), el
 * estado activo, la portada y el nombre accesible son los mismos en todas
 * partes.
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
  const t = useTranslations('resonario');
  const tPlayer = useTranslations('player');
  const open = usePlayerStore((state) => state.open);
  const toggleAudio = usePlayerStore((state) => state.toggleAudio);
  const { active, playing } = useAudioPlayback(audio.id);
  // Sólo el disco con control de play pausa al pulsarlo; los demás abren su
  // audio, como siempre: sin el glifo, una pausa no se entendería.
  const pauses = Boolean(showPlay) && playing;
  const coverMedia =
    cover ??
    resolveAudioCover(audio, {
      alt: t('media.alt.audioCover', { title }),
      sizes: COVER_SIZES[size],
    });

  return (
    <FrequencyDisc
      size={size}
      hz={audio.hz}
      band={audio.band}
      title={caption ? title : undefined}
      meta={caption ? meta : undefined}
      cover={<AudioCover media={coverMedia} />}
      active={active}
      showPlay={showPlay}
      showEqualizer={showEqualizer}
      // Fuera del disco activo el ecualizador es ambiente y no se detiene.
      playing={active ? playing : true}
      floatDuration={floatDuration}
      floatDelay={floatDelay}
      ariaLabel={[pauses ? tPlayer('pause') : null, title, `${audio.hz} Hz`, meta]
        .filter(Boolean)
        .join(' — ')}
      onClick={() => (showPlay ? toggleAudio(audio.id) : open(audio.id))}
      className={className}
    />
  );
}
