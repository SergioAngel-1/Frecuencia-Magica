'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

import { PageShell } from '@/components/layout';
import { Button, ErrorState } from '@/components/ui';

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
 */
export default function Error({ error, reset }: ErrorPageProps) {
  const t = useTranslations('states');

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <PageShell width="result" padding="centered">
      <ErrorState
        tone="warn"
        title={t('errorTitle')}
        body={t('errorBody')}
        action={
          <Button variant="outline" onClick={reset}>
            {t('errorCta')}
          </Button>
        }
      />
    </PageShell>
  );
}
