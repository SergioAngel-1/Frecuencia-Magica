import { getTranslations } from 'next-intl/server';

import {
  ContinueCard,
  DailyCard,
  JournalPanel,
  SanctuaryHeader,
  StatsRow,
} from '@/components/features/sanctuary';
import { PageShell } from '@/components/layout';
import { FullBleedSection } from '@/components/ui';
import { COURSES } from '@/data';
import { resolveLocale, type LocaleParams } from '@/i18n/resolve-locale';
import { resolveEditorialMedia } from '@/lib/editorial/asset-registry';
import { MOCK_PROFILE, resumeTarget } from '@/lib/sanctuary/profile';

type PageProps = { params: LocaleParams };

export async function generateMetadata({ params }: PageProps) {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: 'sanctuary' });

  return { title: t('kicker') };
}

export default async function SanctuaryPage({ params }: PageProps) {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: 'sanctuary' });
  // TODO(backend): el perfil sale de la sesión; hasta entonces, el de demostración.
  const profile = MOCK_PROFILE;
  const resume = resumeTarget(profile, COURSES);
  const media = {
    hero: resolveEditorialMedia('sanctuary.hero', { alt: t('media.alt.hero') }),
    continue: resolveEditorialMedia('sanctuary.continue', { alt: t('media.alt.continue') }),
    daily: resolveEditorialMedia('sanctuary.daily', { alt: t('media.alt.daily') }),
    journal: resolveEditorialMedia('sanctuary.journal', { alt: t('media.alt.journal') }),
    empty: resolveEditorialMedia('sanctuary.empty', { alt: t('media.alt.empty') }),
  };

  return (
    <PageShell width="wide" padding="none" fullBleed editorial>
      <FullBleedSection
        media={media.hero}
        mode="quiet"
        overlay="bottom"
        contentClassName="flex min-h-full items-end"
        minHeight="clamp(300px, 34vw, 460px)"
      >
        <div className="fm-container flex w-full flex-col pt-[120px] pb-10">
          <SanctuaryHeader kicker={t('kicker')} title={t('title', { name: profile.name })} />
        </div>
      </FullBleedSection>

      <div className="fm-editorial-full-bleed fm-container pt-8 pb-[220px]">
        <StatsRow
          days={profile.daysPracticed}
          frequencies={profile.frequenciesHeard}
          courses={profile.coursesInProgress}
        />

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:gap-8">
          {resume ? <ContinueCard media={media.continue} resume={resume} /> : null}
          <DailyCard media={media.daily} audioId={profile.dailyAudioId} />
        </div>

        <div className="mt-8 lg:mt-10">
          <JournalPanel media={{ journal: media.journal, empty: media.empty }} />
        </div>
      </div>
    </PageShell>
  );
}
