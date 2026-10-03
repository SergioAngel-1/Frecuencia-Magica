'use client';

import { useTranslations } from 'next-intl';

import { NAV_REALMS } from '@/config/realms';
import { useRealm } from '@/hooks/use-realm';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/cn';
import type { RealmId } from '@/types/realm';

/**
 * Navegación de constelación, desde 1024px.
 *
 * Seis puntos de luz, uno por realm, en una columna lateral: el nombre sólo
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
  const { realmId } = useRealm();

  if (realmId === 'portal' || realmId === 'auth') return null;

  return (
    <nav
      aria-label={t('label')}
      className="animate-fm-fade-in z-nav fixed top-1/2 left-[26px] hidden -translate-y-1/2 lg:block"
    >
      <div className="flex flex-col items-stretch gap-1">
        {NAV_REALMS.map((realm) => {
          const active = realm.id === realmId;
          const name = t(`realms.${realm.id as RealmId}` as 'realms.resonario');

          return (
            <Link
              key={realm.id}
              href={realm.href as '/resonario'}
              data-magnetic
              aria-current={active ? 'page' : undefined}
              className="group relative flex h-11 items-center px-[6px]"
            >
              {/* El nombre siempre está en el árbol de accesibilidad: el
                    badge visual es un refuerzo, no la única forma de conocer
                    el destino. */}
              <span className="sr-only">{name}</span>

              <span
                aria-hidden="true"
                className={cn(
                  'h-[9px] w-[9px] flex-none rounded-full transition-[transform,opacity] duration-300',
                  'group-hover:scale-[1.35] group-hover:opacity-100 group-focus-visible:scale-[1.35] group-focus-visible:opacity-100',
                  !active && 'opacity-60',
                )}
                style={{
                  background: realm.accent,
                  boxShadow: active ? `0 0 12px 2px ${realm.accent}` : undefined,
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
                  'top-1/2 left-[30px] origin-[left_center] translate-x-[-10px] -translate-y-1/2 scale-x-[.8]',
                  'group-hover:translate-x-0 group-hover:scale-x-100 group-focus-visible:translate-x-0 group-focus-visible:scale-x-100',
                )}
              >
                <span
                  className="h-[6px] w-[6px] flex-none rounded-full"
                  style={{ background: realm.accent, boxShadow: `0 0 8px 1px ${realm.accent}` }}
                />
                <span className="text-ivory tracking-soft font-serif text-[16px]">{name}</span>
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
