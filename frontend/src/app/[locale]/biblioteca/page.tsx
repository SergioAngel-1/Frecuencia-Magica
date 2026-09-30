import { getTranslations } from 'next-intl/server';

import { LibrarySystem } from '@/components/features/library/library-system';
import { PageShell } from '@/components/layout';
import { FullBleedSection, Kicker, Display, Prose } from '@/components/ui';
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
      alt: t('media.alt.audioCover', { title: '{title}' }),
      sizes: '(min-width: 1024px) 150px, 150px',
    }),
  };

  return (
    <PageShell width="wide" padding="none" fullBleed editorial>
      <FullBleedSection
        media={libraryMedia.hero}
        mode="banner"
        overlay="left"
        className="fm-editorial-full-bleed fm-editorial-shell"
        contentClassName="flex min-h-full items-center"
        minHeight="clamp(420px, 52vw, 680px)"
      >
        <div className="fm-container flex w-full flex-col justify-center py-20">
          <Kicker tone="teal" spacing="wide">
            {t('kicker')}
          </Kicker>
          <Display size="xl" level="h1" className="mt-4 max-w-[12ch]">
            {t('title')}
          </Display>
          <Prose maxWidth={54} className="text-fg-body mt-6 max-w-[52ch]">
            {t('description')}
          </Prose>
        </div>
      </FullBleedSection>

      <div className="fm-editorial-full-bleed fm-container pt-[clamp(28px,5vw,72px)] pb-[220px]">
        <LibrarySystem media={libraryMedia} />
      </div>
    </PageShell>
  );
}
