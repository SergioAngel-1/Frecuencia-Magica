import { getTranslations } from 'next-intl/server';

import { PageShell } from '@/components/layout';
import { Display, FullBleedSection, Kicker } from '@/components/ui';
import { ContinueCard, DailyCard, JournalPanel, StatsRow } from '@/components/features/sanctuary';
import { resolveLocale, type LocaleParams } from '@/i18n/resolve-locale';
import { resolveEditorialMedia } from '@/lib/editorial/asset-registry';

type PageProps = { params: LocaleParams };

export async function generateMetadata({ params }: PageProps) {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: 'sanctuary' });

  return { title: t('title') };
}

export default async function SanctuaryPage({ params }: PageProps) {
  await resolveLocale(params);
  const t = await getTranslations('sanctuary');
  const media = {
    hero: resolveEditorialMedia('sanctuary.hero', { alt: t('media.alt.hero') }),
    continue: resolveEditorialMedia('sanctuary.continue', { alt: t('media.alt.continue') }),
    daily: resolveEditorialMedia('sanctuary.daily', { alt: t('media.alt.daily') }),
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
          <Kicker tone="gold" spacing="widest">
            {t('kicker')}
          </Kicker>
          <Display size="lg" level="h1" className="mt-2">
            {t('title')}
          </Display>
        </div>
      </FullBleedSection>

      <div className="fm-editorial-full-bleed fm-container pt-8 pb-[220px]">
        <div className="mb-8">
          <StatsRow />
        </div>

        <div className="grid gap-6 md:grid-cols-2 md:gap-8">
          <ContinueCard media={media.continue} />
          <DailyCard media={media.daily} />
        </div>

        <div className="mt-8 md:mt-10">
          <JournalPanel />
        </div>
      </div>
    </PageShell>
  );
}
