'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

import { IconButton, Modal } from '@/components/ui';
import { NAV_REALMS, NAV_STORY } from '@/config/navigation';
import { useRealm } from '@/hooks/use-realm';
import { Link, usePathname } from '@/i18n/navigation';
import { cn } from '@/lib/cn';
import { useNavMenuStore } from '@/stores/nav-menu-store';
import type { RealmId } from '@/types/realm';

/**
 * Menú de navegación: la constelación en una tarjeta modal. Por debajo de
 * 1024 px lo abre un botón del header; desde ahí, el aro que cierra la
 * columna de puntos (`RealmNav`). Es el mismo modal, con su estado en
 * `useNavMenuStore`.
 *
 * Sustituye a la barra inferior, que había que desplazar para ver los seis
 * nombres, competía con el reproductor por el pie de la pantalla y tapaba
 * contenido. En la tarjeta caben los seis de un vistazo, con su emoción y el
 * realm actual marcado.
 *
 * Igual que la constelación, no aparece en el portal ni en el acceso.
 */
export function RealmMenu() {
  const t = useTranslations('nav');
  const tHeader = useTranslations('header');
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

  return (
    <div className="pointer-events-auto">
      {/* El botón sólo existe por debajo de 1024 px; desde ahí abre el mismo
          menú el aro de la constelación (`RealmNav`). El modal, en todos. */}
      <IconButton
        label={tHeader('openMenu')}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={openMenu}
        className="lg:hidden"
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
      </IconButton>

      <Modal
        open={open}
        onClose={closeMenu}
        title={t('label')}
        closeLabel={tHeader('closeMenu')}
        placement="top"
      >
        <nav aria-label={t('label')}>
          <ul className="px-3 py-2">
            {NAV_REALMS.map((realm) => {
              const active = realm.id === realmId && pathname !== NAV_STORY.href;

              return (
                <li key={realm.id} className="border-ivory/8 border-b last:border-b-0">
                  <Link
                    href={realm.href as '/resonario'}
                    aria-current={active ? 'page' : undefined}
                    onClick={closeMenu}
                    className={cn(
                      'group rounded-field flex min-h-[60px] items-center gap-4 px-3 transition-colors duration-300',
                      active ? 'text-ivory' : 'text-fg-body hover:text-ivory',
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className="size-[9px] flex-none rounded-full"
                      style={{
                        background: realm.accent,
                        boxShadow: active ? `0 0 12px 2px ${realm.accent}` : undefined,
                      }}
                    />
                    <span className="tracking-soft flex-1 font-serif text-[22px] leading-none">
                      {t(`realms.${realm.id as RealmId}` as 'realms.resonario')}
                    </span>
                    <span className="text-fg-meta text-label tracking-caps font-sans uppercase">
                      {t(`emotions.${realm.id as RealmId}` as 'emotions.resonario')}
                    </span>
                  </Link>
                </li>
              );
            })}
            {/* La narrativa del sitio, aparte de los realms: no es un lugar
                al que se entra, sino quién hay detrás. */}
            <li className="border-ivory/15 mt-2 border-t pt-2">
              <Link
                href={NAV_STORY.href}
                aria-current={pathname === NAV_STORY.href ? 'page' : undefined}
                onClick={closeMenu}
                className={cn(
                  'group rounded-field flex min-h-[60px] items-center gap-4 px-3 transition-colors duration-300',
                  pathname === NAV_STORY.href ? 'text-ivory' : 'text-fg-body hover:text-ivory',
                )}
              >
                <span
                  aria-hidden="true"
                  className="size-[9px] flex-none rounded-full border"
                  style={{ borderColor: NAV_STORY.accent }}
                />
                <span className="tracking-soft flex-1 font-serif text-[22px] leading-none italic">
                  {t('story.label')}
                </span>
                <span className="text-fg-meta text-label tracking-caps font-sans uppercase">
                  {t('story.emotion')}
                </span>
              </Link>
            </li>
          </ul>
        </nav>
      </Modal>
    </div>
  );
}
