import { getTranslations } from 'next-intl/server';

import { PageShell } from '@/components/layout';
import { Display, Kicker, Prose } from '@/components/ui';
import { resolveLocale, type LocaleParams } from '@/i18n/resolve-locale';

type PageProps = { params: LocaleParams };

export async function generateMetadata({ params }: PageProps) {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: 'auth' });

  return { title: t('login.title') };
}

/**
 * Placeholder de la Fase 5: la ruta existe, el marco la envuelve y el copy
 * es el definitivo. La vista completa llega en su fase.
 */
export default async function AccessPage({ params }: PageProps) {
  await resolveLocale(params);
  const t = await getTranslations('auth');

  return (
    <PageShell width="default">
      <Kicker tone="teal" spacing="widest">
        {t('kicker')}
      </Kicker>
      <Display size="lg" level="h1">
        {t('login.title')}
      </Display>
      <Prose maxWidth={54} className="mt-5">
        {t('login.subtitle')}
      </Prose>
    </PageShell>
  );
}
