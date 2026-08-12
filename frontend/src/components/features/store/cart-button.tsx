'use client';

import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/cn';
import { useCartStore } from '@/stores/cart-store';

type CartButtonProps = {
  className?: string;
};

export function CartButton({ className }: CartButtonProps) {
  const t = useTranslations('store');
  const count = useCartStore((s) => Object.values(s.items).reduce((a, b) => a + b, 0));

  if (count === 0) return null;

  return (
    <Link
      href="/tienda/carrito"
      className={cn(
        'rounded-pill inline-flex min-h-11 items-center gap-2 border border-gold/30 bg-void/70 px-4 py-2 font-sans text-[12px] tracking-[.14em] uppercase text-gold backdrop-blur-sm transition-[color,background-color] duration-300 hover:bg-gold/10 hover:shadow-[0_0_20px_rgba(216,185,120,0.2)]',
        className,
      )}
      aria-label={t('cart')}
    >
      <span className="relative flex h-[18px] w-[18px] items-center justify-center rounded-full bg-gold text-[10px] font-semibold text-void">
        {count}
      </span>
      <span>{t('cart')}</span>
    </Link>
  );
}
