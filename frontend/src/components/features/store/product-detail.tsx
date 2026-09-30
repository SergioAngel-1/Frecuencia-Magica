'use client';

import type { Product } from '@/types/content';

import { useTranslations } from 'next-intl';

import { Badge, Button, EditorialImage, Kicker, Prose, SectionHeading } from '@/components/ui';
import { OrbitalRings } from '@/components/world';
import { PRODUCTS } from '@/data';
import { useRouter } from '@/i18n/navigation';
import { formatPrice } from '@/lib/format';
import { categoryKey } from '@/lib/store/category-key';
import { relatedProducts } from '@/lib/store/related';
import { cn } from '@/lib/cn';
import { useCartStore } from '@/stores/cart-store';
import { usePlayerStore } from '@/stores/player-store';
import type { EditorialMedia } from '@/types/editorial-media';

import { ProductCard } from './product-card';
import { ProductSections } from './product-sections';

export type ProductMedia = {
  detail: EditorialMedia;
  related: Record<(typeof PRODUCTS)[number]['id'], EditorialMedia>;
};

type ProductDetailProps = {
  product: Product;
  media: ProductMedia;
};

export function ProductDetail({ product, media }: ProductDetailProps) {
  const t = useTranslations('store');
  const lib = useTranslations('library');
  const add = useCartStore((state) => state.add);
  const openPlayer = usePlayerStore((state) => state.open);
  const router = useRouter();
  const related = relatedProducts(product, PRODUCTS, 3);
  const title = t(`products.${product.id}.title`);

  return (
    <div>
      <section
        className="rounded-card-lg relative isolate min-h-[clamp(320px,52vw,640px)] overflow-hidden"
        data-editorial-media="product.detail"
      >
        <EditorialImage
          aspect="16:8"
          className="absolute inset-0 h-full"
          media={media.detail}
          overlay="bottom"
          scrim="bottom"
        />
        <div
          aria-hidden="true"
          className="border-gold/35 pointer-events-none absolute top-[14%] right-[10%] z-10 size-[clamp(100px,18vw,220px)] rounded-full border opacity-60"
          data-editorial-geometry="true"
        />
        <OrbitalRings
          className="pointer-events-none absolute right-[8%] bottom-[10%] z-10 opacity-45"
          size={160}
          spin={100}
          rings={[{ r: 80, stroke: 'rgba(247,244,234,0.5)', width: 0.6 }]}
        />
      </section>

      <div className="mt-[clamp(34px,6vw,76px)] grid gap-10 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1fr)] lg:gap-16">
        <div>
          <Badge solid>{t(categoryKey(product.catKey))}</Badge>
          <Kicker tone="gold" spacing="widest" className="mt-6">
            {t('kicker')}
          </Kicker>
          <h1 className="text-ivory mt-4 font-serif text-[clamp(36px,5vw,72px)] leading-[0.94]">
            {title}
          </h1>
          <p className="text-gold tracking-soft mt-6 font-serif text-[30px]">
            {formatPrice(product.price)}
          </p>
        </div>

        <div className="flex flex-col gap-6 lg:pt-9">
          <Prose maxWidth={48}>{t('productDescription')}</Prose>
          <ul className="space-y-2">
            {(t.raw('notes') as string[]).map((note) => (
              <li key={note} className="text-fg-soft text-body tracking-soft font-sans">
                — {note}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button variant="primary" onClick={() => add(product.id)}>
              {t('add')}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                add(product.id);
                router.push('/tienda/carrito');
              }}
            >
              {t('buyNow')}
            </Button>
          </div>

          <button
            type="button"
            onClick={() => openPlayer(product.relatedAudioId)}
            className="border-glass-brd bg-glass hover:border-gold/60 mt-1 flex min-h-11 items-center gap-3 self-start rounded-full border px-5 py-3 text-left transition-colors"
          >
            <span
              aria-hidden="true"
              className="border-gold/50 text-gold flex size-8 shrink-0 items-center justify-center rounded-full border"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
            <span className="flex flex-col">
              <span className="text-teal text-label tracking-label font-sans uppercase">
                {t('relatedFrequencyLabel')}
              </span>
              <span className="text-ivory font-serif text-[16px]">
                {lib(`audios.${product.relatedAudioId}.title` as 'audios.a1.title')}
              </span>
            </span>
          </button>

          <ProductSections />
        </div>
      </div>

      {related.length > 0 ? (
        <section className="mt-[clamp(64px,10vw,140px)]" data-editorial-media="product.related">
          <SectionHeading
            kicker={t('relatedHeading.kicker')}
            title={t('relatedHeading.title')}
            className="mb-8"
          />
          <div className={cn('grid gap-6 sm:grid-cols-3')}>
            {related.map((relatedProduct) => (
              <ProductCard
                key={relatedProduct.id}
                media={media.related[relatedProduct.id]!}
                product={relatedProduct}
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
