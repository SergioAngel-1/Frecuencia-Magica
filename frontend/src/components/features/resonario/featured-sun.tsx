'use client';

import { useTranslations } from 'next-intl';

import { AudioDisc } from '@/components/features/player/audio-disc';
import { Badge, Button } from '@/components/ui';
import { useAudioPlayback, usePlayerStore } from '@/stores/player-store';
import type { Audio } from '@/types/content';
import type { EditorialMedia } from '@/types/editorial-media';

import { SampleButton } from './sample-button';

type FeaturedSunProps = {
  audio: Audio;
  /** Foto propia de la destacada (slot `resonario.featured`), dentro de la esfera. */
  cover: EditorialMedia;
};

/**
 * El sol del Resonario: la frecuencia destacada, en su esfera grande con su
 * foto. Mientras suena dice «Sonando ahora»; pulsar la esfera la pausa o reanuda.
 */
export function FeaturedSun({ audio, cover }: FeaturedSunProps) {
  const t = useTranslations('resonario');
  const open = usePlayerStore((state) => state.open);
  const { playing } = useAudioPlayback(audio.id);

  const title = t(`audios.${audio.id}.title` as 'audios.a1.title');
  const kind = t(`kinds.${audio.kind}.title` as 'kinds.melody.title');

  return (
    <div className="flex flex-col items-center gap-6 text-center" data-featured="sun">
      <Badge solid>{playing ? t('nowPlaying') : t('featuredBadge')}</Badge>
      {/* El halo de la esfera grande se contiene en el ancho de la pantalla. */}
      <div className="w-full overflow-hidden py-4">
        <AudioDisc
          audio={{ id: audio.id, hz: audio.hz, band: audio.band }}
          title={title}
          meta={`${kind} · ${audio.duration ?? t('soon')}`}
          size="lg"
          cover={cover}
          caption
          showPlay
          showEqualizer
        />
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <SampleButton audioId={audio.id} />
        <Button variant="primary" onClick={() => open(audio.id)}>
          {t('sample.full')}
        </Button>
      </div>
    </div>
  );
}
