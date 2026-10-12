'use client';

import { useTranslations } from 'next-intl';

import { NAV_REALMS, NAV_STORY } from '@/config/navigation';
import { useRealm } from '@/hooks/use-realm';
import { Link, usePathname } from '@/i18n/navigation';
import { cn } from '@/lib/cn';
import { useNavMenuStore } from '@/stores/nav-menu-store';
import type { RealmId } from '@/types/realm';

/**
 * Navegación de constelación, desde 1024px.
 *
 * Seis puntos de luz, uno por realm, y uno en marfil para la narrativa del
 * sitio («Sobre Marisol»), en una columna lateral: el nombre sólo
 * aparece al acercarse —hover o foco de teclado—, de modo que la navegación
 * no compite con el contenido ni se superpone a los textos que arrancan en el
 * eje de página (`--page-inset`). El `sr-only` mantiene el nombre en el árbol
 * de accesibilidad.
 *
 * Por debajo de 1024px no hay hover fiable y los puntos solos no dicen nada:
 * ahí la constelación vive en `RealmMenu`, el menú del header.
 *
 * No se muestra en el portal ni en acceso: ambas son pantallas de umbral y
 * la constelación aún no se ha revelado.
 */
export function RealmNav() {
  const t = useTranslations('nav');
  const tHeader = useTranslations('header');
  const menuOpen = useNavMenuStore((state) => state.open);
  const openMenu = useNavMenuStore((state) => state.openMenu);
  const { realmId } = useRealm();
  const pathname = usePathname();
  const storyActive = pathname === NAV_STORY.href;

  if (realmId === 'portal' || realmId === 'auth') return null;

  const entries = [
    ...NAV_REALMS.map((realm) => ({
      id: realm.id,
      href: realm.href,
      accent: realm.accent,
      active: !storyActive && realm.id === realmId,
      name: t(`realms.${realm.id as RealmId}` as 'realms.resonario'),
    })),
    // La narrativa del sitio cierra la constelación, en marfil y un poco aparte.
    {
      id: NAV_STORY.id,
      href: NAV_STORY.href,
      accent: NAV_STORY.accent,
      active: storyActive,
      name: t('story.label'),
    },
  ];

  return (
    <nav
      aria-label={t('label')}
      className="animate-fm-fade-in z-nav fixed top-1/2 left-[26px] hidden -translate-y-1/2 lg:block"
    >
      <div className="flex flex-col items-stretch gap-1">
        {entries.map(({ id, href, accent, active, name }) => {
          return (
            <Link
              key={id}
              href={href as '/resonario'}
              data-magnetic
              aria-current={active ? 'page' : undefined}
              className={cn(
                'group relative flex h-11 items-center px-[6px]',
                id === NAV_STORY.id && 'mt-2',
              )}
            >
              {/* El nombre siempre está en el árbol de accesibilidad: el
                    badge visual es un refuerzo, no la única forma de conocer
                    el destino. */}
              <span className="sr-only">{name}</span>

              <span
                aria-hidden="true"
                className={cn(
                  'size-3 flex-none rounded-full transition-[transform,opacity] duration-300',
                  'group-hover:scale-[1.35] group-hover:opacity-100 group-focus-visible:scale-[1.35] group-focus-visible:opacity-100',
                  !active && 'opacity-60',
                )}
                style={{
                  background: accent,
                  boxShadow: active ? `0 0 12px 2px ${accent}` : undefined,
                }}
              />

              <span
                aria-hidden="true"
                className={cn(
                  'fm-surface-strong pointer-events-none absolute flex items-center gap-[9px] whitespace-nowrap',
                  'rounded-pill shadow-glow-card py-2 pr-[18px] pl-[15px]',
                  'opacity-0 transition-[opacity,transform] duration-300 ease-[cubic-bezier(.2,.85,.25,1)]',
                  'group-hover:opacity-100 group-focus-visible:opacity-100',
                  // Se despliega hacia la derecha del punto.
                  'top-1/2 left-[34px] origin-[left_center] translate-x-[-10px] -translate-y-1/2 scale-x-[.8]',
                  'group-hover:translate-x-0 group-hover:scale-x-100 group-focus-visible:translate-x-0 group-focus-visible:scale-x-100',
                )}
              >
                <span
                  className="h-[6px] w-[6px] flex-none rounded-full"
                  style={{ background: accent, boxShadow: `0 0 8px 1px ${accent}` }}
                />
                <span className="text-ivory tracking-soft font-serif text-[16px]">{name}</span>
              </span>
            </Link>
          );
        })}

        {/* Cierra la columna: no es un destino sino la llave del menú (el
            mismo modal del header en móvil). Un aro hueco con núcleo de oro,
            para que no se confunda con los puntos de los realms. */}
        <button
          type="button"
          onClick={openMenu}
          aria-haspopup="dialog"
          aria-expanded={menuOpen}
          aria-label={tHeader('openMenu')}
          data-magnetic
          className="group relative mt-3 flex h-11 items-center px-[3px]"
        >
          <span
            aria-hidden="true"
            className="border-ivory/55 group-hover:border-gold group-focus-visible:border-gold flex size-[18px] flex-none items-center justify-center rounded-full border transition-[transform,border-color] duration-300 group-hover:scale-[1.15] group-focus-visible:scale-[1.15]"
          >
            <span className="bg-gold size-[5px] rounded-full" />
          </span>
          <span
            aria-hidden="true"
            className={cn(
              'fm-surface-strong pointer-events-none absolute flex items-center gap-[9px] whitespace-nowrap',
              'rounded-pill shadow-glow-card py-2 pr-[18px] pl-[15px]',
              'opacity-0 transition-[opacity,transform] duration-300 ease-[cubic-bezier(.2,.85,.25,1)]',
              'group-hover:opacity-100 group-focus-visible:opacity-100',
              'top-1/2 left-[34px] origin-[left_center] translate-x-[-10px] -translate-y-1/2 scale-x-[.8]',
              'group-hover:translate-x-0 group-hover:scale-x-100 group-focus-visible:translate-x-0 group-focus-visible:scale-x-100',
            )}
          >
            <span className="text-fg-meta text-label tracking-caps font-sans uppercase">
              {t('menu')}
            </span>
          </span>
        </button>
      </div>
    </nav>
  );
}
