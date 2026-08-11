import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { ProductDetail } from '@/components/features/store';
import { PageShell } from '@/components/layout';
import { PRODUCTS } from '@/data';
import { Link } from '@/i18n/navigation';
import { resolveLocale } from '@/i18n/resolve-locale';
import { routing } from '@/i18n/routing';

type PageProps = { params: Promise<{ locale: string; productId: string }> };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    PRODUCTS.map((p) => ({ locale, productId: p.id })),
  );
}

export async function generateMetadata({ params }: PageProps) {
  const locale = await resolveLocale(params);
  const { productId } = await params;
  const product = PRODUCTS.find((p) => p.id === productId);
  // Sin producto (id obsoleto o ruta inventada): el layout raíz aporta el
  // título por defecto; la página resuelve con notFound().
  if (!product) return {};

  const t = await getTranslations({ locale, namespace: 'store' });

  return { title: t(`products.${product.id}.title`) };
}

export default async function ProductPage({ params }: PageProps) {
  await resolveLocale(params);
  const { productId } = await params;
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) notFound();

  const t = await getTranslations('store');

  return (
    <PageShell width="default">
      <Link
        href="/tienda"
        className="mb-8 inline-flex font-sans text-[12px] tracking-[.14em] uppercase text-ivory/50 transition-colors hover:text-gold"
      >
        ← {t('backToStore')}
      </Link>
      <ProductDetail product={product} />
    </PageShell>
  );
}
