'use client';

import type { Product } from '@/types/content';

import { useTranslations } from 'next-intl';

import { Button, EditorialImage, EmptyState, GlassPanel, Kicker } from '@/components/ui';
import { PRODUCTS } from '@/data';
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
  const productMedia = resolveEditorialMedia('store-product-visual', {
    alt: tStore('media.alt.product', {
      title: tStore(`products.${product.id}.title`),
    }),
    sizes: '80px',
  });

  return (
    <GlassPanel className="grid grid-cols-[64px_minmax(0,1fr)] gap-x-4 gap-y-3 p-4 sm:grid-cols-[80px_minmax(0,1fr)_auto_auto] sm:items-center">
      <div className="relative row-span-2 aspect-square overflow-hidden rounded-[14px] sm:row-span-1">
        <EditorialImage aspect="1:1" className="h-full" media={productMedia} />
      </div>
      <div className="min-w-0">
        <p className="text-ivory text-lead truncate font-serif">
          {tStore(`products.${product.id}.title`)}
        </p>
        <p className="text-fg-meta text-meta font-sans">{tStore(categoryKey(product.catKey))}</p>
      </div>
      <div className="col-start-2 flex min-h-11 items-center justify-between gap-4 sm:contents">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setQuantity(product.id, quantity - 1)}
            className="border-ivory/20 text-fg-muted hover:border-ivory/40 hover:text-ivory flex size-11 items-center justify-center rounded-full border text-[20px] transition-colors"
            aria-label={t('decrease')}
          >
            −
          </button>
          <span className="text-ivory min-w-[24px] text-center font-serif text-[18px]">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity(product.id, quantity + 1)}
            className="border-ivory/20 text-fg-muted hover:border-ivory/40 hover:text-ivory flex size-11 items-center justify-center rounded-full border text-[20px] transition-colors"
            aria-label={t('increase')}
          >
            +
          </button>
        </div>
        <p className="text-gold text-right font-serif text-[18px]">
          {formatPrice(product.price * quantity)}
        </p>
      </div>
    </GlassPanel>
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
      <section
        className="rounded-card-lg relative isolate min-h-[clamp(420px,55vw,620px)] overflow-hidden"
        data-editorial-media="cart.empty"
      >
        <h1 className="sr-only">{t('title')}</h1>
        <div className="absolute inset-0">
          <EditorialImage
            aspect="16:9"
            className="h-full"
            media={media.empty}
            overlay="bottom"
            scrim="bottom"
          />
        </div>
        <div className="relative z-10 flex min-h-[clamp(420px,55vw,620px)] items-center justify-center px-4">
          <EmptyState
            title={t('empty.text')}
            className="max-w-[34rem]"
            action={
              <Button variant="outline" asChild>
                <Link href="/tienda">{t('empty.cta')}</Link>
              </Button>
            }
          />
        </div>
      </section>
    );
  }

  return (
    <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(280px,360px)] md:gap-12">
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
