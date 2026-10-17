'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';

import { AtmospherePicker } from '@/components/features/atmosphere/atmosphere-picker';
import { EmptyState, Button, Swap } from '@/components/ui';
import { AUDIOS } from '@/data';
import { featuredAudio, kindSections } from '@/lib/resonario/layout-slots';
import type { AudioKind } from '@/types/content';
import type { EditorialMedia } from '@/types/editorial-media';

import { CelticFeature } from './celtic-feature';
import { FeaturedSun } from './featured-sun';
import { KindSection } from './kind-section';
import { ResonarioFilters } from './resonario-filters';
import { TrackCard } from './track-card';

export type ResonarioMedia = {
  /** Foto de la frecuencia destacada (slot `resonario.featured`). */
  featured: EditorialMedia;
  /** Vacío del filtro sin resultados (`states.empty`). */
  empty: EditorialMedia;
  /** Banner de cada tipo de escucha (slot `resonario.kind-banner.*`). */
  kindBanners: Record<AudioKind, EditorialMedia>;
  /** La pieza celta, dentro de melodías (slot `resonario.celtic`). */
  celtic: EditorialMedia;
};

/** Las pistas de un tipo, en tarjetas: 1 columna en móvil, hasta 4 en escritorio. */
const TRACK_GRID = 'grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

/**
 * El Resonario por tipo de escucha. «Todo» muestra la frecuencia destacada y
 * luego una sección por tipo, con su banner y su explicación; cada filtro deja
 * sólo la sección de ese tipo. Las pistas sin material (`soon`) se listan sin play.
 */
export function ResonarioSystem({ media }: { media: ResonarioMedia }) {
  const t = useTranslations('resonario');
  const statesT = useTranslations('states');
  const [filter, setFilter] = useState<string | null>(null);

  const showAll = !filter || filter === 'all';
  const featured = featuredAudio(AUDIOS);
  // La destacada sólo aparece en «Todo», y no se repite en su sección.
  const sections = useMemo(
    () => kindSections(AUDIOS, filter, showAll ? featured?.id : undefined),
    [filter, showAll, featured],
  );

  return (
    <>
      <div className="mb-8">
        <AtmospherePicker />
      </div>
      <ResonarioFilters active={filter} onChange={setFilter} />

      {/* Al filtrar, la vista anterior se funde antes de que entre la nueva. */}
      <Swap id={filter ?? 'all'}>
        {sections.length === 0 ? (
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
          <div className="gap-section flex flex-col">
            {showAll && featured ? <FeaturedSun audio={featured} cover={media.featured} /> : null}

            {sections.map(({ entry, tracks }) => (
              <KindSection key={entry.kind} entry={entry} banner={media.kindBanners[entry.kind]}>
                {entry.kind === 'melody' ? <CelticFeature media={media.celtic} /> : null}
                <div className={TRACK_GRID}>
                  {tracks.map((audio) => (
                    <TrackCard key={audio.id} audio={audio} />
                  ))}
                </div>
              </KindSection>
            ))}
          </div>
        )}
      </Swap>
    </>
  );
}
