'use client';

import { useTranslations } from 'next-intl';

import { NAV_REALMS } from '@/config/realms';
import { useRealm } from '@/hooks/use-realm';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/cn';
import type { RealmId } from '@/types/realm';

/**
 * Navegación de constelación.
 *
 * Seis puntos de luz, uno por realm. En desktop el nombre sólo aparece al
 * acercarse —hover o foco de teclado—, de modo que la navegación no compite
 * con el contenido; en la barra inferior de móvil/tablet el nombre queda
 * siempre visible bajo el punto (sin hover fiable, los puntos solos no dicen
 * nada). El `sr-only` mantiene el nombre en el árbol de accesibilidad.
 *
 * En columna lateral desde 1024px; por debajo se convierte en una barra
 * inferior, porque el margen izquierdo deja de existir en tablet y móvil.
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
      className={cn(
        'animate-fm-fade-in fixed z-[210]',
        // Barra inferior en móvil y tablet, above the player dock.
        'inset-x-0 bottom-[calc(84px+env(safe-area-inset-bottom))] flex justify-center gap-1',
        'pb-[max(12px,env(safe-area-inset-bottom))]',
        // Columna lateral centrada desde 1024px.
        'lg:inset-x-auto lg:top-1/2 lg:bottom-auto lg:left-[26px] lg:-translate-y-1/2',
        'lg:flex-col lg:justify-start lg:gap-1 lg:pb-0',
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
              'group relative flex h-11 min-w-11 flex-col items-center justify-center',
              'lg:h-11 lg:min-w-11 lg:flex-row lg:justify-start lg:px-[6px] lg:py-[11px]',
            )}
          >
            {/* El nombre siempre está en el árbol de accesibilidad: el badge
                visual es un refuerzo, no la única forma de conocer el destino. */}
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

            {/* Nombre persistente bajo el punto en la barra inferior: sin
                hover fiable en táctil, los puntos solos no comunican destino. */}
            <span
              aria-hidden="true"
              className="text-ivory/60 aria-[current=page]:text-ivory group-hover:text-ivory group-focus-visible:text-ivory mt-[3px] max-w-[68px] truncate font-sans text-[15px] leading-[1.05] tracking-[.06em] uppercase transition-colors duration-300 lg:hidden"
            >
              {name}
            </span>

            {/* Desktop keeps the constellation point and its destination
                legible without requiring hover to discover the realm. */}
            <span
              aria-hidden="true"
              className="text-ivory/60 aria-[current=page]:text-ivory group-hover:text-ivory group-focus-visible:text-ivory ml-2 hidden font-serif text-[15px] tracking-[.05em] transition-colors duration-300 lg:inline"
            >
              {name}
            </span>

            <span
              aria-hidden="true"
              className={cn(
                'fm-surface-strong pointer-events-none absolute flex items-center gap-[9px] whitespace-nowrap',
                'rounded-pill py-2 pr-[18px] pl-[15px] shadow-[0_10px_30px_rgba(0,0,0,0.4)]',
                'opacity-0 transition-[opacity,transform] duration-300 ease-[cubic-bezier(.2,.85,.25,1)]',
                'group-hover:opacity-100 group-focus-visible:opacity-100',
                // En móvil el badge emerge por encima del punto.
                'bottom-full mb-2 origin-bottom translate-y-[6px] scale-95 group-hover:translate-y-0 group-hover:scale-100 group-focus-visible:translate-y-0 group-focus-visible:scale-100',
                // Desde 1024px se despliega hacia la derecha.
                'lg:bottom-auto lg:left-[30px] lg:mb-0 lg:origin-[left_center] lg:translate-x-[-10px] lg:translate-y-0 lg:scale-x-[.8] lg:scale-y-100',
                'lg:group-hover:translate-x-0 lg:group-hover:scale-x-100 lg:group-focus-visible:translate-x-0 lg:group-focus-visible:scale-x-100',
              )}
            >
              <span
                className="h-[6px] w-[6px] flex-none rounded-full"
                style={{ background: realm.accent, boxShadow: `0 0 8px 1px ${realm.accent}` }}
              />
              <span className="text-ivory font-serif text-[16px] tracking-[.05em]">{name}</span>
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
