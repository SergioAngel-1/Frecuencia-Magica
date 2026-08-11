'use client';

import { useTranslations } from 'next-intl';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useState, type ReactNode } from 'react';

import { LoadingOrb } from '@/components/ui';
import { DURATION, EASE } from '@/config/motion';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { usePathname } from '@/i18n/navigation';
import { usePortalStore } from '@/stores/portal-store';

/**
 * Fundido entre realms + orbe de carga durante el intercambio.
 *
 * Sólo opacidad, sin desplazamiento: el prototipo cruza de un mundo a otro
 * sin mover la cámara, y añadir un `translateY` rompería la continuidad
 * espacial. El desplazamiento se reserva para las entradas escalonadas
 * dentro de cada vista.
 *
 * El orbe es necesario porque `usePathname` sólo cambia cuando la vista
 * nueva ya está lista: mientras el payload viaja, la vista anterior queda
 * visible y congelada sin ningún indicador. Un listener de clics en fase de
 * captura detecta el inicio de la navegación (enlaces internos) y enciende
 * el orbe desde ese momento; el cambio de ruta consumado lo garantiza para
 * las navegaciones programáticas. El cruce del portal tiene su propia
 * coreografía a pantalla completa y no necesita el orbe.
 */
export function RouteTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const t = useTranslations('states');
  const reducedMotion = useReducedMotionSafe();
  const portalPhase = usePortalStore((s) => s.phase);
  const [exchanging, setExchanging] = useState(false);
  const prevPathname = useRef(pathname);
  // Siempre con la ruta actual (se escribe en cada render): sirve para
  // distinguir la entrada de la vista actual de la salida de la anterior.
  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;

  // Inicio de navegación: los clics en enlaces internos encienden el orbe
  // ANTES de que el router consuma la ruta (el commit llega tarde).
  useEffect(() => {
    const onCaptureClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest?.('a[href]');
      if (!anchor) return;

      const href = anchor.getAttribute('href') ?? '';
      if (!href.startsWith('/') || href.startsWith('//')) return;

      const current = (pathnameRef.current || '/').replace(/\/+$/, '') || '/';
      const target = (anchor as HTMLAnchorElement).pathname.replace(/\/+$/, '') || '/';
      if (target === current) return; // mismo destino: no hay intercambio

      setExchanging(true);
    };

    document.addEventListener('click', onCaptureClick, true);
    return () => document.removeEventListener('click', onCaptureClick, true);
  }, []);

  // Commit de ruta: garantiza el orbe en navegaciones programáticas
  // (router.push sin clic en enlace). Se omite el primer render.
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      setExchanging(true);
    }
  }, [pathname]);

  if (reducedMotion) return <>{children}</>;

  const portalBusy = portalPhase !== 'idle';

  return (
    <>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: DURATION.base, ease: EASE.soft } }}
          exit={{ opacity: 0, transition: { duration: DURATION.fast, ease: EASE.soft } }}
          onAnimationComplete={() => {
            // El callback también lo dispara la salida de la vista anterior;
            // sólo la entrada de la vista actual apaga el orbe.
            if (pathnameRef.current === pathname) setExchanging(false);
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>

      {exchanging && !portalBusy ? (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[9500] flex items-center justify-center bg-[rgba(10,18,32,0.4)] backdrop-blur-[14px]"
        >
          <LoadingOrb size={110} label={t('loading')} />
        </div>
      ) : null}
    </>
  );
}
