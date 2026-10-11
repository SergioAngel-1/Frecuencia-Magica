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
 * realm actual marcado, y cierra la lista «Sobre Marisol» como una entrada más.
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

  const storyActive = pathname === NAV_STORY.href;
  // La narrativa del sitio cierra la lista como una entrada más, con su
  // punto en marfil: no es un realm y no toma el acento de ninguno.
  const entries = [
    ...NAV_REALMS.map((realm) => ({
      id: realm.id,
      href: realm.href,
      accent: realm.accent,
      active: !storyActive && realm.id === realmId,
      name: t(`realms.${realm.id as RealmId}` as 'realms.resonario'),
      emotion: t(`emotions.${realm.id as RealmId}` as 'emotions.resonario'),
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
            {entries.map(({ id, href, accent, active, name, emotion }) => (
              <li key={id} className="border-ivory/8 border-b last:border-b-0">
                <Link
                  href={href as '/resonario'}
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
                      background: accent,
                      boxShadow: active ? `0 0 12px 2px ${accent}` : undefined,
                    }}
                  />
                  <span className="tracking-soft flex-1 font-serif text-[22px] leading-none">
                    {name}
                  </span>
                  <span className="text-fg-meta text-label tracking-caps font-sans uppercase">
                    {emotion}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Modal>
    </div>
  );
}
