'use client';

import { useTranslations } from 'next-intl';

import { Button, GlassPanel } from '@/components/ui';
import { PRODUCTS } from '@/data';
import { cartCount, cartSubtotal, cartTotal, shippingCost } from '@/lib/cart/totals';
import { formatPrice } from '@/lib/format';
import { useCartStore } from '@/stores/cart-store';

type OrderSummaryProps = {
  items: Record<string, number>;
  onPlaceOrder?: () => void;
};

export function OrderSummary({ items, onPlaceOrder }: OrderSummaryProps) {
  const t = useTranslations('cart');
  const subtotal = cartSubtotal(items, PRODUCTS);
  const shipping = shippingCost(subtotal);
  const total = cartTotal(subtotal);
  const count = cartCount(items);

  const handlePlaceOrder = onPlaceOrder ?? (() => {
    useCartStore.getState().clear();
  });

  return (
    <GlassPanel className="sticky top-[150px] p-5" glow>
      <h3 className="mb-4 font-serif text-[18px] text-ivory">{t('summary')}</h3>

      <div className="space-y-2.5">
        <div className="flex justify-between font-sans text-[13px] text-ivory/60">
          <span>{t('subtotal')}</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between font-sans text-[13px] text-ivory/60">
          <span>{t('shipping')}</span>
          <span>{shipping === 0 ? t('shippingFree') : formatPrice(shipping)}</span>
        </div>
        <div className="border-t border-ivory/10 pt-2.5">
          <div className="flex justify-between font-serif text-[19px] text-ivory">
            <span>{t('total')}</span>
            <span className="text-gold">{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      {count > 0 ? (
        <Button variant="primary" size="md" className="mt-5 w-full" onClick={handlePlaceOrder}>
          {t('placeOrder')}
        </Button>
      ) : null}
    </GlassPanel>
  );
}
