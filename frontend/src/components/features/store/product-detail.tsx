'use client';

import type { Product } from '@/types/content';

import { useTranslations } from 'next-intl';

import { Badge, Band, Button, Kicker, Prose, SectionHeading } from '@/components/ui';
import { OrbitalRings } from '@/components/world';
import { PRODUCTS } from '@/data';
import { formatPrice } from '@/lib/format';
import { categoryKey } from '@/lib/store/category-key';
import { relatedProducts } from '@/lib/store/related';
import { useCartStore } from '@/stores/cart-store';
import { usePlayerStore } from '@/stores/player-store';

import { ProductCard } from './product-card';
import { ProductSections } from './product-sections';

type ProductDetailProps = {
  product: Product;
};

export function ProductDetail({ product }: ProductDetailProps) {
  const t = useTranslations('store');
  const lib = useTranslations('library');
  const add = useCartStore((s) => s.add);
  const openPlayer = usePlayerStore((s) => s.open);
  const related = relatedProducts(product, PRODUCTS, 3);

  return (
    <div className="grid gap-8 md:grid-cols-2 md:gap-14 md:items-center">
      <div className="relative">
        <Band gradient={product.band} aspect="4/5" className="rounded-[24px]" />
        <OrbitalRings
          size={150}
          spin={90}
          rings={[{ r: 80, stroke: 'rgba(247,244,234,0.5)', width: 0.6 }]}
          className="pointer-events-none absolute bottom-5 right-5 opacity-[.35]"
        />
      </div>

      <div className="flex flex-col justify-center gap-5">
        <Badge solid>{t(categoryKey(product.catKey))}</Badge>

        <Kicker tone="gold" spacing="widest">
          {t('kicker')}
        </Kicker>

        <h1 className="font-serif text-[clamp(26px,4vw,38px)] leading-tight text-ivory">
          {t(`products.${product.id}.title`)}
        </h1>

        <p className="font-serif text-[28px] tracking-[.04em] text-gold">
          {formatPrice(product.price)}
        </p>

        <Prose maxWidth={48}>{t('productDescription')}</Prose>

        <ul className="space-y-1.5">
          {(t.raw('notes') as string[]).map((note, i) => (
            <li
              key={i}
              className="font-sans text-[13px] tracking-[.04em] text-ivory/60"
            >
              — {note}
            </li>
          ))}
        </ul>

        <div className="flex gap-3 pt-2">
          <Button variant="primary" onClick={() => add(product.id)}>
            {t('add')}
          </Button>
          <Button variant="outline">
            {t('buyNow')}
          </Button>
        </div>

        <button
          type="button"
          onClick={() => openPlayer(product.relatedAudioId)}
          className="mt-1 flex min-h-11 items-center gap-3 self-start rounded-full border border-glass-brd bg-glass px-5 py-3 text-left transition-colors hover:border-gold/60"
        >
          <span
            aria-hidden="true"
            className="flex size-8 shrink-0 items-center justify-center rounded-full border border-gold/50 text-gold"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
          <span className="flex flex-col">
            <span className="font-sans text-[11px] uppercase tracking-[.14em] text-teal">
              {t('relatedFrequencyLabel')}
            </span>
            <span className="font-serif text-[16px] text-ivory">
              {lib(`audios.${product.relatedAudioId}.title` as 'audios.a1.title')}
            </span>
          </span>
        </button>

        <ProductSections />
      </div>

      {related.length > 0 ? (
        <div className="md:col-span-2">
          <SectionHeading
            kicker={t('relatedHeading.kicker')}
            title={t('relatedHeading.title')}
            className="mt-4"
          />
          <div className="grid gap-6 sm:grid-cols-3">
            {related.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
