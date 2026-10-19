import { getTranslations } from 'next-intl/server';

import { ResonarioSystem } from '@/components/features/resonario/resonario-system';
import { FramedHeading, PageShell, RealmHero } from '@/components/layout';
import { AUDIO_KINDS } from '@/config/audio-kinds';
import { resolveLocale, type LocaleParams } from '@/i18n/resolve-locale';
import { resolveEditorialMedia } from '@/lib/editorial/asset-registry';
import { buildPageMetadata } from '@/lib/seo/page-metadata';
import type { AudioKind } from '@/types/content';
import type { EditorialMedia } from '@/types/editorial-media';

type PageProps = { params: LocaleParams };

export async function generateMetadata({ params }: PageProps) {
  const locale = await resolveLocale(params);
  const [t, common] = await Promise.all([
    getTranslations({ locale, namespace: 'resonario' }),
    getTranslations({ locale, namespace: 'common' }),
  ]);

  return buildPageMetadata({
    locale,
    pathname: '/resonario',
    title: t('meta.title'),
    description: t('meta.description'),
    imageAlt: common('ogImageAlt'),
  });
}

export default async function ResonarioPage({ params }: PageProps) {
  const locale = await resolveLocale(params);
  // En paralelo: cada `getTranslations` es una espera independiente.
  const [t, tStates] = await Promise.all([
    getTranslations({ locale, namespace: 'resonario' }),
    getTranslations({ locale, namespace: 'states' }),
  ]);
  const resonarioMedia = {
    hero: resolveEditorialMedia('resonario.hero', { alt: t('media.alt.hero') }),
    archive: resolveEditorialMedia('resonario.archive-banner', {
      alt: t('media.alt.archiveBanner'),
    }),
    featured: resolveEditorialMedia('resonario.featured', {
      alt: t('media.alt.featured'),
      sizes: '(min-width: 1024px) 720px, 100vw',
    }),
    // El filtro sin resultados: el vacío de marca, no el del archivo.
    empty: resolveEditorialMedia('states.empty', { alt: tStates('media.alt.empty') }),
    // Un banner por tipo de escucha: la instancia es el slug del tipo.
    kindBanners: Object.fromEntries(
      AUDIO_KINDS.map(({ kind, bannerSlug }) => [
        kind,
        resolveEditorialMedia('resonario.kind-banner.*', {
          instance: bannerSlug,
          alt: t(`media.alt.kindBanner.${kind}`),
          sizes: '(min-width: 1024px) 1040px, 100vw',
        }),
      ]),
    ) as Record<AudioKind, EditorialMedia>,
    celtic: resolveEditorialMedia('resonario.celtic', {
      alt: t('media.alt.celtic'),
      sizes: '(min-width: 768px) 560px, 100vw',
    }),
  };

  return (
    <PageShell width="wide" padding="none" fullBleed editorial>
      <RealmHero
        media={resonarioMedia.hero}
        kicker={t('kicker')}
        title={t('title')}
        description={t('description')}
      />

      {/* Tras el héroe, el archivo es una tarjeta enmarcada y no otra banda a sangre:
          dos bandas no van seguidas (ver `band-rhythm.test`). */}
      <div className="fm-editorial-full-bleed fm-container pt-block pb-section">
        <FramedHeading
          media={resonarioMedia.archive}
          kicker={t('archive.eyebrow')}
          title={t('archive.title')}
          description={t('archive.description')}
          titleId="resonario-archive-title"
          tone="gold"
        />

        <div className="mt-block">
          <ResonarioSystem media={resonarioMedia} />
        </div>
      </div>
    </PageShell>
  );
}
