import { getTranslations } from 'next-intl/server';

import { ExperienceList } from '@/components/features/experiences/experience-list';
import { PageShell } from '@/components/layout';
import { Display, FullBleedSection, Kicker, Prose } from '@/components/ui';
import { resolveLocale, type LocaleParams } from '@/i18n/resolve-locale';
import { resolveEditorialMedia } from '@/lib/editorial/asset-registry';

type PageProps = { params: LocaleParams };

export async function generateMetadata({ params }: PageProps) {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: 'experiences' });

  return { title: t('title') };
}

export default async function ExperiencesPage({ params }: PageProps) {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: 'experiences' });
  const featuredTitle = t('items.e1.title');
  const experienceMedia = {
    hero: resolveEditorialMedia('experiences.hero', {
      alt: t('media.alt.hero'),
      sizes: '100vw',
    }),
    featured: resolveEditorialMedia('experiences.featured', {
      alt: t('media.alt.featured', { title: featuredTitle }),
      sizes: '100vw',
    }),
    row: resolveEditorialMedia('experiences-visual', {
      alt: t('media.alt.row', { title: '{title}' }),
      sizes: '(min-width: 1280px) 1200px, calc(100vw - 48px)',
    }),
  };

  return (
    <PageShell width="wide" padding="none" fullBleed editorial>
      <FullBleedSection
        media={experienceMedia.hero}
        mode="banner"
        overlay="left"
        className="fm-editorial-full-bleed"
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

      <div className="fm-editorial-full-bleed fm-container pt-[clamp(30px,5vw,76px)] pb-[220px]">
        <ExperienceList media={experienceMedia} />
      </div>
    </PageShell>
  );
}
