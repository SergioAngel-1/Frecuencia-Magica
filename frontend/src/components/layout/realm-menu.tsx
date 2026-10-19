'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

import { Modal } from '@/components/ui';
import { NAV_REALMS, NAV_STORY } from '@/config/navigation';
import { useCartCount } from '@/hooks/use-cart-count';
import { useRealm } from '@/hooks/use-realm';
import { Link, usePathname } from '@/i18n/navigation';
import { cn } from '@/lib/cn';
import { useNavMenuStore } from '@/stores/nav-menu-store';

import { dockSegmentClasses } from './control-dock';

/**
 * Menú de navegación: la constelación en una tarjeta modal. Lo abre el botón
 * «Menú» del header, en todos los anchos, y desde 1024 px también el aro que
 * cierra la columna de puntos (`RealmNav`). Es el mismo modal, con su estado
 * en `useNavMenuStore`. Por debajo de 460 px, la tarjeta lleva además el acceso
 * a la tienda y al carrito, que en el header no caben.
 *
 * Sustituye a la barra inferior, que había que desplazar para ver los seis
 * nombres, competía con el reproductor por el pie de la pantalla y tapaba
 * contenido. En la tarjeta caben los seis de un vistazo, con su emoción y el
 * realm actual marcado, y cierra la lista «Sobre Marisol» como una entrada más.
 *
 * Igual que la constelación, no aparece en el portal ni en el acceso.
 */
export function RealmMenu() {
  const t = useTranslations('nav');
  const tHeader = useTranslations('header');
  const tStore = useTranslations('store');
  const cartCount = useCartCount();
  const { realmId } = useRealm();
  const pathname = usePathname();
  const open = useNavMenuStore((state) => state.open);
  const openMenu = useNavMenuStore((state) => state.openMenu);
  const closeMenu = useNavMenuStore((state) => state.closeMenu);

  // Cualquier cambio de ruta cierra el menú, también los que no nacen de él.
  useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  if (realmId === 'portal' || realmId === 'auth') return null;

  const storyActive = pathname === NAV_STORY.href;
  // La narrativa del sitio cierra la lista como una entrada más, con su
  // punto en marfil: no es un realm y no toma el acento de ninguno.
  const entries = [
    ...NAV_REALMS.map((realm) => ({
      id: realm.id,
      href: realm.href,
      accent: realm.accent,
      active: !storyActive && realm.id === realmId,
      name: t(`realms.${realm.id}`),
      emotion: t(`emotions.${realm.id}`),
    })),
    {
      id: NAV_STORY.id,
      href: NAV_STORY.href,
      accent: NAV_STORY.accent,
      active: storyActive,
      name: t('story.label'),
      emotion: t('story.emotion'),
    },
  ];

  return (
    <div className="pointer-events-auto">
      <button
        type="button"
        onClick={openMenu}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={tHeader('openMenu')}
        data-magnetic
        className={dockSegmentClasses({ primary: true, className: 'px-3.5 max-md:px-0' })}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M5 8.5h14M5 15.5h9" />
        </svg>
        <span className="max-md:sr-only">{tHeader('menu')}</span>
      </button>

      <Modal
        open={open}
        onClose={closeMenu}
        title={t('label')}
        closeLabel={tHeader('closeMenu')}
        placement="top"
      >
        <nav aria-label={t('label')}>
          <ul className="px-3 py-2">
            {entries.map(({ id, href, accent, active, name, emotion }) => (
              <li key={id} className="border-fg/8 border-b last:border-b-0">
                <Link
                  href={href as '/resonario'}
                  aria-current={active ? 'page' : undefined}
                  onClick={closeMenu}
                  className={cn(
                    'group rounded-field flex min-h-[60px] items-center gap-4 px-3 transition-colors duration-300',
                    active ? 'text-fg' : 'text-fg-body hover:text-fg',
                  )}
                >
                  <span
                    aria-hidden="true"
                    className="size-[9px] flex-none rounded-full"
                    style={{
                      background: accent,
                      boxShadow: active ? `0 0 12px 2px ${accent}` : undefined,
                    }}
                  />
                  <span className="tracking-soft text-serif-lg flex-1 font-serif leading-none">
                    {name}
                  </span>
                  <span className="text-fg-meta text-label tracking-caps font-sans uppercase">
                    {emotion}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          {/* Por debajo de 460px el header no tiene tienda ni carrito: quedan aquí. */}
          <div className="border-line border-t px-3 py-2 min-[460px]:hidden">
            <Link
              href="/tienda/carrito"
              onClick={closeMenu}
              className="rounded-field text-fg-body hover:text-fg flex min-h-[60px] items-center justify-between gap-4 px-3 transition-colors duration-300"
            >
              <span className="tracking-soft text-serif-lg font-serif leading-none">
                {tStore('cart')}
              </span>
              {cartCount > 0 && (
                <span className="text-accent text-meta font-sans">{cartCount}</span>
              )}
            </Link>
          </div>
        </nav>
      </Modal>
    </div>
  );
}
