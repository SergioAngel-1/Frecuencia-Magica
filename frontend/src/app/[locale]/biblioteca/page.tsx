import { getTranslations } from 'next-intl/server';

import { LibrarySystem } from '@/components/features/library/library-system';
import { PageShell } from '@/components/layout';
import { FullBleedSection, Kicker, Display, Prose } from '@/components/ui';
import { resolveLocale, type LocaleParams } from '@/i18n/resolve-locale';
import { resolveEditorialMedia } from '@/lib/editorial/asset-registry';

type PageProps = { params: LocaleParams };

const CATEGORY_KEYS = ['meditation', 'frequency', 'rest', 'ritual'] as const;

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
        <div className="mx-auto flex w-full max-w-[1440px] flex-col justify-center px-6 py-20 sm:px-[8vw] lg:px-[10vw]">
          <Kicker tone="teal" spacing="wide">
            {t('kicker')}
          </Kicker>
          <Display size="xl" level="h1" className="mt-4 max-w-[12ch]">
            {t('title')}
          </Display>
          <Prose maxWidth={54} className="text-ivory/86 mt-6 max-w-[52ch]">
            {t('description')}
          </Prose>
          <div
            aria-label={t('filtersLabel')}
            className="mt-8 flex flex-wrap gap-x-5 gap-y-3"
            role="list"
          >
            {CATEGORY_KEYS.map((key) => (
              <span
                key={key}
                className="text-ivory/78 border-teal/45 min-h-11 border-b px-1 py-3 font-sans text-[11px] tracking-[.2em] uppercase"
                role="listitem"
              >
                {t(`filters.${key}` as 'filters.meditation')}
              </span>
            ))}
          </div>
        </div>
      </FullBleedSection>

      <div className="mx-auto w-full max-w-[1040px] px-6 pt-[clamp(28px,5vw,72px)] pb-[220px]">
        <LibrarySystem media={libraryMedia} />
      </div>
    </PageShell>
  );
}
