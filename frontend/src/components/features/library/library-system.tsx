'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';

import { Badge, Button, EmptyState } from '@/components/ui';
import { FrequencyDisc } from '@/components/ui/frequency-disc';
import { AUDIOS } from '@/data';
import { discSlot, filterAudios, splitFeaturedAudio } from '@/lib/library/layout-slots';
import { usePlayerStore } from '@/stores/player-store';

import { LibraryFilters } from './library-filters';

export function LibrarySystem() {
  const t = useTranslations('library');
  const statesT = useTranslations('states');
  const [filter, setFilter] = useState<string | null>(null);

  const open = usePlayerStore((s) => s.open);
  const currentAudioId = usePlayerStore((s) => s.audioId);

  const filtered = useMemo(() => filterAudios(AUDIOS, filter), [filter]);
  const { featured, others } = splitFeaturedAudio(filtered);

  return (
    <>
      <LibraryFilters active={filter} onChange={setFilter} />

      {filtered.length === 0 ? (
        <EmptyState
          title={statesT('emptySearch')}
          action={<Button variant="accent" onClick={() => setFilter(null)}>{t('filters.all')}</Button>}
        />
      ) : (
        <>
          {/* <1024px: rejilla móvil/tablet */}
          <div className="mx-auto block max-w-[1040px] lg:hidden">
            {featured ? (
              <div className="mx-auto mb-10 w-[280px]">
                <div className="mb-3 flex justify-center">
                  <Badge solid>{t('featuredBadge')}</Badge>
                </div>
                <FrequencyDisc
                  size="md"
                  hz={featured.hz}
                  band={featured.band}
                  title={t(`audios.${featured.id}.title` as 'audios.a1.title')}
                  meta={`${t(`tags.${featured.tagId}` as 'tags.meditation')} · ${featured.duration}`}
                  showEqualizer
                  showPlay
                  active={currentAudioId === featured.id}
                  floatDuration="7s"
                  onClick={() => open(featured.id)}
                  ariaLabel={t(`audios.${featured.id}.title` as 'audios.a1.title')}
                />
              </div>
            ) : null}

            <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-5">
              {others.map((audio) => (
                <div key={audio.id} className="mx-auto">
                  <FrequencyDisc
                    size="sm"
                    hz={audio.hz}
                    band={audio.band}
                    title={t(`audios.${audio.id}.title` as 'audios.a1.title')}
                    meta={`${t(`tags.${audio.tagId}` as 'tags.meditation')} · ${audio.duration}`}
                    active={currentAudioId === audio.id}
                    floatDuration="7s"
                    floatDelay={`${(filtered.indexOf(audio) * 0.2).toFixed(1)}s`}
                    onClick={() => open(audio.id)}
                    ariaLabel={t(`audios.${audio.id}.title` as 'audios.a1.title')}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* >=1024px: sistema orbital */}
          <div className="relative mx-auto hidden min-h-[720px] max-w-[1040px] lg:block">
            {featured ? (
              <div
                className="absolute left-1/2 top-1/2 z-[4] -translate-x-1/2 -translate-y-1/2"
                style={{ width: 'min(82%, 400px)' }}
              >
                <div className="mb-3 flex justify-center">
                  <Badge solid>{t('featuredBadge')}</Badge>
                </div>
                <FrequencyDisc
                  size="lg"
                  hz={featured.hz}
                  band={featured.band}
                  title={t(`audios.${featured.id}.title` as 'audios.a1.title')}
                  meta={`${t(`tags.${featured.tagId}` as 'tags.meditation')} · ${featured.duration}`}
                  showEqualizer
                  showPlay
                  active={currentAudioId === featured.id}
                  floatDuration="7s"
                  onClick={() => open(featured.id)}
                  ariaLabel={t(`audios.${featured.id}.title` as 'audios.a1.title')}
                />
              </div>
            ) : null}

            {others.map((audio, i) => {
              const slot = discSlot(i);
              return (
                <div
                  key={audio.id}
                  className="absolute z-[3]"
                  style={{
                    top: slot.top,
                    left: slot.left,
                    width: slot.size,
                  }}
                >
                  <FrequencyDisc
                    size="sm"
                    hz={audio.hz}
                    band={audio.band}
                    title={t(`audios.${audio.id}.title` as 'audios.a1.title')}
                    meta={`${t(`tags.${audio.tagId}` as 'tags.meditation')} · ${audio.duration}`}
                    active={currentAudioId === audio.id}
                    floatDuration={slot.duration}
                    floatDelay={slot.delay}
                    onClick={() => open(audio.id)}
                    ariaLabel={t(`audios.${audio.id}.title` as 'audios.a1.title')}
                  />
                </div>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}
