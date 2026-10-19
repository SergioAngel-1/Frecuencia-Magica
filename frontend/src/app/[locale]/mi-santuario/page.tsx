import { getTranslations } from 'next-intl/server';

import {
  ContinueCard,
  DailyCard,
  JournalPanel,
  SanctuaryFeeling,
  SanctuaryHeader,
  StatsRow,
} from '@/components/features/sanctuary';
import { PageShell } from '@/components/layout';
import { Float, FullBleedSection } from '@/components/ui';
import { COURSES } from '@/data/courses';
import { resolveLocale, type LocaleParams } from '@/i18n/resolve-locale';
import { resolveEditorialMedia } from '@/lib/editorial/asset-registry';
import { MOCK_PROFILE, resumeTarget } from '@/lib/sanctuary/profile';
import { buildPageMetadata } from '@/lib/seo/page-metadata';

type PageProps = { params: LocaleParams };

export async function generateMetadata({ params }: PageProps) {
  const locale = await resolveLocale(params);
  const [t, common] = await Promise.all([
    getTranslations({ locale, namespace: 'sanctuary' }),
    getTranslations({ locale, namespace: 'common' }),
  ]);

  return buildPageMetadata({
    locale,
    pathname: '/mi-santuario',
    title: t('meta.title'),
    description: t('meta.description'),
    imageAlt: common('ogImageAlt'),
    noindex: true,
  });
}

export default async function SanctuaryPage({ params }: PageProps) {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: 'sanctuary' });
  // TODO(backend): el perfil sale de la sesión; hasta entonces, el de demostración.
  const profile = MOCK_PROFILE;
  const resume = resumeTarget(profile, COURSES);
  const media = {
    hero: resolveEditorialMedia('sanctuary.hero', { alt: t('media.alt.hero') }),
    continue: resolveEditorialMedia('sanctuary.continue', {
      alt: t('media.alt.continue'),
      band: resume?.course.band,
    }),
    daily: resolveEditorialMedia('sanctuary.daily', { alt: t('media.alt.daily') }),
    // Fondo del campo del diario, que ocupa el ancho del contenido.
    journal: resolveEditorialMedia('sanctuary.journal', {
      alt: t('media.alt.journal'),
      sizes: '(min-width: 1280px) 1180px, calc(100vw - 88px)',
    }),
    empty: resolveEditorialMedia('sanctuary.empty', { alt: t('media.alt.empty') }),
  };

  return (
    <PageShell width="wide" padding="none" fullBleed editorial>
      <FullBleedSection
        media={media.hero}
        mode="quiet"
        overlay="bottom"
        fade="bottom"
        contentClassName="flex items-end"
        minHeight="clamp(300px, 34vw, 460px)"
      >
        <div className="fm-container flex w-full flex-col pt-[120px] pb-10">
          <SanctuaryHeader kicker={t('kicker')} title={t('title', { name: profile.name })} />
          <SanctuaryFeeling />
        </div>
      </FullBleedSection>

      <div className="fm-editorial-full-bleed fm-container pt-block pb-section">
        <StatsRow
          days={profile.daysPracticed}
          frequencies={profile.frequenciesHeard}
          courses={profile.coursesInProgress}
        />

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:gap-8">
          {/* `grid`: la tarjeta se estira al alto de su celda dentro del envoltorio. */}
          {resume ? (
            <Float className="grid">
              <ContinueCard media={media.continue} resume={resume} />
            </Float>
          ) : null}
          <Float order={1} className="grid">
            <DailyCard media={media.daily} audioId={profile.dailyAudioId} />
          </Float>
        </div>

        <div className="mt-8 lg:mt-10">
          <JournalPanel media={{ journal: media.journal, empty: media.empty }} />
        </div>
      </div>
    </PageShell>
  );
}
