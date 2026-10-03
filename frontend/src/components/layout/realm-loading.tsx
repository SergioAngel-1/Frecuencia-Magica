import { getTranslations } from 'next-intl/server';

import { LoadingOrb } from '@/components/ui';

/**
 * Espera neutra de los realms sin silueta propia (home, acceso, descúbrete).
 * Los que tienen forma reconocible (resonario, academia, tienda,
 * experiencias, santuario) usan su propio esqueleto.
 *
 * No vive en `[locale]/loading.tsx`: ahí envolvería también el catch-all de
 * rutas desconocidas, y un `notFound()` dentro de un `Suspense` ya emitido
 * responde 200 en vez de 404.
 */
export async function RealmLoading() {
  const t = await getTranslations('states');

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6 pt-[100px] md:pt-[130px]">
      <LoadingOrb label={t('loading')} />
    </div>
  );
}
