'use client';

import { useMemo, useState, type CSSProperties } from 'react';
import { useTranslations } from 'next-intl';

import { Badge, Button, EditorialBanner, EditorialImage, EmptyState } from '@/components/ui';
import { FrequencyDisc } from '@/components/ui/frequency-disc';
import { AUDIOS } from '@/data';
import { discSlot, filterAudios, splitFeaturedAudio } from '@/lib/library/layout-slots';
import { usePlayerStore } from '@/stores/player-store';
import type { Audio } from '@/types/content';
import type { EditorialMedia } from '@/types/editorial-media';

import { LibraryFilters } from './library-filters';
import { LibrarySecondaryDisc } from './library-secondary-disc';

export type LibraryMedia = {
  featured: EditorialMedia;
  archiveBanner: EditorialMedia;
  audioCover: EditorialMedia;
};

export function LibrarySystem({ media }: { media: LibraryMedia }) {
  const t = useTranslations('library');
  const statesT = useTranslations('states');
  const [filter, setFilter] = useState<string | null>(null);

  const open = usePlayerStore((s) => s.open);
  const currentAudioId = usePlayerStore((s) => s.audioId);

  const filtered = useMemo(() => filterAudios(AUDIOS, filter), [filter]);
  const { featured, others } = splitFeaturedAudio(filtered);
  const audioTitle = (audio: Audio) => t(`audios.${audio.id}.title` as 'audios.a1.title');
  const audioMeta = (audio: Audio) =>
    `${t(`tags.${audio.tagId}` as 'tags.meditation')} · ${audio.duration}`;
  const audioCoverMedia = (audio: Audio): EditorialMedia => ({
    ...media.audioCover,
    alt: t('media.alt.audioCover', { title: audioTitle(audio) }),
  });

  return (
    <>
      <LibraryFilters active={filter} onChange={setFilter} />

      <EditorialBanner
        media={media.archiveBanner}
        eyebrow={t('archive.eyebrow')}
        title={t('archive.title')}
        body={t('archive.description')}
        className="fm-editorial-full-bleed mb-[clamp(28px,5vw,72px)]"
      />

      {filtered.length === 0 ? (
        <EmptyState
          title={statesT('emptySearch')}
          action={
            <Button variant="accent" onClick={() => setFilter(null)}>
              {t('filters.all')}
            </Button>
          }
        />
      ) : (
        <section
          aria-label={t('featuredBadge')}
          className="relative isolate mx-auto w-full max-w-[1040px]"
          data-editorial-stage="orbital"
        >
          <div
            className="relative isolate min-h-[clamp(430px,58vw,680px)] overflow-hidden lg:absolute lg:top-1/2 lg:left-1/2 lg:z-[4] lg:w-[min(70%,720px)] lg:-translate-x-1/2 lg:-translate-y-1/2"
            data-editorial-featured="true"
          >
            <div className="absolute inset-0">
              <EditorialImage
                aspect={media.featured.aspect}
                className="h-full"
                focalPoint={media.featured.position}
                media={media.featured}
                overlay="bottom"
                scrim="bottom"
              />
            </div>
            <div className="relative z-20 grid min-h-[clamp(430px,58vw,680px)] grid-cols-1 items-center gap-8 px-6 py-12 sm:px-[8vw] md:grid-cols-[minmax(220px,0.85fr)_minmax(0,1fr)] md:gap-[clamp(34px,6vw,84px)] md:py-16">
              {featured ? (
                <div className="mx-auto w-[min(380px,84vw)] text-center">
                  <div className="mb-3 flex justify-center">
                    <Badge solid>{t('featuredBadge')}</Badge>
                  </div>
                  <FrequencyDisc
                    size="lg"
                    hz={featured.hz}
                    band={featured.band}
                    title={audioTitle(featured)}
                    meta={audioMeta(featured)}
                    showEqualizer
                    showPlay
                    active={currentAudioId === featured.id}
                    floatDuration="7s"
                    onClick={() => open(featured.id)}
                    ariaLabel={audioTitle(featured)}
                  />
                </div>
              ) : null}

              <div className="max-w-[34rem]">
                <p className="text-gold font-sans text-[11px] tracking-[.3em] uppercase">
                  {t('featuredBadge')}
                </p>
                <h2 className="text-ivory mt-3 max-w-[14ch] font-serif text-[clamp(32px,5vw,64px)] leading-[0.96]">
                  {featured ? audioTitle(featured) : t('title')}
                </h2>
                <p className="text-ivory/78 mt-5 max-w-[42ch] text-[17px] leading-[1.65]">
                  {featured ? audioMeta(featured) : t('description')}
                </p>
              </div>
            </div>
          </div>

          {/* Un único mapa mantiene un solo nodo por frecuencia en ambos breakpoints. */}
          <div
            className="relative mx-auto grid max-w-[1040px] grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-5 pt-8 lg:block lg:min-h-[720px]"
            data-editorial-secondary="true"
          >
            {others.map((audio, i) => {
              const slot = discSlot(i);
              return (
                <div
                  key={audio.id}
                  className="relative mx-auto w-[150px] lg:absolute lg:top-[var(--slot-top)] lg:left-[var(--slot-left)] lg:z-[3] lg:w-[var(--slot-size)]"
                  style={
                    {
                      '--slot-top': slot.top,
                      '--slot-left': slot.left,
                      '--slot-size': slot.size,
                    } as CSSProperties
                  }
                >
                  <div className="w-full">
                    <LibrarySecondaryDisc
                      audio={audio}
                      media={audioCoverMedia(audio)}
                      title={audioTitle(audio)}
                      meta={audioMeta(audio)}
                      active={currentAudioId === audio.id}
                      floatDuration={slot.duration}
                      floatDelay={slot.delay}
                      onOpen={open}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </>
  );
}
