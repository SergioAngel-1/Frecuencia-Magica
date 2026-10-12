'use client';

import type { Product } from '@/types/content';

import { useTranslations } from 'next-intl';

import { Badge, Button, EditorialImage, Kicker, Prose, SectionHeading } from '@/components/ui';
import { PRODUCTS } from '@/data';
import { useRouter } from '@/i18n/navigation';
import { formatPrice } from '@/lib/format';
import { cn } from '@/lib/cn';
import { categoryKey } from '@/lib/store/category-key';
import { relatedProducts } from '@/lib/store/related';
import { useCartStore } from '@/stores/cart-store';
import { usePlayerStore } from '@/stores/player-store';
import type { EditorialMedia, EditorialMediaAspect } from '@/types/editorial-media';

import { ProductCard } from './product-card';
import { ProductSections } from './product-sections';

/** La caja de la imagen sigue el ratio de lo que pinta: el objeto a 1:1, la atmósfera a 16:8. */
const DETAIL_ASPECT: Record<EditorialMediaAspect, string> = {
  viewport: 'aspect-[16/9]',
  '16:9': 'aspect-[16/9]',
  '16:8': 'aspect-[16/8]',
  '3:4': 'aspect-[3/4]',
  '1:1': 'aspect-square',
};

export type ProductMedia = {
  /** La imagen del propio producto (`store-product-visual`); sin ella, la atmósfera de `product.detail`. */
  detail: EditorialMedia;
  related: Record<(typeof PRODUCTS)[number]['id'], EditorialMedia>;
};

type ProductDetailProps = {
  product: Product;
  media: ProductMedia;
};

export function ProductDetail({ product, media }: ProductDetailProps) {
  const t = useTranslations('store');
  const tResonario = useTranslations('resonario');
  const add = useCartStore((state) => state.add);
  const openPlayer = usePlayerStore((state) => state.open);
  const router = useRouter();
  const related = relatedProducts(product, PRODUCTS, 3);
  const title = t(`products.${product.id}.title`);

  return (
    <div>
      {/* La imagen es la de la tarjeta que se eligió en la tienda, a su mismo
          ratio y sin velo: desde `lg` acompaña a la ficha mientras se lee. */}
      <div className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-16">
        <section
          className={cn(
            'rounded-card-lg border-gold/20 relative isolate overflow-hidden border lg:sticky lg:top-[112px]',
            DETAIL_ASPECT[media.detail.aspect],
          )}
          data-editorial-media={media.detail.slot}
        >
          <EditorialImage
            aspect={media.detail.aspect}
            className="h-full"
            media={media.detail}
            overlay={false}
            priority
            scrim={false}
          />
        </section>

        <div className="flex flex-col gap-6">
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
                {tResonario(`audios.${product.relatedAudioId}.title` as 'audios.a1.title')}
              </span>
            </span>
          </button>

          <ProductSections />
        </div>
      </div>

      {related.length > 0 ? (
        <section className="mt-section" data-editorial-media="product.related">
          <SectionHeading
            kicker={t('relatedHeading.kicker')}
            title={t('relatedHeading.title')}
            className="mb-8"
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
