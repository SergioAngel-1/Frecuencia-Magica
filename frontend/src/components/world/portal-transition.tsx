'use client';

import { useTranslations } from 'next-intl';
import { div as Mdiv } from 'motion/react-m';
import { useEffect, useRef, useState, type CSSProperties } from 'react';

import { cssEase, EASE, PORTAL_TIMING } from '@/config/motion';
import { useAtmosphere } from '@/hooks/use-atmosphere';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { usePathname } from '@/i18n/navigation';
import { portalThemeFor } from '@/lib/portal/theme';
import { useAtmosphereStore } from '@/stores/atmosphere-store';
import { usePortalStore } from '@/stores/portal-store';
import type { AtmosphereId } from '@/types/atmosphere';

/** Fracción de `cover` en la que la onda y el iris nacen de la luz ya reunida. */
const IRIS_DELAY = 0.12;
/**
 * Tramo de `cover` en el que el tema de destino se asienta tras el iris.
 * Termina antes que el iris y éste no se retira hasta la revelación: en el
 * relevo siempre hay una capa opaca y la vista anterior no puede traslucirse.
 */
const COVER_FROM = 0.5;
const COVER_TO = 0.85;

const ms = (value: number) => `${Math.round(value)}ms`;

/**
 * Overlay del cruce de portal: se cruza un umbral de luz y se llega al tema de
 * destino.
 *
 * - `in`: la luz se reúne en el centro, una onda se adelanta y el iris —un
 *   disco del tema de destino con el borde encendido— se abre hasta que el aro
 *   sale de pantalla. El tema se asienta detrás y la luz queda como un punto.
 * - `hold`: tema y punto de luz, hasta que el destino llega.
 * - `out`: el tema se disuelve sobre el destino y el punto se abre con él.
 *
 * La luz es siempre un halo o un filo, nunca un relleno: lo que cubre la
 * pantalla es el mismo fondo del tema que se verá al llegar, de modo que la
 * revelación no deja lavado. El tema se fija al entrar en `in` (el de la ruta
 * de destino o, si no se conoce, el visible) y no se recalcula en cada render:
 * así el cruce no cambia de color cuando la ruta ya ha llegado. Sólo se animan
 * `transform` y `opacity`.
 *
 * El iris se abre en todos los cruces (`full` y `brief` sólo cambian de
 * ritmo). En modo `quick` (movimiento reducido) sólo hay tema que funde. El
 * tema funde con Motion y no con keyframes: el modo simplificado anula las
 * animaciones CSS, pero un fundido de opacidad sí debe verse.
 */
export function PortalTransition() {
  const phase = usePortalStore((state) => state.phase);
  const mode = usePortalStore((state) => state.mode);
  const destination = usePortalStore((state) => state.destination);
  const arrive = usePortalStore((state) => state.arrive);
  const reduced = useReducedMotionSafe();
  const { atmosphereId: visibleTheme } = useAtmosphere();
  const [theme, setTheme] = useState<AtmosphereId | null>(null);
  const pathname = usePathname();
  const lastPathname = useRef(pathname);

  // El destino ha llegado cuando la ruta consumada cambia.
  useEffect(() => {
    if (lastPathname.current === pathname) return;

    lastPathname.current = pathname;
    arrive();
  }, [pathname, arrive]);

  // El tema se resuelve una vez, al empezar a cubrir; en `hold`/`out` se
  // conserva aunque la ruta ya haya cambiado.
  useEffect(() => {
    if (phase === 'in') {
      setTheme(portalThemeFor(destination, visibleTheme, useAtmosphereStore.getState().choice));
    } else if (phase === 'idle') {
      setTheme(null);
    }
  }, [phase, destination, visibleTheme]);

  if (phase === 'idle') return null;

  const activeTheme = theme ?? visibleTheme;
  const { cover, reveal } = PORTAL_TIMING[mode];
  const iris = mode !== 'quick' && !reduced;
  const covering = phase !== 'out';
  const coverFrom = iris ? cover * COVER_FROM : 0;
  const coverTo = iris ? cover * COVER_TO : cover;

  return (
    <div
      aria-hidden="true"
      data-atmosphere={activeTheme}
      className="z-portal fixed inset-0 overflow-hidden"
    >
      {iris && covering ? (
        <>
          <span
            className="fm-portal-ripple"
            style={{
              animation: `fm-portal-ripple ${ms(cover * 0.8)} ${cssEase(EASE.ripple)} ${ms(cover * IRIS_DELAY)} both`,
            }}
          />
          <span
            className="fm-portal-iris"
            style={{
              animation: `fm-portal-iris ${ms(cover * (1 - IRIS_DELAY))} ${cssEase(EASE.portal)} ${ms(cover * IRIS_DELAY)} both`,
            }}
          />
        </>
      ) : null}

      <Mdiv
        className="fm-portal-night absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: covering ? 1 : 0 }}
        transition={
          covering
            ? { duration: (coverTo - coverFrom) / 1000, delay: coverFrom / 1000, ease: 'easeIn' }
            : { duration: reveal / 1000, ease: EASE.soft }
        }
      />

      {reduced ? null : (
        <span className="fm-portal-light" style={lightMotion(phase, iris, cover, reveal)} />
      )}
    </div>
  );
}

/** Animación del punto de luz según la fase; entre fases empalma en el mismo estado. */
function lightMotion(phase: string, iris: boolean, cover: number, reveal: number): CSSProperties {
  if (phase === 'in') {
    return {
      animation: iris
        ? `fm-portal-light-gather ${ms(cover)} ${cssEase(EASE.soft)} both`
        : `fm-portal-light-appear ${ms(cover)} ${cssEase(EASE.soft)} both`,
    };
  }

  if (phase === 'out') {
    return { animation: `fm-portal-light-open ${ms(reveal * 0.8)} ${cssEase(EASE.soft)} both` };
  }

  // Sólo late si la espera se alarga: es también el indicador de carga.
  return { animation: 'fm-portal-light-wait 2.6s ease-in-out 0.5s infinite' };
}

/**
 * Anuncia el cruce a los lectores de pantalla. Vive fuera del overlay
 * `aria-hidden` para que sí se lea.
 */
export function PortalAnnouncer() {
  const t = useTranslations('portal');
  const tDiscover = useTranslations('discover');
  const phase = usePortalStore((state) => state.phase);
  const reason = usePortalStore((state) => state.reason);
  const label = reason === 'reveal' ? tDiscover('revealing') : t('crossing');

  return (
    <div role="status" aria-live="polite" className="sr-only">
      {phase === 'in' || phase === 'hold' ? label : ''}
    </div>
  );
}
