import { getTranslations } from 'next-intl/server';

import { LoadingOrb } from '@/components/ui';

/**
 * Espera genérica: el `Suspense` de Next se activa mientras un segmento
 * bajo `[locale]` no tiene un `loading.tsx` propio más específico. Los
 * realms con silueta reconocible (biblioteca, academia, tienda,
 * experiencias) la sustituyen con su propio esqueleto — éste es el remate
 * neutro para el resto.
 */
export default async function Loading() {
  const t = await getTranslations('states');

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6 pt-[100px] md:pt-[130px]">
      <LoadingOrb label={t('loading')} />
    </div>
  );
}
