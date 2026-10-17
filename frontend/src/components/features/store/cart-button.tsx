'use client';

import { useTranslations } from 'next-intl';

import { PRODUCTS } from '@/data';
import { Link } from '@/i18n/navigation';
import { cartLines } from '@/lib/cart/totals';
import { cn } from '@/lib/cn';
import { useCartStore } from '@/stores/cart-store';

type CartButtonProps = {
  className?: string;
};

export function CartButton({ className }: CartButtonProps) {
  const t = useTranslations('store');
  const items = useCartStore((state) => state.items);
  const count = cartLines(items, PRODUCTS).reduce((sum, line) => sum + line.quantity, 0);

  if (count === 0) return null;

  return (
    <Link
      href="/tienda/carrito"
      className={cn(
        'rounded-pill border-accent/30 bg-scrim/70 text-accent hover:bg-accent/10 text-meta tracking-label inline-flex min-h-11 items-center gap-2 border px-4 py-2 font-sans uppercase backdrop-blur-sm transition-[color,background-color] duration-300 hover:shadow-[0_0_20px_rgb(var(--halo)_/_0.2)]',
        className,
      )}
      aria-label={t('cart')}
    >
      <span className="bg-accent text-scrim text-label relative flex size-[18px] items-center justify-center rounded-full font-semibold">
        {count}
      </span>
      <span>{t('cart')}</span>
    </Link>
  );
}
