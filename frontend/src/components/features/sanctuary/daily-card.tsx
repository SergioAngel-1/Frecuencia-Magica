'use client';

import { useTranslations } from 'next-intl';

import { AudioDisc } from '@/components/features/player/audio-disc';
import { FrequencyStrip } from '@/components/features/player/frequency-strip';
import { ArrowGlyph, arrowLinkClasses, EditorialImage, GlassPanel, Kicker } from '@/components/ui';
import { AUDIOS } from '@/data';
import { suggestAudios } from '@/lib/library/suggestions';
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
 * Debajo, como subsección, tres frecuencias afines a la de hoy en discos
 * mínimos: la tarjeta también es una puerta a seguir escuchando.
 */
const SUGGESTION_COUNT = 3;

export function DailyCard({ media, audioId }: DailyCardProps) {
  const t = useTranslations('sanctuary.daily');
  const tLibrary = useTranslations('library');
  const open = usePlayerStore((state) => state.open);
  const activeId = usePlayerStore((state) => state.audioId);
  const audio = AUDIOS.find((candidate) => candidate.id === audioId);

  if (!audio) return null;

  const title = tLibrary(`audios.${audio.id}.title` as 'audios.a1.title');
  const meta = `${tLibrary(`tags.${audio.tagId}` as 'tags.meditation')} · ${audio.duration}`;
  // TODO(backend): las sugerencias saldrán del historial de escucha; hasta
  // entonces, las más afines por intención a la frecuencia de hoy.
  const suggestions = suggestAudios(AUDIOS, audio.id, SUGGESTION_COUNT).map((candidate) => ({
    id: candidate.id,
    hz: candidate.hz,
    band: candidate.band,
    title: tLibrary(`audios.${candidate.id}.title` as 'audios.a1.title'),
  }));

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
      <AudioDisc audio={audio} title={title} meta={meta} size="sm" floatDuration="8s" />
      <button
        type="button"
        aria-pressed={activeId === audio.id}
        onClick={() => open(audio.id)}
        className={arrowLinkClasses('gold')}
      >
        {t('cta')}
        <ArrowGlyph />
      </button>

      {suggestions.length > 0 ? (
        <section
          aria-labelledby="sanctuary-suggestions-title"
          className="border-ivory/10 mt-auto w-full border-t pt-6"
        >
          <Kicker
            as="h3"
            tone="muted"
            spacing="tight"
            id="sanctuary-suggestions-title"
            className="mb-5"
          >
            {t('suggestions')}
          </Kicker>
          <FrequencyStrip items={suggestions} label={t('suggestions')} size="xs" />
        </section>
      ) : null}
    </GlassPanel>
  );
}
