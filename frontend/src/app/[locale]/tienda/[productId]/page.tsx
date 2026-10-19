import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { ProductDetail } from '@/components/features/store';
import type { ProductMedia } from '@/components/features/store/product-detail';
import { PageShell } from '@/components/layout';
import { PRODUCTS } from '@/data/products';
import { Link } from '@/i18n/navigation';
import { resolveLocale } from '@/i18n/resolve-locale';
import { routing } from '@/i18n/routing';
import { resolveEditorialMedia } from '@/lib/editorial/asset-registry';
import { buildPageMetadata } from '@/lib/seo/page-metadata';

type PageProps = { params: Promise<{ locale: string; productId: string }> };

/**
 * Sólo existen los ids del catálogo. El 404 de uno desconocido sale con su
 * estado real porque el `loading.tsx` del realm vive en `(catalogo)/` y no
 * envuelve esta ruta: un `notFound()` dentro del streaming responde 200.
 */
export const dynamicParams = false;

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

  const [t, common] = await Promise.all([
    getTranslations({ locale, namespace: 'store' }),
    getTranslations({ locale, namespace: 'common' }),
  ]);
  const title = t(`products.${product.id}.title`);

  return buildPageMetadata({
    locale,
    pathname: { pathname: '/tienda/[productId]', params: { productId: product.id } },
    title,
    description: t('meta.productDescription', { title }),
    imageAlt: common('ogImageAlt'),
  });
}

export default async function ProductPage({ params }: PageProps) {
  const locale = await resolveLocale(params);
  const { productId } = await params;
  const product = PRODUCTS.find((item) => item.id === productId);
  if (!product) notFound();

  const t = await getTranslations({ locale, namespace: 'store' });
  const title = t(`products.${product.id}.title`);
  const relatedSizes = '(min-width: 1280px) 380px, (min-width: 768px) 27vw, calc(100vw - 48px)';
  const detailSizes = '(min-width: 1280px) 600px, (min-width: 1024px) 44vw, calc(100vw - 48px)';
  // El objeto propio de cada producto: el mismo slot e instancia que su tarjeta de la tienda.
  const ownVisual = (item: (typeof PRODUCTS)[number], alt: string, sizes: string) =>
    resolveEditorialMedia('store-product-visual', {
      instance: item.id,
      alt,
      sizes,
      band: item.band,
    });
  const related = Object.fromEntries(
    PRODUCTS.map((relatedProduct) => {
      const relatedTitle = t(`products.${relatedProduct.id}.title`);
      const own = ownVisual(
        relatedProduct,
        t('media.alt.related', { title: relatedTitle }),
        relatedSizes,
      );
      // Sin objeto publicado, la atmósfera compartida de relacionados.
      return [
        relatedProduct.id,
        own.src
          ? own
          : resolveEditorialMedia('product.related', {
              alt: t('media.alt.related', { title: relatedTitle }),
              aspect: '16:8',
              sizes: relatedSizes,
              band: relatedProduct.band,
            }),
      ];
    }),
  ) as ProductMedia['related'];
  // La ficha abre con la imagen de la tarjeta que se eligió; la atmósfera de
  // `product.detail` queda para el producto que aún no tenga la suya.
  const detail = ownVisual(product, t('media.alt.detail', { title }), detailSizes);
  // Vistas propias del producto (etiqueta, textura, en uso): sólo las que declara.
  const galleryAlt = {
    label: t('media.alt.viewLabel', { title }),
    texture: t('media.alt.viewTexture', { title }),
    inUse: t('media.alt.viewInUse', { title }),
  } as const;
  const gallery: NonNullable<ProductMedia['gallery']> = {};
  for (const kind of ['label', 'texture', 'inUse'] as const) {
    const view = product.gallery?.[kind];
    if (view) {
      gallery[kind] = resolveEditorialMedia(view.slot, {
        instance: view.instance,
        alt: galleryAlt[kind],
        sizes: detailSizes,
        band: product.band,
      });
    }
  }
  const productMedia: ProductMedia = {
    gallery,
    detail: detail.src
      ? detail
      : resolveEditorialMedia('product.detail', {
          alt: t('media.alt.detail', { title }),
          sizes: detailSizes,
          band: product.band,
        }),
    related,
  };

  return (
    <PageShell width="wide" padding="none" fullBleed editorial>
      <div className="fm-editorial-full-bleed fm-container pb-section pt-top">
        <Link
          href="/tienda"
          className="text-fg-meta hover:text-accent text-meta tracking-label mb-8 inline-flex min-h-11 items-center font-sans uppercase transition-colors"
        >
          ← {t('backToStore')}
        </Link>
        <ProductDetail product={product} media={productMedia} />
      </div>
    </PageShell>
  );
}
