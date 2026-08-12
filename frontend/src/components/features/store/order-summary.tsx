'use client';

import { useTranslations } from 'next-intl';

import { Button, GlassPanel } from '@/components/ui';
import { PRODUCTS } from '@/data';
import { cartCount, cartSubtotal, cartTotal, shippingCost } from '@/lib/cart/totals';
import { formatPrice } from '@/lib/format';

type OrderSummaryProps = {
  items: Record<string, number>;
  onPlaceOrder: () => void;
};

export function OrderSummary({ items, onPlaceOrder }: OrderSummaryProps) {
  const t = useTranslations('cart');
  const subtotal = cartSubtotal(items, PRODUCTS);
  const shipping = shippingCost(subtotal);
  const total = cartTotal(subtotal);
  const count = cartCount(items);

  return (
    <GlassPanel className="h-fit p-5 md:sticky md:top-[150px]" glow>
      <h3 className="text-ivory mb-5 font-serif text-[20px]">{t('summary')}</h3>

      <div className="space-y-3">
        <div className="text-ivory/65 flex justify-between font-sans text-[14px]">
          <span>{t('subtotal')}</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="text-ivory/65 flex justify-between font-sans text-[14px]">
          <span>{t('shipping')}</span>
          <span>{shipping === 0 ? t('shippingFree') : formatPrice(shipping)}</span>
        </div>
        <div className="border-ivory/10 border-t pt-3">
          <div className="text-ivory flex justify-between font-serif text-[21px]">
            <span>{t('total')}</span>
            <span className="text-gold">{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      {count > 0 ? (
        <Button variant="primary" size="md" className="mt-6 w-full" onClick={onPlaceOrder}>
          {t('placeOrder')}
        </Button>
      ) : null}
    </GlassPanel>
  );
}
