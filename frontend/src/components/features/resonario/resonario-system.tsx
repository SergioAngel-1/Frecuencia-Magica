'use client';

import { useMemo, useState, type CSSProperties } from 'react';
import { useTranslations } from 'next-intl';
import { div as Mdiv } from 'motion/react-m';

import { AudioDisc } from '@/components/features/player/audio-disc';
import { Badge, Button, EmptyState, Swap } from '@/components/ui';
import { AUDIOS } from '@/data';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { discSlot, filterAudios, orbitalLayout } from '@/lib/resonario/layout-slots';
import { useActiveAudioId } from '@/stores/player-store';
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

/** Ritmo del flotado del disco central; su etiqueta lo comparte. */
const FEATURED_FLOAT = '7s';

export function ResonarioSystem({ media }: { media: ResonarioMedia }) {
  const t = useTranslations('resonario');
  const statesT = useTranslations('states');
  const [filter, setFilter] = useState<string | null>(null);

  const filtered = useMemo(() => filterAudios(AUDIOS, filter), [filter]);
  // El centro lo toma la frecuencia que suena, sólo en el sistema orbital de
  // escritorio; por debajo de 1024 el orden se mantiene y el disco activo
  // sólo se marca (lo hace `AudioDisc`).
  const activeId = useActiveAudioId();
  const orbital = useMediaQuery('(min-width: 1024px)');
  const reduced = useReducedMotionSafe();
  const { center, centerIsFeatured, orbit } = orbitalLayout(filtered, orbital ? activeId : null);
  // El disco que cambia de sitio se desliza hasta el otro (sólo posición).
  const glide = orbital && !reduced;
  const audioTitle = (audio: Audio) => t(`audios.${audio.id}.title` as 'audios.a1.title');
  const audioMeta = (audio: Audio) =>
    `${t(`tags.${audio.tagId}` as 'tags.meditation')} · ${audio.duration}`;
  const audioCoverMedia = (audio: Audio): EditorialMedia => ({
    ...(media.audioCovers[audio.id] ?? media.audioCover),
    alt: t('media.alt.audioCover', { title: audioTitle(audio) }),
    band: audio.band,
  });
  // El destacado conserva su foto; otro audio en el centro, su portada a 380 px.
  const centerCover = (audio: Audio): EditorialMedia =>
    centerIsFeatured
      ? { ...media.featured, band: audio.band }
      : { ...audioCoverMedia(audio), sizes: '(min-width: 1024px) 380px, 84vw' };

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
            {center ? (
              <Mdiv
                key={center.id}
                layoutId={glide ? `resonario-disc-${center.id}` : undefined}
                layout={glide ? 'position' : false}
                className="relative mx-auto w-[min(380px,84vw)] py-6 lg:absolute lg:top-1/2 lg:left-1/2 lg:z-[2] lg:-translate-x-1/2 lg:-translate-y-1/2 lg:py-0"
                data-editorial-featured="true"
              >
                {/* La etiqueta flota con el disco: misma animación y duración,
                    montadas a la vez, así suben y bajan juntas. */}
                <div
                  className="mb-9 flex justify-center"
                  style={{ animation: `fm-float ${FEATURED_FLOAT} ease-in-out infinite` }}
                >
                  <Badge solid>{centerIsFeatured ? t('featuredBadge') : t('nowPlaying')}</Badge>
                </div>
                <AudioDisc
                  audio={center}
                  title={audioTitle(center)}
                  meta={audioMeta(center)}
                  size="lg"
                  cover={centerCover(center)}
                  showEqualizer
                  showPlay
                  floatDuration={FEATURED_FLOAT}
                />
              </Mdiv>
            ) : null}

            {/* Un único mapa mantiene un solo nodo por frecuencia en ambos breakpoints.
                Cada disco conserva su posición: el que pasa al centro deja la
                suya al que sale de él. */}
            <div
              className="relative mx-auto grid max-w-[1040px] grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-5 pt-8 lg:block lg:min-h-[720px]"
              data-editorial-secondary="true"
            >
              {orbit.map(({ audio, slot: index }) => {
                const slot = discSlot(index);
                return (
                  <Mdiv
                    key={audio.id}
                    layoutId={glide ? `resonario-disc-${audio.id}` : undefined}
                    layout={glide ? 'position' : false}
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
                  </Mdiv>
                );
              })}
            </div>
          </section>
        )}
      </Swap>
    </>
  );
}
