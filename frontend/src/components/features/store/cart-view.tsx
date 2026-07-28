'use client';

import type { Product } from '@/types/content';

import { useTranslations } from 'next-intl';

import { Button, EmptyState, GlassPanel, Kicker } from '@/components/ui';
import { PRODUCTS } from '@/data';
import { Link } from '@/i18n/navigation';
import { cartLines, cartCount } from '@/lib/cart/totals';
import { formatPrice } from '@/lib/format';
import { categoryKey } from '@/lib/store/category-key';
import { useCartStore } from '@/stores/cart-store';

import { OrderSummary } from './order-summary';

function CartLineRow({ product, quantity }: { product: Product; quantity: number }) {
  const t = useTranslations('cart');
  const tStore = useTranslations('store');
  const { setQuantity } = useCartStore();

  return (
    <GlassPanel className="flex items-center gap-4 p-4">
      <div
        className="h-16 w-16 shrink-0 rounded-[14px]"
        style={{ backgroundImage: product.band }}
      />
      <div className="flex-1 min-w-0">
        <p className="truncate font-serif text-[16px] text-ivory">
          {tStore(`products.${product.id}.title`)}
        </p>
        <p className="font-sans text-[12px] text-ivory/50">
          {tStore(categoryKey(product.catKey))}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => setQuantity(product.id, quantity - 1)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-ivory/20 text-ivory/60 transition-colors hover:border-ivory/40 hover:text-ivory"
          aria-label={t('decrease')}
        >
          −
        </button>
        <span className="min-w-[24px] text-center font-serif text-[17px] text-ivory">
          {quantity}
        </span>
        <button
          onClick={() => setQuantity(product.id, quantity + 1)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-ivory/20 text-ivory/60 transition-colors hover:border-ivory/40 hover:text-ivory"
          aria-label={t('increase')}
        >
          +
        </button>
      </div>
      <p className="min-w-[60px] text-right font-serif text-[17px] text-gold">
        {formatPrice(product.price * quantity)}
      </p>
    </GlassPanel>
  );
}

type CartViewProps = {
  onPlaceOrder?: () => void;
};

export function CartView({ onPlaceOrder }: CartViewProps) {
  const t = useTranslations('cart');
  const items = useCartStore((s) => s.items);
  const lines = cartLines(items, PRODUCTS);
  const count = cartCount(items);

  if (count === 0) {
    return (
      <EmptyState
        title={t('empty.text')}
        action={
          <Button variant="outline" asChild>
            <Link href="/tienda">{t('empty.cta')}</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-[1fr_360px] md:gap-10">
      <div>
        <div className="mb-6 flex items-center justify-between">
          <Kicker tone="gold" spacing="widest">
            {t('title')}
          </Kicker>
          <span className="font-sans text-[12px] tracking-[.14em] text-ivory/40">
            {t('items', { count })}
          </span>
        </div>
        <div className="space-y-3">
          {lines.map((line) => (
            <CartLineRow key={line.product.id} product={line.product} quantity={line.quantity} />
          ))}
        </div>
      </div>

      <div>
        <OrderSummary items={items} onPlaceOrder={onPlaceOrder} />
      </div>
    </div>
  );
}
