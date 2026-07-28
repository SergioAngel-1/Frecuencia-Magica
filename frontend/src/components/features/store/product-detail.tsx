'use client';

import type { Product } from '@/types/content';

import { useTranslations } from 'next-intl';

import { Badge, Band, Button, Kicker, Prose } from '@/components/ui';
import { formatPrice } from '@/lib/format';
import { useCartStore } from '@/stores/cart-store';

type ProductDetailProps = {
  product: Product;
};

export function ProductDetail({ product }: ProductDetailProps) {
  const t = useTranslations('store');
  const add = useCartStore((s) => s.add);

  return (
    <div className="grid gap-8 md:grid-cols-2 md:gap-12">
      <Band
        gradient={product.band}
        aspect="square"
        overlay="bottom"
        className="rounded-card h-[320px] md:h-full"
      />

      <div className="flex flex-col justify-center gap-5">
        <Badge solid>{t(`categories.${product.catKey}`)}</Badge>

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
      </div>
    </div>
  );
}
