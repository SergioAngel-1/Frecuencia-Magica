import { getTranslations } from 'next-intl/server';

import { ResonarioSystem } from '@/components/features/resonario/resonario-system';
import { PageShell, RealmHero } from '@/components/layout';
import { BandChain, EditorialBanner } from '@/components/ui';
import { AUDIOS } from '@/data';
import { resolveLocale, type LocaleParams } from '@/i18n/resolve-locale';
import { resolveEditorialMedia } from '@/lib/editorial/asset-registry';

type PageProps = { params: LocaleParams };

export async function generateMetadata({ params }: PageProps) {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: 'resonario' });

  return { title: t('title') };
}

export default async function ResonarioPage({ params }: PageProps) {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: 'resonario' });
  const tStates = await getTranslations({ locale, namespace: 'states' });
  const resonarioMedia = {
    hero: resolveEditorialMedia('resonario.hero', { alt: t('media.alt.hero') }),
    featured: resolveEditorialMedia('resonario.featured', {
      alt: t('media.alt.featured'),
      sizes: '(min-width: 1024px) 720px, 100vw',
    }),
    // El filtro sin resultados: el vacío de marca, no el del archivo.
    empty: resolveEditorialMedia('states.empty', { alt: tStates('media.alt.empty') }),
    audioCover: resolveEditorialMedia('resonario.audio-cover.*', {
      sizes: '(min-width: 1024px) 150px, 150px',
    }),
    // Una portada por audio: la que no tenga foto publicada pinta la banda del ítem.
    audioCovers: Object.fromEntries(
      AUDIOS.map((audio) => [
        audio.id,
        resolveEditorialMedia('resonario.audio-cover.*', {
          instance: audio.id,
          sizes: '(min-width: 1024px) 150px, 150px',
        }),
      ]),
    ),
  };

  const archiveBanner = resolveEditorialMedia('resonario.archive-banner', {
    alt: t('media.alt.archiveBanner'),
  });

  return (
    <PageShell width="wide" padding="none" fullBleed editorial>
      {/* El héroe y el banner del archivo son bandas consecutivas: se tocan sin
          hueco. Los filtros bajan junto al sistema que filtran. */}
      <BandChain>
        <RealmHero
          media={resonarioMedia.hero}
          kicker={t('kicker')}
          title={t('title')}
          description={t('description')}
        />
        <EditorialBanner
          media={archiveBanner}
          eyebrow={t('archive.eyebrow')}
          title={t('archive.title')}
          body={t('archive.description')}
        />
      </BandChain>

      <div className="fm-editorial-full-bleed fm-container pt-block pb-section">
        <ResonarioSystem media={resonarioMedia} />
      </div>
    </PageShell>
  );
}
