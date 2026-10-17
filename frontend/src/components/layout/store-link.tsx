'use client';

import { useTranslations } from 'next-intl';

import { useCartCount } from '@/hooks/use-cart-count';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/cn';

/**
 * Enlace de texto a la tienda, con el conteo del carrito.
 *
 * Desde 640px. Por debajo no cabe junto al resto de controles del header a
 * 390px: ahí el acceso a la tienda y al carrito vive en el panel del menú
 * (`RealmMenu`).
 */
export function StoreLink({ active }: { active: boolean }) {
  const t = useTranslations('header');
  const count = useCartCount();

  return (
    <Link
      href="/tienda"
      data-magnetic
      aria-current={active ? 'page' : undefined}
      className={cn(
        'rounded-pill text-meta tracking-ui pointer-events-auto hidden min-h-11 items-center gap-2 border px-4 font-sans sm:inline-flex',
        'transition-[color,background-color,border-color] duration-300 ease-out',
        active
          ? 'text-accent border-accent/60 bg-accent/18'
          : 'text-fg border-line-strong bg-surface hover:border-accent/40 hover:bg-fg/9',
      )}
    >
      <span>{t('store')}</span>
      {count > 0 && (
        <span className="bg-accent text-scrim text-label flex size-[18px] items-center justify-center rounded-full font-semibold">
          {count}
        </span>
      )}
    </Link>
  );
}
