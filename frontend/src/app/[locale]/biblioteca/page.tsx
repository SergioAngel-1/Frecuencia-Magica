import { getTranslations } from 'next-intl/server';

import { LibrarySystem } from '@/components/features/library/library-system';
import { PageShell } from '@/components/layout';
import { Display, Kicker, Prose } from '@/components/ui';
import { resolveLocale, type LocaleParams } from '@/i18n/resolve-locale';

type PageProps = { params: LocaleParams };

export async function generateMetadata({ params }: PageProps) {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: 'library' });

  return { title: t('title') };
}

export default async function LibraryPage({ params }: PageProps) {
  await resolveLocale(params);
  const t = await getTranslations('library');

  return (
    <PageShell width="wide" className="pb-[220px] pt-[130px]">
      <Kicker tone="gold" spacing="widest">
        {t('kicker')}
      </Kicker>
      <Display size="lg" level="h1">
        {t('title')}
      </Display>
      <Prose maxWidth={54} className="mt-5 mb-10">
        {t('description')}
      </Prose>

      <LibrarySystem />
    </PageShell>
  );
}
