'use client';

import { useTranslations } from 'next-intl';

import { AudioCover } from '@/components/features/player/audio-cover';
import { Badge, Button } from '@/components/ui';
import { isPlayable } from '@/data';
import { resolveAudioCover } from '@/lib/editorial/audio-cover';
import { usePlayerStore } from '@/stores/player-store';
import type { Audio } from '@/types/content';
import type { EditorialMedia } from '@/types/editorial-media';

import { SampleButton } from './sample-button';
import { TrackGuide } from './track-guide';

type TrackCardProps = {
  audio: Audio;
  /** Foto propia que sustituye a la portada de la pista (la destacada del Resonario). */
  cover?: EditorialMedia;
  /** Etiqueta sobre la tarjeta, p. ej. «Frecuencia destacada». */
  badge?: string;
};

/**
 * Una pista del Resonario: qué es, cuánto dura, si lleva voz, su guía de
 * escucha y, si ya existe, la muestra y la pista completa. Una pista `soon`
 * no tiene controles de play: sólo dice «Próximamente».
 */
export function TrackCard({ audio, cover, badge }: TrackCardProps) {
  const t = useTranslations('resonario');
  const open = usePlayerStore((state) => state.open);
  const ready = isPlayable(audio);

  const title = t(`audios.${audio.id}.title` as 'audios.a1.title');
  const kind = t(`kinds.${audio.kind}.title` as 'kinds.melody.title');
  const duration = audio.duration ?? t('soon');
  const voice = audio.voice ? t('card.voice') : t('card.noVoice');
  const coverMedia =
    cover ??
    resolveAudioCover(audio, {
      alt: t('media.alt.audioCover', { title }),
      sizes: '(min-width: 1024px) 300px, 45vw',
    });

  return (
    <article
      className="fm-surface rounded-card flex flex-col gap-4 p-4 sm:p-5"
      data-kind={audio.kind}
      data-availability={audio.availability}
    >
      <div
        className="rounded-card relative aspect-square overflow-hidden"
        style={{ backgroundImage: audio.band }}
      >
        <AudioCover media={coverMedia} scrim={false} />
      </div>

      <div className="flex flex-col gap-2">
        {badge ? <Badge solid>{badge}</Badge> : null}
        <h3 className="text-fg text-lead font-serif leading-tight">{title}</h3>
        <p className="text-fg-meta text-meta tracking-ui font-sans">
          {kind} · {duration} · {voice}
          {audio.headphones ? ` · ${t('card.headphones')}` : null}
        </p>
      </div>

      {/* Qué suena y el aviso de auriculares se ven antes de reproducir; la guía, plegada. */}
      <div className="text-fg-body text-body flex flex-col gap-1 font-light">
        <span className="text-fg-meta text-label tracking-caps font-sans uppercase">
          {t('guide.composition')}
        </span>
        <span>{t(`audios.${audio.id}.composition` as 'audios.a1.composition')}</span>
        {audio.headphones ? <span>{t('guide.headphones')}</span> : null}
      </div>

      <TrackGuide guide={t(`audios.${audio.id}.guide` as 'audios.a1.guide')} />

      {ready ? (
        <div className="flex flex-wrap gap-3">
          <SampleButton audioId={audio.id} />
          <Button variant="primary" onClick={() => open(audio.id)}>
            {t('sample.full')}
          </Button>
        </div>
      ) : (
        <Badge>{t('soon')}</Badge>
      )}
    </article>
  );
}
