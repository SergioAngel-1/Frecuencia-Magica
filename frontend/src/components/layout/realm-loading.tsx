import { getTranslations } from 'next-intl/server';

import { resolveEditorialMedia } from '@/lib/editorial/asset-registry';

import { LoadingScene } from './loading-scene';
import { RouteLoadingGate } from './route-loading-gate';

/**
 * La espera de una carga directa, en todos los realms: la misma escena que
 * `RouteTransition` muestra entre vistas (`LoadingScene`). Cada `loading.tsx`
 * la reexporta. En una navegación del cliente la escena no se pinta aquí:
 * `RouteLoadingGate` la deja en manos de `RouteTransition` (ver ahí por qué).
 *
 * No vive en `[locale]/loading.tsx`: ahí envolvería también el catch-all de
 * rutas desconocidas, y un `notFound()` dentro de un `Suspense` ya emitido
 * responde 200 en vez de 404.
 */
export async function RealmLoading() {
  const t = await getTranslations('states');
  const media = resolveEditorialMedia('states.loading', { alt: t('media.alt.loading') });

  return (
    <RouteLoadingGate>
      <LoadingScene media={media} label={t('loading')} />
    </RouteLoadingGate>
  );
}
