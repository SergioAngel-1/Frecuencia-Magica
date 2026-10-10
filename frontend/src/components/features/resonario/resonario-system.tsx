'use client';

import { useMemo, useState, type CSSProperties } from 'react';
import { useTranslations } from 'next-intl';

import { AudioDisc } from '@/components/features/player/audio-disc';
import { Badge, Button, EmptyState, Swap } from '@/components/ui';
import { AUDIOS } from '@/data';
import { discSlot, filterAudios, splitFeaturedAudio } from '@/lib/resonario/layout-slots';
import type { Audio } from '@/types/content';
import type { EditorialMedia } from '@/types/editorial-media';

import { ResonarioFilters } from './resonario-filters';

export type ResonarioMedia = {
  featured: EditorialMedia;
  /** Vacío del filtro sin resultados (`states.empty`). */
  empty: EditorialMedia;
  audioCover: EditorialMedia;
  /** Portada resuelta por id de audio; sin entrada, vale `audioCover`. */
  audioCovers: Record<string, EditorialMedia>;
};

export function ResonarioSystem({ media }: { media: ResonarioMedia }) {
  const t = useTranslations('resonario');
  const statesT = useTranslations('states');
  const [filter, setFilter] = useState<string | null>(null);

  const filtered = useMemo(() => filterAudios(AUDIOS, filter), [filter]);
  const { featured, others } = splitFeaturedAudio(filtered);
  const audioTitle = (audio: Audio) => t(`audios.${audio.id}.title` as 'audios.a1.title');
  const audioMeta = (audio: Audio) =>
    `${t(`tags.${audio.tagId}` as 'tags.meditation')} · ${audio.duration}`;
  const audioCoverMedia = (audio: Audio): EditorialMedia => ({
    ...(media.audioCovers[audio.id] ?? media.audioCover),
    alt: t('media.alt.audioCover', { title: audioTitle(audio) }),
    band: audio.band,
  });

  return (
    <>
      {/* El banner del archivo vive en la página, encadenado con el héroe. */}
      <ResonarioFilters active={filter} onChange={setFilter} />

      {/* Al filtrar, el sistema anterior se funde antes de que entre el nuevo. */}
      <Swap id={filter ?? 'all'}>
        {filtered.length === 0 ? (
          <EmptyState
            media={media.empty}
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
            {/* El destacado es el sol del sistema y los demás orbitan a su
              alrededor; en móvil y tablet va apilado sobre el archivo. Todos
              son el mismo `AudioDisc` de la Home: la portada vive dentro de la
              esfera y la luz es el aura del propio disco, sin marco alrededor. */}
            {featured ? (
              <div
                className="relative mx-auto w-[min(380px,84vw)] py-6 lg:absolute lg:top-1/2 lg:left-1/2 lg:z-[2] lg:-translate-x-1/2 lg:-translate-y-1/2 lg:py-0"
                data-editorial-featured="true"
              >
                <div className="mb-4 flex justify-center">
                  <Badge solid>{t('featuredBadge')}</Badge>
                </div>
                <AudioDisc
                  audio={featured}
                  title={audioTitle(featured)}
                  meta={audioMeta(featured)}
                  size="lg"
                  cover={{ ...media.featured, band: featured.band }}
                  showEqualizer
                  showPlay
                  floatDuration="7s"
                />
              </div>
            ) : null}

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
                    <AudioDisc
                      audio={audio}
                      title={audioTitle(audio)}
                      meta={audioMeta(audio)}
                      size="sm"
                      cover={audioCoverMedia(audio)}
                      floatDuration={slot.duration}
                      floatDelay={slot.delay}
                    />
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </Swap>
    </>
  );
}
