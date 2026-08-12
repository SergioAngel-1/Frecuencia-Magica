import { getTranslations } from 'next-intl/server';

import { CheckoutView } from '@/components/features/store';
import { PageShell } from '@/components/layout';
import { resolveLocale, type LocaleParams } from '@/i18n/resolve-locale';
import { resolveEditorialMedia } from '@/lib/editorial/asset-registry';

type PageProps = { params: LocaleParams };

export async function generateMetadata({ params }: PageProps) {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: 'cart' });

  return { title: t('title') };
}

export default async function CartPage({ params }: PageProps) {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: 'cart' });
  const checkoutMedia = {
    empty: resolveEditorialMedia('cart.empty', {
      alt: t('media.alt.empty'),
      sizes: '(min-width: 768px) 820px, calc(100vw - 48px)',
    }),
    confirmation: resolveEditorialMedia('checkout.confirmation', {
      alt: t('media.alt.confirmation'),
      sizes: '(min-width: 768px) 820px, calc(100vw - 48px)',
    }),
  };

  return (
    <PageShell width="form" padding="none" editorial>
      <div className="px-6 pt-[100px] pb-[180px] md:px-0 md:pt-[130px]">
        <CheckoutView media={checkoutMedia} />
      </div>
    </PageShell>
  );
}
