'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

import { Button, ErrorState, FullBleedSection } from '@/components/ui';
import { resolveEditorialMedia } from '@/lib/editorial/asset-registry';

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

/**
 * Error boundary de segmento: envuelve cualquier página bajo `[locale]` y
 * atrapa los errores de render que escapen de un `try/catch`. Client
 * Component obligatorio (`error.js` de Next siempre lo es).
 *
 * El detalle técnico del error va sólo a consola —nunca al usuario, nunca
 * el stack en pantalla—; la persona sólo ve el copy de marca de `states` y
 * un botón que invoca `reset()` para reintentar el render del segmento.
 *
 * Es el mismo umbral editorial que el 404: la vela de `states.error` ocupa
 * el viewport con la llama en medio. El mensaje se queda en el espacio
 * tranquilo de arriba y «Reintentar», sobre el agua: con `cover` en vertical
 * la vela no se mueve, así que nada puede apilarse encima de ella.
 */
export default function Error({ error, reset }: ErrorPageProps) {
  const t = useTranslations('states');
  const media = resolveEditorialMedia('states.error', { alt: t('media.alt.error') });

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <FullBleedSection
      media={media}
      mode="viewport"
      overlay="top"
      fade="bottom"
      className="fm-editorial-shell"
      contentClassName="min-h-[100svh]"
    >
      <div className="flex min-h-[100svh] flex-col items-center justify-between px-6 pt-[108px] pb-[150px] md:px-10 md:pt-[124px] md:pb-[90px]">
        <ErrorState
          tone="warn"
          title={t('errorTitle')}
          body={t('errorBody')}
          className="max-w-[680px] py-0"
        />
        <Button variant="outline" onClick={reset}>
          {t('errorCta')}
        </Button>
      </div>
    </FullBleedSection>
  );
}
