import { getTranslations } from 'next-intl/server';

import { PageShell } from '@/components/layout';
import { Display, Kicker } from '@/components/ui';
import { ContinueCard, DailyCard, JournalPanel, StatsRow } from '@/components/features/sanctuary';
import { resolveLocale, type LocaleParams } from '@/i18n/resolve-locale';

type PageProps = { params: LocaleParams };

export async function generateMetadata({ params }: PageProps) {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: 'sanctuary' });

  return { title: t('title') };
}

export default async function SanctuaryPage({ params }: PageProps) {
  await resolveLocale(params);
  const t = await getTranslations('sanctuary');

  return (
    <PageShell width="default">
      <div className="mb-8">
        <Kicker tone="gold" spacing="widest">
          {t('kicker')}
        </Kicker>
        <Display size="lg" level="h1">
          {t('title')}
        </Display>
      </div>

      <div className="mb-8">
        <StatsRow />
      </div>

      <div className="grid gap-6 md:grid-cols-2 md:gap-8">
        <ContinueCard />
        <DailyCard />
      </div>

      <div className="mt-8 md:mt-10">
        <JournalPanel />
      </div>
    </PageShell>
  );
}
