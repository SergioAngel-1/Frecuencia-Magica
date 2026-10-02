'use client';

import { useTranslations } from 'next-intl';
import { div as Mdiv } from 'motion/react-m';
import { useEffect, useRef, type CSSProperties } from 'react';

import { cssEase, EASE, PORTAL_TIMING } from '@/config/motion';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { usePathname } from '@/i18n/navigation';
import { usePortalStore } from '@/stores/portal-store';

/** Fracción de `cover` en la que la onda y el iris nacen de la luz ya reunida. */
const IRIS_DELAY = 0.12;
/**
 * Tramo de `cover` en el que la noche se asienta tras el iris. Termina antes
 * que el iris y éste no se retira hasta la revelación: en el relevo siempre
 * hay una capa opaca y la vista anterior no puede traslucirse.
 */
const NIGHT_FROM = 0.5;
const NIGHT_TO = 0.85;

const ms = (value: number) => `${Math.round(value)}ms`;

/**
 * Overlay del cruce de portal: se cruza un umbral de luz y se llega a la noche.
 *
 * - `in`: la luz se reúne en el centro, una onda se adelanta y el iris —un
 *   disco de noche con el borde encendido— se abre hasta que el aro sale de
 *   pantalla. La noche se asienta detrás y la luz queda como un punto.
 * - `hold`: noche y punto de luz, hasta que el destino llega.
 * - `out`: la noche se disuelve sobre el destino y el punto se abre con ella.
 *
 * La luz es siempre un halo o un filo, nunca un relleno: lo que cubre la
 * pantalla es la misma noche del fondo de la app, de modo que la revelación
 * no deja lavado. Sólo se animan `transform` y `opacity`.
 *
 * En modo `quick` (cruce reciente o movimiento reducido) sólo hay noche y
 * punto de luz. La noche funde con Motion y no con keyframes: el modo
 * simplificado anula las animaciones CSS, pero un fundido de opacidad sí debe
 * verse.
 */
export function PortalTransition() {
  const phase = usePortalStore((state) => state.phase);
  const mode = usePortalStore((state) => state.mode);
  const arrive = usePortalStore((state) => state.arrive);
  const reduced = useReducedMotionSafe();
  const pathname = usePathname();
  const lastPathname = useRef(pathname);

  // El destino ha llegado cuando la ruta consumada cambia.
  useEffect(() => {
    if (lastPathname.current === pathname) return;

    lastPathname.current = pathname;
    arrive();
  }, [pathname, arrive]);

  if (phase === 'idle') return null;

  const { cover, reveal } = PORTAL_TIMING[mode];
  const iris = mode === 'full' && !reduced;
  const covering = phase !== 'out';
  const nightFrom = iris ? cover * NIGHT_FROM : 0;
  const nightTo = iris ? cover * NIGHT_TO : cover;

  return (
    <div aria-hidden="true" className="z-portal fixed inset-0 overflow-hidden">
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
            ? { duration: (nightTo - nightFrom) / 1000, delay: nightFrom / 1000, ease: 'easeIn' }
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
  const phase = usePortalStore((state) => state.phase);

  return (
    <div role="status" aria-live="polite" className="sr-only">
      {phase === 'in' || phase === 'hold' ? t('crossing') : ''}
    </div>
  );
}
