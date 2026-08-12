import { useTranslations } from 'next-intl';

import { PRODUCTS } from '@/data';
import type { EditorialMedia } from '@/types/editorial-media';

import { ProductCard } from './product-card';

export type StoreMedia = {
  hero: EditorialMedia;
  product: EditorialMedia;
  productFeatured: EditorialMedia;
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
        <p className="text-teal font-sans text-[11px] tracking-[.3em] uppercase">{t('kicker')}</p>
        <h2
          id="store-archive-title"
          className="text-ivory mt-3 font-serif text-[clamp(32px,4vw,54px)] leading-[0.98]"
        >
          {t('gridTitle')}
        </h2>
      </div>

      <div className="grid gap-5 md:gap-7">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 md:gap-7">
          {firstRow.map((product) => (
            <ProductCard key={product.id} media={media.product} product={product} />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-7">
          <div className="md:col-span-2">
            <ProductCard featured media={media.productFeatured} product={featured} />
          </div>
          <ProductCard className="md:mt-auto" media={media.product} product={side} />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 md:gap-7">
          {lastRow.map((product) => (
            <ProductCard key={product.id} media={media.product} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
