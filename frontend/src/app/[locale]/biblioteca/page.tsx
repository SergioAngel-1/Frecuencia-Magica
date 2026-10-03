import { getTranslations } from 'next-intl/server';

import { LibrarySystem } from '@/components/features/library/library-system';
import { PageShell, RealmHero } from '@/components/layout';
import { resolveLocale, type LocaleParams } from '@/i18n/resolve-locale';
import { resolveEditorialMedia } from '@/lib/editorial/asset-registry';

type PageProps = { params: LocaleParams };

export async function generateMetadata({ params }: PageProps) {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: 'library' });

  return { title: t('title') };
}

export default async function LibraryPage({ params }: PageProps) {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: 'library' });
  const libraryMedia = {
    hero: resolveEditorialMedia('library.hero', { alt: t('media.alt.hero') }),
    featured: resolveEditorialMedia('library.featured', {
      alt: t('media.alt.featured'),
      sizes: '(min-width: 1024px) 720px, 100vw',
    }),
    archiveBanner: resolveEditorialMedia('library.archive-banner', {
      alt: t('media.alt.archiveBanner'),
    }),
    audioCover: resolveEditorialMedia('library.audio-cover.*', {
      sizes: '(min-width: 1024px) 150px, 150px',
    }),
  };

  return (
    <PageShell width="wide" padding="none" fullBleed editorial>
      <RealmHero
        media={libraryMedia.hero}
        kicker={t('kicker')}
        title={t('title')}
        description={t('description')}
      />

      <div className="fm-editorial-full-bleed fm-container pt-block pb-section">
        <LibrarySystem media={libraryMedia} />
      </div>
    </PageShell>
  );
}
