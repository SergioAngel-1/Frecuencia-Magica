import { getTranslations } from 'next-intl/server';

import { CheckoutView } from '@/components/features/store';
import { PageShell } from '@/components/layout';
import { resolveLocale, type LocaleParams } from '@/i18n/resolve-locale';

type PageProps = { params: LocaleParams };

export async function generateMetadata({ params }: PageProps) {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: 'cart' });

  return { title: t('title') };
}

export default async function CartPage({ params }: PageProps) {
  await resolveLocale(params);

  return (
    <PageShell width="form">
      <CheckoutView />
    </PageShell>
  );
}
