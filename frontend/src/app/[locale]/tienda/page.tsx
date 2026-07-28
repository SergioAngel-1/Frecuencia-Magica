import { getTranslations } from 'next-intl/server';

import { PageShell } from '@/components/layout';
import { Display, Kicker, Prose } from '@/components/ui';
import { resolveLocale, type LocaleParams } from '@/i18n/resolve-locale';
import { CartButton } from '@/components/features/store/cart-button';
import { ProductGrid } from '@/components/features/store/product-grid';

type PageProps = { params: LocaleParams };

export async function generateMetadata({ params }: PageProps) {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: 'store' });

  return { title: t('title') };
}

export default async function StorePage({ params }: PageProps) {
  await resolveLocale(params);
  const t = await getTranslations('store');

  return (
    <PageShell width="store">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <Kicker tone="gold" spacing="widest">
            {t('kicker')}
          </Kicker>
          <Display size="lg" level="h1">
            {t('title')}
          </Display>
        </div>
        <CartButton className="mt-2 shrink-0" />
      </div>
      <Prose maxWidth={54} className="mb-10">
        {t('description')}
      </Prose>
      <ProductGrid />
    </PageShell>
  );
}
