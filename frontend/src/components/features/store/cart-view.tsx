'use client';

import type { Product } from '@/types/content';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';

import { Button, EditorialImage, EmptyState, Float, GlassPanel, Kicker } from '@/components/ui';
import { PRODUCTS } from '@/data/products';
import { Link } from '@/i18n/navigation';
import { cartLines } from '@/lib/cart/totals';
import { resolveEditorialMedia } from '@/lib/editorial/asset-registry';
import { formatPrice } from '@/lib/format';
import { categoryKey } from '@/lib/store/category-key';
import { useCartStore } from '@/stores/cart-store';
import type { EditorialMedia } from '@/types/editorial-media';

import { OrderSummary } from './order-summary';

export type CheckoutMedia = {
  empty: EditorialMedia;
  confirmation: EditorialMedia;
};

function CartLineRow({ product, quantity }: { product: Product; quantity: number }) {
  const t = useTranslations('cart');
  const tStore = useTranslations('store');
  const setQuantity = useCartStore((state) => state.setQuantity);
  // La imagen depende del producto y de su alt: se memoiza por esos valores.
  const productAlt = tStore('media.alt.product', {
    title: tStore(`products.${product.id}.title`),
  });
  const productMedia = useMemo(
    () =>
      resolveEditorialMedia('store-product-visual', {
        instance: product.id,
        alt: productAlt,
        sizes: '80px',
        band: product.band,
      }),
    [product.id, product.band, productAlt],
  );

  return (
    // Una sola fila cuando la columna es ancha (de `sm` a `lg`); con el resumen
    // al lado, desde `lg`, la columna se estrecha y la fila vuelve a dos
    // líneas para no recortar el nombre.
    <Float>
      <GlassPanel className="grid grid-cols-[64px_minmax(0,1fr)] gap-x-4 gap-y-3 p-4 sm:grid-cols-[80px_minmax(0,1fr)_auto_auto] sm:items-center lg:grid-cols-[80px_minmax(0,1fr)] lg:items-start">
        <div className="relative row-span-2 aspect-square overflow-hidden rounded-[14px] sm:row-span-1 lg:row-span-2">
          <EditorialImage aspect="1:1" className="h-full" media={productMedia} />
        </div>
        <div className="min-w-0">
          <p className="text-fg text-lead line-clamp-2 font-serif">
            {tStore(`products.${product.id}.title`)}
          </p>
          <p className="text-fg-meta text-meta font-sans">{tStore(categoryKey(product.catKey))}</p>
        </div>
        <div className="col-start-2 flex min-h-11 items-center justify-between gap-4 sm:contents lg:flex">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setQuantity(product.id, quantity - 1)}
              className="border-fg/20 text-fg-muted hover:border-fg/40 hover:text-fg text-serif-md flex size-11 items-center justify-center rounded-full border transition-colors"
              aria-label={t('decrease')}
            >
              −
            </button>
            <span className="text-fg text-serif-sm min-w-[24px] text-center font-serif">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(product.id, quantity + 1)}
              className="border-fg/20 text-fg-muted hover:border-fg/40 hover:text-fg text-serif-md flex size-11 items-center justify-center rounded-full border transition-colors"
              aria-label={t('increase')}
            >
              +
            </button>
          </div>
          <p className="text-accent text-serif-sm text-right font-serif">
            {formatPrice(product.price * quantity)}
          </p>
        </div>
      </GlassPanel>
    </Float>
  );
}

type CartViewProps = {
  media: CheckoutMedia;
  onPlaceOrder: () => void;
};

export function CartView({ media, onPlaceOrder }: CartViewProps) {
  const t = useTranslations('cart');
  const items = useCartStore((state) => state.items);
  const lines = cartLines(items, PRODUCTS);
  const count = lines.reduce((sum, line) => sum + line.quantity, 0);

  if (lines.length === 0) {
    return (
      <section aria-labelledby="cart-title">
        <h1 id="cart-title" className="sr-only">
          {t('title')}
        </h1>
        <EmptyState
          media={media.empty}
          title={t('empty.text')}
          action={
            <Button variant="outline" asChild>
              <Link href="/tienda">{t('empty.cta')}</Link>
            </Button>
          }
        />
      </section>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)] lg:gap-12">
      <h1 className="sr-only">{t('title')}</h1>
      <div>
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <Kicker tone="gold" spacing="widest">
            {t('title')}
          </Kicker>
          <span className="text-fg-meta text-meta tracking-label font-sans">
            {t('items', { count })}
          </span>
        </div>
        <div className="space-y-3">
          {lines.map((line) => (
            <CartLineRow key={line.product.id} product={line.product} quantity={line.quantity} />
          ))}
        </div>
      </div>

      <OrderSummary lines={lines} onPlaceOrder={onPlaceOrder} />
    </div>
  );
}
