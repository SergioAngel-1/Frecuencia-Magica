import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';

import { EXPERIENCES } from '@/data/experiences';
import type { EditorialMedia } from '@/types/editorial-media';

import { ExperienceRow } from './experience-row';
import { Display, Float, Kicker } from '@/components/ui';

export type ExperienceMedia = {
  hero: EditorialMedia;
  featured: EditorialMedia;
  row: EditorialMedia;
  /** Foto resuelta por id de experiencia; sin entrada, vale `row`. */
  rows: Record<string, EditorialMedia>;
};

type ExperienceListProps = {
  media: ExperienceMedia;
  /** Héroe del realm: la banda que abre la vista. */
  hero: ReactNode;
};

export function ExperienceList({ media, hero }: ExperienceListProps) {
  const t = useTranslations('experiences');
  const featured = EXPERIENCES[0]!;
  const others = EXPERIENCES.slice(1);
  const titleFor = (experience: (typeof EXPERIENCES)[number]) => t(`items.${experience.id}.title`);
  const experienceMedia = (experience: (typeof EXPERIENCES)[number]): EditorialMedia => ({
    ...(media.rows[experience.id] ?? media.row),
    alt: t('media.alt.row', { title: titleFor(experience) }),
    band: experience.band,
  });

  return (
    <>
      {hero}

      {/* El encabezado es texto sobre la noche; la destacada es una tarjeta con
          foto dentro del eje de página, no otra banda a sangre. */}
      <section
        aria-labelledby="experiences-archive-title"
        className="fm-editorial-full-bleed fm-container pt-block pb-section"
        data-editorial-archive="true"
      >
        <div className="max-w-measure-full mb-8">
          <Kicker tone="teal">{t('all')}</Kicker>
          <Display level="h2" size="md" id="experiences-archive-title" className="mt-3">
            {t('archiveTitle')}
          </Display>
        </div>

        <div className="flex flex-col gap-5">
          <ExperienceRow
            bookLabel={t('book')}
            dateCount={EXPERIENCES.length}
            dateIndex={0}
            dateLabel={t('dateLabel')}
            durationLabel={t('durationLabel')}
            description={t('featuredDescription')}
            experience={featured}
            media={{ ...media.featured, band: featured.band }}
            mode={t(`modes.${featured.mode}`)}
            modeLabel={t('featuredBadge')}
            title={titleFor(featured)}
            featured
          />

          {others.map((exp, index) => (
            <Float key={exp.id} order={index}>
              <ExperienceRow
                bookLabel={t('book')}
                dateCount={EXPERIENCES.length}
                dateIndex={index + 1}
                dateLabel={t('dateLabel')}
                durationLabel={t('durationLabel')}
                experience={exp}
                media={experienceMedia(exp)}
                mode={t(`modes.${exp.mode}`)}
                modeLabel={t(`modes.${exp.mode}`)}
                title={titleFor(exp)}
              />
            </Float>
          ))}
        </div>
      </section>
    </>
  );
}
