import { getTranslations } from 'next-intl/server';

import { CourseList } from '@/components/features/academy/course-list';
import { PageShell } from '@/components/layout';
import { Display, FullBleedSection, Kicker, Prose } from '@/components/ui';
import { resolveLocale, type LocaleParams } from '@/i18n/resolve-locale';
import { resolveEditorialMedia } from '@/lib/editorial/asset-registry';

type PageProps = { params: LocaleParams };

export async function generateMetadata({ params }: PageProps) {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: 'academy' });

  return { title: t('title') };
}

export default async function AcademyPage({ params }: PageProps) {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: 'academy' });
  const featuredTitle = t('courses.c1.title');
  const academyMedia = {
    hero: resolveEditorialMedia('academy.hero', { alt: t('media.alt.hero') }),
    featuredCourse: resolveEditorialMedia('academy.featured-course', {
      alt: t('media.alt.featured', { title: featuredTitle }),
      sizes: '(min-width: 1280px) 1040px, calc(100vw - 48px)',
    }),
    courseCover: resolveEditorialMedia('academy-course-cover', {
      alt: t('media.alt.courseCover', { title: '{title}' }),
      sizes: '(min-width: 1280px) 520px, (min-width: 768px) 42vw, calc(100vw - 48px)',
    }),
  };

  return (
    <PageShell width="wide" padding="none" fullBleed editorial>
      <FullBleedSection
        media={academyMedia.hero}
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
        <CourseList media={academyMedia} />
      </div>
    </PageShell>
  );
}
