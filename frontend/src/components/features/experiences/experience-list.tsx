import type { ReactNode } from 'react';
import { useLocale, useTranslations } from 'next-intl';

import { EXPERIENCES } from '@/data';
import { upcomingDates } from '@/lib/booking/dates';
import type { EditorialMedia } from '@/types/editorial-media';

import { ExperienceRow } from './experience-row';
import { BandChain, Display, Float, Kicker } from '@/components/ui';

export type ExperienceMedia = {
  hero: EditorialMedia;
  featured: EditorialMedia;
  row: EditorialMedia;
  /** Foto resuelta por id de experiencia; sin entrada, vale `row`. */
  rows: Record<string, EditorialMedia>;
};

type ExperienceListProps = {
  media: ExperienceMedia;
  /** Héroe del realm: banda consecutiva de la destacada, se encadena con ella. */
  hero: ReactNode;
};

export function ExperienceList({ media, hero }: ExperienceListProps) {
  const locale = useLocale();
  const t = useTranslations('experiences');
  const featured = EXPERIENCES[0]!;
  const others = EXPERIENCES.slice(1);
  const dates = upcomingDates(new Date(), EXPERIENCES.length, locale);
  const titleFor = (experience: (typeof EXPERIENCES)[number]) =>
    t(`items.${experience.id}.title` as 'items.e1.title');
  const experienceMedia = (experience: (typeof EXPERIENCES)[number]): EditorialMedia => ({
    ...(media.rows[experience.id] ?? media.row),
    alt: t('media.alt.row', { title: titleFor(experience) }),
    band: experience.band,
  });

  return (
    <>
      <BandChain>
        {hero}
        <ExperienceRow
          bookLabel={t('book')}
          date={dates[0]!}
          dateLabel={t('dateLabel')}
          durationLabel={t('durationLabel')}
          description={t('featuredDescription')}
          experience={featured}
          media={{ ...media.featured, band: featured.band }}
          mode={t(`modes.${featured.mode}` as 'modes.online')}
          modeLabel={t('featuredBadge')}
          title={titleFor(featured)}
          featured
          className="fm-editorial-full-bleed"
        />
      </BandChain>

      <section
        aria-labelledby="experiences-archive-title"
        className="fm-editorial-full-bleed fm-container py-section"
        data-editorial-archive="true"
      >
        <div className="mb-8 max-w-[58ch]">
          <Kicker tone="teal">{t('all')}</Kicker>
          <Display level="h2" size="md" id="experiences-archive-title" className="mt-3">
            {t('archiveTitle')}
          </Display>
        </div>

        <div className="flex flex-col gap-5">
          {others.map((exp, index) => (
            <Float key={exp.id} order={index}>
              <ExperienceRow
                bookLabel={t('book')}
                date={dates[index + 1]!}
                dateLabel={t('dateLabel')}
                durationLabel={t('durationLabel')}
                experience={exp}
                media={experienceMedia(exp)}
                mode={t(`modes.${exp.mode}` as 'modes.online')}
                modeLabel={t(`modes.${exp.mode}` as 'modes.online')}
                title={titleFor(exp)}
              />
            </Float>
          ))}
        </div>
      </section>
    </>
  );
}
