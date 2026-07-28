import { getTranslations } from 'next-intl/server';

import { ExperienceList } from '@/components/features/experiences/experience-list';
import { PageShell } from '@/components/layout';
import { Display, Kicker, Prose } from '@/components/ui';
import { resolveLocale, type LocaleParams } from '@/i18n/resolve-locale';

type PageProps = { params: LocaleParams };

export async function generateMetadata({ params }: PageProps) {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: 'experiences' });

  return { title: t('title') };
}

export default async function ExperiencesPage({ params }: PageProps) {
  await resolveLocale(params);
  const t = await getTranslations('experiences');

  return (
    <PageShell width="default">
      <Kicker tone="lav" spacing="widest">
        {t('kicker')}
      </Kicker>
      <Display size="lg" level="h1">
        {t('title')}
      </Display>
      <Prose maxWidth={54} className="mt-5 mb-12">
        {t('description')}
      </Prose>

      <ExperienceList />
    </PageShell>
  );
}
