'use client';

import { useTranslations } from 'next-intl';

import { useCartCount } from '@/hooks/use-cart-count';
import { Link } from '@/i18n/navigation';
import { dockSegmentClasses } from './control-dock';

/**
 * Enlace de texto a la tienda, con el conteo del carrito.
 *
 * Desde 460px. Por debajo no cabe junto al resto de controles del header a
 * 390px: ahí el acceso a la tienda y al carrito vive en el panel del menú
 * (`RealmMenu`).
 */
export function StoreLink({ active }: { active: boolean }) {
  const t = useTranslations('header');
  const tCart = useTranslations('cart');
  const count = useCartCount();

  return (
    <Link
      href="/tienda"
      data-magnetic
      aria-current={active ? 'page' : undefined}
      className={dockSegmentClasses({
        active,
        className: 'hidden px-3.5 min-[460px]:inline-flex',
      })}
    >
      <span>{t('store')}</span>
      {count > 0 && (
        <span className="bg-accent text-scrim text-label flex size-[18px] items-center justify-center rounded-full font-semibold">
          <span aria-hidden="true">{count}</span>
          <span className="sr-only">{tCart('items', { count })}</span>
        </span>
      )}
    </Link>
  );
}
