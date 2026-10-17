'use client';

import { useTranslations } from 'next-intl';

import { AudioDisc } from '@/components/features/player/audio-disc';
import { cn } from '@/lib/cn';
import { Badge, Button } from '@/components/ui';
import { isPlayable } from '@/data';
import { floatPhase } from '@/lib/player/float-phase';
import { useAudioPlayback, usePlayerStore } from '@/stores/player-store';
import type { Audio } from '@/types/content';

import { SampleButton } from './sample-button';
import { TrackGuide } from './track-guide';

type TrackCardProps = {
  audio: Audio;
};

/**
 * Una pista del Resonario: su esfera (la misma `AudioDisc` de todo el sitio, con
 * la portada del audio dentro), qué es, cuánto dura, si lleva voz, la guía de
 * escucha y, si ya existe, la muestra y la pista completa. Una pista `soon`
 * tiene su esfera como portada, sin gesto, y dice «Próximamente».
 */
export function TrackCard({ audio }: TrackCardProps) {
  const t = useTranslations('resonario');
  const open = usePlayerStore((state) => state.open);
  const { playing } = useAudioPlayback(audio.id);
  const ready = isPlayable(audio);

  const title = t(`audios.${audio.id}.title` as 'audios.a1.title');
  const kind = t(`kinds.${audio.kind}.title` as 'kinds.melody.title');
  const duration = audio.duration ?? t('soon');
  const voice = audio.voice ? t('card.voice') : t('card.noVoice');

  return (
    <article
      className="fm-surface rounded-card flex flex-col items-center gap-4 p-4 text-center sm:p-5"
      data-kind={audio.kind}
      data-availability={audio.availability}
    >
      {/* El hueco de la etiqueta siempre existe: aparecer no empuja la esfera. */}
      <div
        aria-hidden={!playing}
        className={cn(
          'flex h-7 w-full justify-center transition-opacity duration-300 motion-reduce:transition-none',
          playing ? 'opacity-100' : 'opacity-0',
        )}
      >
        <Badge solid>{t('nowPlaying')}</Badge>
      </div>

      <AudioDisc
        audio={{ id: audio.id, hz: audio.hz, band: audio.band }}
        title={title}
        meta={`${kind} · ${duration}`}
        size="md"
        caption={false}
        interactive={ready}
        floatDelay={floatPhase(audio.id)}
      />

      <div className="flex w-full flex-col gap-2 text-left">
        <h3 className="text-fg text-lead font-serif leading-tight">{title}</h3>
        <p className="text-fg-meta text-meta tracking-ui font-sans">
          {kind} · {duration} · {voice}
          {audio.headphones ? ` · ${t('card.headphones')}` : null}
        </p>
      </div>

      {/* Qué suena y el aviso de auriculares se ven antes de reproducir; la guía, plegada. */}
      <div className="text-fg-body text-body flex w-full flex-col gap-1 text-left font-light">
        <span className="text-fg-meta text-label tracking-caps font-sans uppercase">
          {t('guide.composition')}
        </span>
        <span>{t(`audios.${audio.id}.composition` as 'audios.a1.composition')}</span>
        {audio.headphones ? <span>{t('guide.headphones')}</span> : null}
      </div>

      <div className="w-full text-left">
        <TrackGuide guide={t(`audios.${audio.id}.guide` as 'audios.a1.guide')} />
      </div>

      {ready ? (
        <div className="flex flex-wrap justify-center gap-3">
          <SampleButton audioId={audio.id} />
          <Button variant="primary" onClick={() => open(audio.id)}>
            {t('sample.full')}
          </Button>
        </div>
      ) : (
        <div className="flex w-full justify-center">
          <Badge>{t('soon')}</Badge>
        </div>
      )}
    </article>
  );
}
