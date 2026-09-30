'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';

import { NAV_REALMS } from '@/config/realms';
import { useRealm } from '@/hooks/use-realm';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/cn';
import type { RealmId } from '@/types/realm';

/**
 * Navegación de constelación.
 *
 * Seis puntos de luz, uno por realm. En desktop (≥1024px) es una columna
 * lateral de puntos: el nombre sólo aparece al acercarse —hover o foco de
 * teclado—, de modo que la navegación no compite con el contenido ni se
 * superpone a los textos que arrancan en el eje de página (`--page-inset`).
 * El `sr-only` mantiene el nombre en el árbol de accesibilidad.
 *
 * Por debajo de 1024px pasa a una barra inferior de vidrio con los seis
 * nombres siempre visibles (sin hover fiable, los puntos solos no dicen
 * nada). Seis nombres completos no caben en 390px, así que la barra se
 * desplaza en horizontal —nunca trunca— y centra el realm actual.
 *
 * No se muestra en el portal ni en acceso: ambas son pantallas de umbral y
 * la constelación aún no se ha revelado.
 */
export function RealmNav() {
  const t = useTranslations('nav');
  const { realmId } = useRealm();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const hidden = realmId === 'portal' || realmId === 'auth';

  // Centra el realm actual en la barra desplazable (sólo afecta a <1024px,
  // donde el contenedor desborda; en desktop no hay scroll y es un no-op).
  useEffect(() => {
    const scroller = scrollerRef.current;
    const current = scroller?.querySelector<HTMLElement>('[aria-current="page"]');

    if (!scroller || !current) return;

    scroller.scrollLeft = current.offsetLeft - (scroller.clientWidth - current.clientWidth) / 2;
  }, [realmId, hidden]);

  if (hidden) return null;

  return (
    <nav
      aria-label={t('label')}
      className={cn(
        'animate-fm-fade-in fixed z-[210]',
        // Barra inferior en móvil y tablet, sobre el dock del reproductor.
        'inset-x-3 bottom-[calc(84px+env(safe-area-inset-bottom))] flex justify-center',
        'pb-[max(0px,env(safe-area-inset-bottom))]',
        // Columna lateral centrada desde 1024px.
        'lg:inset-x-auto lg:top-1/2 lg:bottom-auto lg:left-[26px] lg:block lg:-translate-y-1/2 lg:pb-0',
      )}
    >
      <div className="rounded-pill max-lg:fm-surface-strong max-w-full min-w-0 lg:rounded-none">
        <div
          ref={scrollerRef}
          className={cn(
            'flex [scrollbar-width:none] items-center gap-1 px-2 [&::-webkit-scrollbar]:hidden',
            'max-lg:overflow-x-auto max-lg:[mask-image:linear-gradient(90deg,transparent,#000_16px,#000_calc(100%-16px),transparent)]',
            'lg:flex-col lg:items-stretch lg:gap-1 lg:px-0',
          )}
        >
          {NAV_REALMS.map((realm) => {
            const active = realm.id === realmId;
            const name = t(`realms.${realm.id as RealmId}` as 'realms.biblioteca');

            return (
              <Link
                key={realm.id}
                href={realm.href as '/biblioteca'}
                data-magnetic
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'group relative flex h-11 min-w-11 shrink-0 flex-col items-center justify-center px-3',
                  'lg:h-11 lg:flex-row lg:justify-start lg:px-[6px] lg:py-[11px]',
                )}
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

                {/* Nombre persistente bajo el punto en la barra inferior:
                    sin hover fiable en táctil, los puntos solos no comunican
                    destino. Nunca se trunca: la barra se desplaza. */}
                <span
                  aria-hidden="true"
                  className="text-fg-muted group-aria-[current=page]:text-ivory group-hover:text-ivory group-focus-visible:text-ivory text-body tracking-soft mt-[3px] font-sans leading-[1.05] whitespace-nowrap uppercase transition-colors duration-300 lg:hidden"
                >
                  {name}
                </span>

                <span
                  aria-hidden="true"
                  className={cn(
                    'fm-surface-strong pointer-events-none absolute hidden items-center gap-[9px] whitespace-nowrap lg:flex',
                    'rounded-pill py-2 pr-[18px] pl-[15px] shadow-[0_10px_30px_rgba(0,0,0,0.4)]',
                    'opacity-0 transition-[opacity,transform] duration-300 ease-[cubic-bezier(.2,.85,.25,1)]',
                    'group-hover:opacity-100 group-focus-visible:opacity-100',
                    // Desde 1024px se despliega hacia la derecha.
                    'lg:top-1/2 lg:left-[30px] lg:origin-[left_center] lg:translate-x-[-10px] lg:-translate-y-1/2 lg:scale-x-[.8]',
                    'lg:group-hover:translate-x-0 lg:group-hover:scale-x-100 lg:group-focus-visible:translate-x-0 lg:group-focus-visible:scale-x-100',
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
      </div>
    </nav>
  );
}
