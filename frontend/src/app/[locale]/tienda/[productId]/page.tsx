import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { ProductDetail } from '@/components/features/store';
import { PageShell } from '@/components/layout';
import { PRODUCTS } from '@/data';
import { Link } from '@/i18n/navigation';
import { resolveLocale } from '@/i18n/resolve-locale';
import { routing } from '@/i18n/routing';
import { resolveEditorialMedia } from '@/lib/editorial/asset-registry';

type PageProps = { params: Promise<{ locale: string; productId: string }> };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    PRODUCTS.map((product) => ({ locale, productId: product.id })),
  );
}

export async function generateMetadata({ params }: PageProps) {
  const locale = await resolveLocale(params);
  const { productId } = await params;
  const product = PRODUCTS.find((item) => item.id === productId);
  if (!product) return {};

  const t = await getTranslations({ locale, namespace: 'store' });
  return { title: t(`products.${product.id}.title`) };
}

export default async function ProductPage({ params }: PageProps) {
  const locale = await resolveLocale(params);
  const { productId } = await params;
  const product = PRODUCTS.find((item) => item.id === productId);
  if (!product) notFound();

  const t = await getTranslations({ locale, namespace: 'store' });
  const title = t(`products.${product.id}.title`);
  const productMedia = {
    detail: resolveEditorialMedia('product.detail', {
      alt: t('media.alt.detail', { title }),
      sizes: '100vw',
    }),
    related: resolveEditorialMedia('product.related', {
      alt: t('media.alt.related'),
      sizes: '(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 100vw',
    }),
  };

  return (
    <PageShell width="wide" padding="none" fullBleed editorial>
      <div className="mx-auto w-full max-w-[1240px] px-6 pt-[100px] pb-[220px] md:px-[8vw] md:pt-[130px]">
        <Link
          href="/tienda"
          className="text-ivory/55 hover:text-gold mb-8 inline-flex min-h-11 items-center font-sans text-[12px] tracking-[.14em] uppercase transition-colors"
        >
          ← {t('backToStore')}
        </Link>
        <ProductDetail product={product} media={productMedia} />
      </div>
    </PageShell>
  );
}
