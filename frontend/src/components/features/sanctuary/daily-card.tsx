'use client';

import { useTranslations } from 'next-intl';

import {
  ArrowGlyph,
  arrowLinkClasses,
  EditorialImage,
  FrequencyDisc,
  GlassPanel,
  Kicker,
} from '@/components/ui';
import { AUDIOS } from '@/data';
import type { EditorialMedia } from '@/types/editorial-media';
import { usePlayerStore } from '@/stores/player-store';

type DailyCardProps = {
  media: EditorialMedia;
  /** Audio elegido para hoy. TODO(backend): lo decide el perfil. */
  audioId: string;
};

/**
 * La frecuencia de hoy. El disco y el enlace abren el audio en el reproductor
 * (el mismo gesto que en la Home y en la Biblioteca), no son decoración.
 */
export function DailyCard({ media, audioId }: DailyCardProps) {
  const t = useTranslations('sanctuary.daily');
  const tLibrary = useTranslations('library');
  const open = usePlayerStore((state) => state.open);
  const activeId = usePlayerStore((state) => state.audioId);
  const audio = AUDIOS.find((candidate) => candidate.id === audioId);

  if (!audio) return null;

  const title = tLibrary(`audios.${audio.id}.title` as 'audios.a1.title');
  const meta = `${tLibrary(`tags.${audio.tagId}` as 'tags.meditation')} · ${audio.duration}`;

  return (
    <GlassPanel
      className="relative isolate flex flex-col items-center gap-5 overflow-hidden p-5 text-center sm:p-7"
      glow
      data-editorial-media="sanctuary.daily"
    >
      <div className="absolute inset-0 -z-10">
        <EditorialImage
          aspect="1:1"
          className="h-full"
          focalPoint={media.position}
          media={media}
          overlay={false}
          scrim="bottom"
        />
      </div>
      <div>
        <Kicker tone="gold" spacing="widest">
          {t('kicker')}
        </Kicker>
        <p className="text-fg-soft text-meta tracking-ui mt-2 font-sans">{t('subtitle')}</p>
      </div>
      <FrequencyDisc
        size="sm"
        hz={audio.hz}
        band={audio.band}
        title={title}
        meta={meta}
        active={activeId === audio.id}
        floatDuration="8s"
        ariaLabel={`${title} — ${audio.hz} Hz — ${meta}`}
        onClick={() => open(audio.id)}
      />
      <button
        type="button"
        aria-pressed={activeId === audio.id}
        onClick={() => open(audio.id)}
        className={arrowLinkClasses('gold')}
      >
        {t('cta')}
        <ArrowGlyph />
      </button>
    </GlassPanel>
  );
}
