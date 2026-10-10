'use client';

import { getImageProps } from 'next/image';
import { useTranslations } from 'next-intl';
import { AnimatePresence } from 'motion/react';
import { div as Mdiv } from 'motion/react-m';
import { useEffect, useRef, useState, type ReactNode } from 'react';

import { DURATION, EASE, ROUTE_WAIT_DELAY_MS } from '@/config/motion';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { usePathname } from '@/i18n/navigation';
import { resolveEditorialMedia } from '@/lib/editorial/asset-registry';
import { mediaSizes } from '@/lib/editorial/media-sizes';
import { usePortalStore } from '@/stores/portal-store';

import { LoadingScene } from './loading-scene';

/** Un clic que no navega en esta pestaña (otra pestaña, descarga, modificador). */
function opensElsewhere(event: MouseEvent, anchor: HTMLAnchorElement): boolean {
  return (
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey ||
    (anchor.target !== '' && anchor.target !== '_self') ||
    anchor.hasAttribute('download')
  );
}

/**
 * Fundido entre realms y espera durante el intercambio.
 *
 * Sólo opacidad, sin desplazamiento: el prototipo cruza de un mundo a otro
 * sin mover la cámara, y añadir un `translateY` rompería la continuidad
 * espacial. El desplazamiento se reserva para las entradas escalonadas
 * dentro de cada vista.
 *
 * La espera hace falta porque `usePathname` sólo cambia cuando la vista nueva
 * ya está lista y, con páginas estáticas, ningún `loading.tsx` llega a verse
 * al navegar: la vista anterior queda congelada sin indicador. Un listener de
 * clics en fase de captura detecta el inicio de la navegación (enlaces
 * internos) y el cambio de ruta la da por terminada. La espera es la misma
 * escena que la de una carga directa (`LoadingScene`, la esfera de
 * `states.loading`), sólo aparece si la navegación tarda más de
 * `ROUTE_WAIT_DELAY_MS` y entra y sale con fundido. Una navegación
 * programática (`router.push`) no tiene clic que la anuncie: su vista entra
 * con el fundido normal. El cruce del portal tiene su propia coreografía a
 * pantalla completa y no la necesita.
 */
export function RouteTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const t = useTranslations('states');
  const reducedMotion = useReducedMotionSafe();
  const portalPhase = usePortalStore((s) => s.phase);
  // Navegación pendiente: del clic en un enlace interno al cambio de ruta.
  const [pending, setPending] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const prevPathname = useRef(pathname);
  // Siempre con la ruta actual: el listener de clics la compara con el
  // destino sin volver a suscribirse. Se escribe en un efecto, no durante el
  // render (un render descartado dejaría aquí una ruta que nunca se pintó).
  const pathnameRef = useRef(pathname);
  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);
  const portalBusy = portalPhase !== 'idle';
  const loadingMedia = resolveEditorialMedia('states.loading', {
    alt: t('media.alt.loading'),
  });

  // Inicio de navegación: un clic en un enlace interno marca la espera ANTES
  // de que el router consuma la ruta (el commit llega cuando la vista nueva
  // ya está lista).
  useEffect(() => {
    const onCaptureClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest?.('a[href]');
      if (!(anchor instanceof HTMLAnchorElement) || opensElsewhere(event, anchor)) return;

      const href = anchor.getAttribute('href') ?? '';
      if (!href.startsWith('/') || href.startsWith('//')) return;

      const current = (pathnameRef.current || '/').replace(/\/+$/, '') || '/';
      const target = anchor.pathname.replace(/\/+$/, '') || '/';
      if (target === current) return; // mismo destino: no hay intercambio

      setPending(true);
    };

    document.addEventListener('click', onCaptureClick, true);
    return () => document.removeEventListener('click', onCaptureClick, true);
  }, []);

  // Commit de ruta: la vista nueva ya está lista. La espera se retira con su
  // fundido y la vista entra con el suyo; taparla mientras entra sólo la
  // retrasaría. Se omite el primer render.
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      setPending(false);
    }
  }, [pathname]);

  // La escena sólo aparece si la navegación se alarga; una vista precargada
  // llega antes y no hay nada que tapar.
  useEffect(() => {
    if (!pending || portalBusy) {
      setWaiting(false);
      return;
    }
    const timer = window.setTimeout(() => setWaiting(true), ROUTE_WAIT_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [pending, portalBusy]);

  // La esfera de la espera se descarga en cuanto el navegador queda libre:
  // la espera sólo se ve con la red lenta, justo cuando una imagen pedida en
  // ese momento ya no llegaría a tiempo. Misma variante que pedirá la escena.
  const loadingSrc = loadingMedia.src;
  const loadingAspect = loadingMedia.aspect;
  useEffect(() => {
    if (!loadingSrc) return;
    const { props } = getImageProps({
      src: loadingSrc,
      alt: '',
      fill: true,
      sizes: mediaSizes('viewport', loadingAspect),
    });
    const warm = () => {
      const image = new Image();
      if (props.sizes) image.sizes = props.sizes;
      if (props.srcSet) image.srcset = props.srcSet;
      image.src = props.src;
    };
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(warm, { timeout: 4000 });
      return () => window.cancelIdleCallback(id);
    }
    const timer = window.setTimeout(warm, 2000);
    return () => window.clearTimeout(timer);
  }, [loadingSrc, loadingAspect]);

  // Bajo el velo del portal el intercambio es inmediato: un fundido propio
  // se sumaría al del velo y la llegada se vería lavada.
  const enter = reducedMotion || portalBusy ? 0 : DURATION.base;
  const exit = reducedMotion || portalBusy ? 0 : DURATION.fast;
  const waitFade = reducedMotion ? 0 : DURATION.fast;

  return (
    <>
      {reducedMotion ? (
        children
      ) : (
        <AnimatePresence mode="wait" initial={false}>
          <Mdiv
            key={pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: enter, ease: EASE.soft } }}
            exit={{ opacity: 0, transition: { duration: exit, ease: EASE.soft } }}
            className="relative"
          >
            {children}
          </Mdiv>
        </AnimatePresence>
      )}

      <AnimatePresence>
        {waiting ? (
          <Mdiv
            key="route-wait"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: waitFade, ease: EASE.soft } }}
            exit={{ opacity: 0, transition: { duration: waitFade, ease: EASE.soft } }}
            className="z-veil pointer-events-none fixed inset-0 overflow-hidden"
            style={{ background: 'var(--fm-night)' }}
          >
            <LoadingScene media={loadingMedia} label={t('loading')} />
          </Mdiv>
        ) : null}
      </AnimatePresence>
    </>
  );
}
