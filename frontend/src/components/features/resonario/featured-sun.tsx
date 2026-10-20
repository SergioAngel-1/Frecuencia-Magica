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

  const title = t(`audios.${audio.id}.title`);
  const kind = t(`kinds.${audio.kind}.title`);

  return (
    <div className="isolate flex flex-col items-center gap-2 text-center" data-featured="sun">
      <Badge solid className="relative z-20 self-center">
        {playing ? t('nowPlaying') : t('featuredBadge')}
      </Badge>
      {/* El halo de la esfera grande se recorta sólo en el borde de la pantalla (a sangre, sin barra
          horizontal) y no a lo alto: `overflow-hidden` lo cortaba en seco por arriba y, en móvil,
          en los márgenes de la página. El aire vertical lo recibe entero. */}
      <div className="fm-editorial-full-bleed overflow-x-clip px-6 py-14">
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
      <div className="relative z-20 mt-4 flex flex-wrap justify-center gap-3">
        <SampleButton audioId={audio.id} />
        <Button variant="primary" onClick={() => open(audio.id)}>
          {t('sample.full')}
        </Button>
      </div>
    </div>
  );
}
