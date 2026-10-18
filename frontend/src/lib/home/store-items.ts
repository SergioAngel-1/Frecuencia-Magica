import type { Product } from '@/types/content';
import { formatPrice } from '@/lib/format';
import type { Translator } from '@/lib/home/translator';
import { resolveEditorialMedia } from '@/lib/editorial/asset-registry';

export type StoreShowcaseItem = {
  id: string;
  title: string;
  price: string;
  media: ReturnType<typeof resolveEditorialMedia>;
};

/** Los productos destacados de la Home: título traducido, precio y su imagen. */
export function buildStoreItems(
  products: readonly Pick<Product, 'id' | 'price'>[],
  t: Translator,
): StoreShowcaseItem[] {
  return products.map((product) => {
    const title = t(`products.${product.id}.title`);

    return {
      id: product.id,
      title,
      price: formatPrice(product.price),
      media: resolveEditorialMedia('store-product-visual', {
        instance: product.id,
        alt: t('media.alt.product', { title }),
        sizes: '(min-width: 1024px) 280px, 50vw',
      }),
    };
  });
}
