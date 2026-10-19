import { getTranslations } from 'next-intl/server';

import { CheckoutView } from '@/components/features/store';
import { PageShell } from '@/components/layout';
import { resolveLocale, type LocaleParams } from '@/i18n/resolve-locale';
import { resolveEditorialMedia } from '@/lib/editorial/asset-registry';
import { buildPageMetadata } from '@/lib/seo/page-metadata';

type PageProps = { params: LocaleParams };

export async function generateMetadata({ params }: PageProps) {
  const locale = await resolveLocale(params);
  const [t, common] = await Promise.all([
    getTranslations({ locale, namespace: 'cart' }),
    getTranslations({ locale, namespace: 'common' }),
  ]);

  return buildPageMetadata({
    locale,
    pathname: '/tienda/carrito',
    title: t('meta.title'),
    description: t('meta.description'),
    imageAlt: common('ogImageAlt'),
    noindex: true,
  });
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
      {/* El margen de página hasta que la columna de 820px cabe centrada con
          aire propio: en 768 la columna arrancaba en x = 0. */}
      <div className="pt-top pb-section px-[var(--page-inset)] lg:px-0">
        <CheckoutView media={checkoutMedia} />
      </div>
    </PageShell>
  );
}
