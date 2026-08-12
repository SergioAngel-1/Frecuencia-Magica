import { useTranslations } from 'next-intl';

import { EXPERIENCES } from '@/data';
import type { EditorialMedia } from '@/types/editorial-media';

import { ExperienceRow } from './experience-row';

export type ExperienceMedia = {
  hero: EditorialMedia;
  featured: EditorialMedia;
  row: EditorialMedia;
};

type ExperienceListProps = {
  media: ExperienceMedia;
};

export function ExperienceList({ media }: ExperienceListProps) {
  const t = useTranslations('experiences');
  const featured = EXPERIENCES[0]!;
  const others = EXPERIENCES.slice(1);
  const titleFor = (experience: (typeof EXPERIENCES)[number]) =>
    t(`items.${experience.id}.title` as 'items.e1.title');
  const experienceMedia = (experience: (typeof EXPERIENCES)[number]): EditorialMedia => ({
    ...media.row,
    alt: t('media.alt.row', { title: titleFor(experience) }),
  });

  return (
    <div>
      <ExperienceRow
        bookLabel={t('book')}
        description={t('featuredDescription')}
        experience={featured}
        media={media.featured}
        mode={t(`modes.${featured.mode}` as 'modes.online')}
        modeLabel={t('featuredBadge')}
        title={titleFor(featured)}
        featured
        className="fm-editorial-full-bleed mb-[clamp(46px,8vw,96px)]"
      />

      <section aria-labelledby="experiences-archive-title" data-editorial-archive="true">
        <div className="mb-8 max-w-[58ch]">
          <p className="text-teal font-sans text-[11px] tracking-[.3em] uppercase">{t('all')}</p>
          <h2
            id="experiences-archive-title"
            className="text-ivory mt-3 font-serif text-[clamp(32px,4vw,54px)] leading-[0.98]"
          >
            {t('title')}
          </h2>
        </div>

        <div className="flex flex-col gap-5">
          {others.map((exp) => (
            <ExperienceRow
              key={exp.id}
              bookLabel={t('book')}
              experience={exp}
              media={experienceMedia(exp)}
              mode={t(`modes.${exp.mode}` as 'modes.online')}
              modeLabel={t(`modes.${exp.mode}` as 'modes.online')}
              title={titleFor(exp)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
