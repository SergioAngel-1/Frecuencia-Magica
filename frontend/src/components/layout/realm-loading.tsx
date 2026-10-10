import { getTranslations } from 'next-intl/server';

import { FullBleedSection, LoadingOrb } from '@/components/ui';
import { resolveEditorialMedia } from '@/lib/editorial/asset-registry';

/**
 * Espera neutra de los realms sin silueta propia (home, acceso, descúbrete).
 * Los que tienen forma reconocible (resonario, academia, tienda,
 * experiencias, santuario) usan su propio esqueleto.
 *
 * La esfera de `states.loading` ocupa el viewport y el orbe espera sobre el
 * agua, en el tercio inferior, para no tapar la luz que respira.
 *
 * No vive en `[locale]/loading.tsx`: ahí envolvería también el catch-all de
 * rutas desconocidas, y un `notFound()` dentro de un `Suspense` ya emitido
 * responde 200 en vez de 404.
 */
export async function RealmLoading() {
  const t = await getTranslations('states');
  const media = resolveEditorialMedia('states.loading', { alt: t('media.alt.loading') });

  return (
    <FullBleedSection
      media={media}
      mode="viewport"
      overlay="bottom"
      className="fm-editorial-shell"
      contentClassName="min-h-[100svh]"
    >
      <div
        aria-busy="true"
        className="flex min-h-[100svh] flex-col items-center justify-end px-6 pt-[108px] pb-[150px] md:pb-[110px]"
      >
        <LoadingOrb label={t('loading')} size={96} tone="gold" />
      </div>
    </FullBleedSection>
  );
}
