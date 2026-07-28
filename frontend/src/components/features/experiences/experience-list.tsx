import { useTranslations } from 'next-intl';

import { EXPERIENCES } from '@/data';

import { ExperienceRow } from './experience-row';

export function ExperienceList() {
  const t = useTranslations('experiences');
  const featured = EXPERIENCES[0]!;
  const others = EXPERIENCES.slice(1);

  return (
    <div>
      <ExperienceRow
        experience={featured}
        title={t(`items.${featured.id}.title` as 'items.e1.title')}
        mode={t(`modes.${featured.mode}` as 'modes.online')}
        modeLabel={t('featuredBadge')}
        bookLabel={t('book')}
        featured
        className="mb-8"
      />

      <h2 className="font-sans text-[11px] uppercase tracking-[.3em] text-ivory/55 mb-5">
        {t('all')}
      </h2>

      <div className="flex flex-col gap-5">
        {others.map((exp) => (
          <ExperienceRow
            key={exp.id}
            experience={exp}
            title={t(`items.${exp.id}.title` as 'items.e1.title')}
            mode={t(`modes.${exp.mode}` as 'modes.online')}
            modeLabel={t(`modes.${exp.mode}` as 'modes.online')}
            bookLabel={t('book')}
          />
        ))}
      </div>
    </div>
  );
}
