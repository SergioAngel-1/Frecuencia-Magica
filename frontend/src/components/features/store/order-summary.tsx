'use client';

import { useTranslations } from 'next-intl';

import { Button, GlassPanel } from '@/components/ui';
import { cartTotal, shippingCost } from '@/lib/cart/totals';
import { formatPrice } from '@/lib/format';
import type { CartLine } from '@/lib/cart/totals';

type OrderSummaryProps = {
  lines: readonly CartLine[];
  onPlaceOrder: () => void;
};

export function OrderSummary({ lines, onPlaceOrder }: OrderSummaryProps) {
  const t = useTranslations('cart');
  const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
  const shipping = shippingCost(subtotal);
  const total = cartTotal(subtotal);
  const count = lines.reduce((sum, line) => sum + line.quantity, 0);

  return (
    <GlassPanel className="h-fit p-5 md:sticky md:top-[150px]" glow>
      <h3 className="text-fg text-serif-md mb-5 font-serif">{t('summary')}</h3>

      <div className="space-y-3">
        <div className="text-fg-soft text-body flex justify-between font-sans">
          <span>{t('subtotal')}</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="text-fg-soft text-body flex justify-between font-sans">
          <span>{t('shipping')}</span>
          <span>{shipping === 0 ? t('shippingFree') : formatPrice(shipping)}</span>
        </div>
        <div className="border-fg/10 border-t pt-3">
          <div className="text-fg text-serif-md flex justify-between font-serif">
            <span>{t('total')}</span>
            <span className="text-accent">{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      {count > 0 ? (
        <Button variant="primary" className="mt-6 w-full" onClick={onPlaceOrder}>
          {t('placeOrder')}
        </Button>
      ) : null}
    </GlassPanel>
  );
}
