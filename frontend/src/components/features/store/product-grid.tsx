import { useTranslations } from 'next-intl';

import { PRODUCTS } from '@/data';
import type { EditorialMedia } from '@/types/editorial-media';

import { ProductCard } from './product-card';
import { Display, Float } from '@/components/ui';

export type StoreProductMedia = Record<(typeof PRODUCTS)[number]['id'], EditorialMedia>;

export type StoreMedia = {
  hero: EditorialMedia;
  products: StoreProductMedia;
  ritualBanner: EditorialMedia;
};

type ProductGridProps = {
  media: StoreMedia;
};

export function ProductGrid({ media }: ProductGridProps) {
  const t = useTranslations('store');
  const featured = PRODUCTS[0]!;
  const others = PRODUCTS.slice(1);
  const firstRow = others.slice(0, 3);
  const side = others[3]!;
  const lastRow = others.slice(4);

  return (
    <section data-editorial-archive="true" aria-labelledby="store-archive-title">
      <div className="mb-8 max-w-[58ch]">
        <Display level="h2" size="md" id="store-archive-title" className="mt-3">
          {t('gridTitle')}
        </Display>
      </div>

      <div className="grid gap-5 md:gap-7">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 md:gap-7">
          {firstRow.map((product, index) => (
            <Float key={product.id} order={index} className="grid">
              <ProductCard media={media.products[product.id]!} product={product} />
            </Float>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-7">
          {/* La destacada ocupa dos columnas, imagen y texto lado a lado; las
              dos imágenes de la fila conservan su 1:1. */}
          <Float order={3} className="grid md:col-span-2">
            <ProductCard featured media={media.products[featured.id]!} product={featured} />
          </Float>
          <Float order={4} className="grid">
            <ProductCard media={media.products[side.id]!} product={side} />
          </Float>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 md:gap-7">
          {lastRow.map((product, index) => (
            <Float key={product.id} order={index + 5} className="grid">
              <ProductCard media={media.products[product.id]!} product={product} />
            </Float>
          ))}
        </div>
      </div>
    </section>
  );
}
