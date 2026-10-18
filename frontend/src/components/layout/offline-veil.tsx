'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { getImageProps } from 'next/image';
import { useTranslations } from 'next-intl';
import { AnimatePresence } from 'motion/react';
import { div as Mdiv } from 'motion/react-m';

import { Button, Display, FullBleedSection, Kicker } from '@/components/ui';
import { DURATION, EASE } from '@/config/motion';
import { useOnlineStatus } from '@/hooks/use-online-status';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { resolveEditorialMedia } from '@/lib/editorial/asset-registry';
import type { EditorialMedia } from '@/types/editorial-media';

/**
 * La desconexión como retiro, no como fallo.
 *
 * Al perder la red, la cabaña de `states.offline` cubre la vista con un
 * fundido; al volver la red se va sola, también con fundido. «Seguir aquí» la
 * retira hasta el siguiente corte, para seguir leyendo lo que ya cargó.
 *
 * Sólo cubre los cortes durante la visita: sin service worker, recargar sin
 * red muestra la página del navegador. Montado una vez en el layout.
 *
 * Sin red la cabaña ya no se puede pedir: `OfflineWarmup` la carga antes, en
 * un momento ocioso, con la misma variante que elegirá `next/image`.
 */
export function OfflineVeil() {
  const t = useTranslations('states');
  const online = useOnlineStatus();
  const reduced = useReducedMotionSafe();
  const [dismissed, setDismissed] = useState(false);
  const [lastOnline, setLastOnline] = useState(online);

  // Al recuperar la red se olvida el cierre: el próximo corte vuelve a avisar.
  if (online !== lastOnline) {
    setLastOnline(online);
    if (online) setDismissed(false);
  }

  const visible = !online && !dismissed;
  const duration = reduced ? 0 : DURATION.base;
  const offlineAlt = t('media.alt.offline');
  const media = useMemo(
    () => resolveEditorialMedia('states.offline', { alt: offlineAlt }),
    [offlineAlt],
  );

  return (
    <>
      <p aria-live="polite" className="sr-only">
        {online ? '' : t('offline')}
      </p>
      <OfflineWarmup media={media} />
      <AnimatePresence>
        {visible ? (
          <Mdiv
            key="offline-veil"
            className="z-offline fixed inset-0 overflow-hidden"
            data-lenis-prevent
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration, ease: EASE.soft } }}
            exit={{ opacity: 0, transition: { duration, ease: EASE.soft } }}
          >
            <OfflineScene
              kicker={t('offlineKicker')}
              message={t('offline')}
              dismissLabel={t('offlineDismiss')}
              media={media}
              onDismiss={() => setDismissed(true)}
            />
          </Mdiv>
        ) : null}
      </AnimatePresence>
    </>
  );
}

type OfflineSceneProps = {
  kicker: string;
  message: string;
  dismissLabel: string;
  media: EditorialMedia;
  onDismiss: () => void;
};

/** La escena del retiro: cabaña a sangre y el mensaje en el eje de página. */
function OfflineScene({ kicker, message, dismissLabel, media, onDismiss }: OfflineSceneProps) {
  const sceneRef = useRef<HTMLElement>(null);

  // El velo tapa la vista: el foco pasa a su única salida.
  useEffect(() => {
    sceneRef.current?.querySelector('button')?.focus();
  }, []);

  return (
    <FullBleedSection
      media={media}
      mode="viewport"
      overlay="bottom"
      fade="bottom"
      className="bg-scrim min-h-[100dvh]"
      contentClassName="min-h-[100dvh]"
    >
      <section
        ref={sceneRef}
        aria-labelledby="offline-veil-title"
        className="fm-container flex min-h-[100dvh] flex-col items-start justify-end pt-[108px] pb-[150px] md:pb-[110px]"
      >
        <Kicker tone="lav" spacing="wide" className="mb-[18px]">
          {kicker}
        </Kicker>
        <Display id="offline-veil-title" size="lg" level="h2" className="max-w-measure-xs">
          {message}
        </Display>
        <Button variant="outline" onClick={onDismiss} className="mt-block">
          {dismissLabel}
        </Button>
      </section>
    </FullBleedSection>
  );
}

/**
 * Pide la cabaña con red, cuando el navegador queda ocioso: la misma `srcset`
 * y los mismos `sizes` que `EditorialImage`, así que el navegador elige la
 * misma variante y, al cortarse la red, la sirve de la memoria del documento.
 */
function OfflineWarmup({ media }: { media: EditorialMedia }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const warm = () => setReady(true);
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(warm, { timeout: 4000 });
      return () => window.cancelIdleCallback(id);
    }
    // Safari no tiene `requestIdleCallback`: basta con no competir con la carga inicial.
    const id = setTimeout(warm, 2000);
    return () => clearTimeout(id);
  }, []);

  if (!ready || !media.src) return null;

  const { props } = getImageProps({
    src: media.src,
    alt: '',
    fill: true,
    sizes: media.sizes,
    loading: 'eager',
  });

  // `getImageProps` está pensado para un `<img>` propio: aquí sólo precarga, nunca se ve.
  // eslint-disable-next-line @next/next/no-img-element
  return <img {...props} alt="" aria-hidden="true" className="hidden" fetchPriority="low" />;
}
