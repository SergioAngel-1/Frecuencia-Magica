import { getTranslations } from 'next-intl/server';

import { PageShell } from '@/components/layout';
import { Display, Kicker, Prose } from '@/components/ui';
import { resolveLocale, type LocaleParams } from '@/i18n/resolve-locale';

type PageProps = { params: LocaleParams };

export async function generateMetadata({ params }: PageProps) {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: 'academy' });

  return { title: t('title') };
}

/**
 * Placeholder de la Fase 5: la ruta existe, el marco la envuelve y el copy
 * es el definitivo. La vista completa llega en su fase.
 */
export default async function AcademyPage({ params }: PageProps) {
  await resolveLocale(params);
  const t = await getTranslations('academy');

  return (
    <PageShell width="default">
      <Kicker tone="teal" spacing="widest">
        {t('kicker')}
      </Kicker>
      <Display size="lg" level="h1">
        {t('title')}
      </Display>
      <Prose maxWidth={54} className="mt-5">
        {t('description')}
      </Prose>
    </PageShell>
  );
}
