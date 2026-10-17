import { getTranslations } from 'next-intl/server';

import { CourseList } from '@/components/features/academy/course-list';
import { PageShell, RealmHero } from '@/components/layout';
import { ATMOSPHERES } from '@/config/atmospheres';
import { COURSES } from '@/data';
import { resolveLocale, type LocaleParams } from '@/i18n/resolve-locale';
import { scrimToneFor } from '@/lib/atmosphere/painting';
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
    // La Academia vive en la atmósfera `study`: su paisaje, no la foto del realm.
    hero: resolveEditorialMedia('atmosphere.study', {
      alt: t('media.alt.hero'),
      sizes: '100vw',
    }),
    featuredCourse: resolveEditorialMedia('academy.featured-course', {
      alt: t('media.alt.featured', { title: featuredTitle }),
      sizes: '(min-width: 1280px) 1040px, calc(100vw - 48px)',
    }),
    // Una portada por curso: la que no tenga foto publicada pinta la banda del ítem.
    courseCovers: Object.fromEntries(
      COURSES.map((course) => [
        course.id,
        resolveEditorialMedia('academy-course-cover', {
          instance: course.id,
          sizes: '(min-width: 1280px) 520px, (min-width: 768px) 42vw, calc(100vw - 48px)',
        }),
      ]),
    ),
  };

  return (
    <PageShell width="wide" padding="none" fullBleed editorial>
      <RealmHero
        media={academyMedia.hero}
        kicker={t('kicker')}
        title={t('title')}
        description={t('description')}
        scrimTone={scrimToneFor(ATMOSPHERES.study.scheme)}
      />

      <div className="fm-editorial-full-bleed fm-container pt-block pb-section">
        <CourseList media={academyMedia} />
      </div>
    </PageShell>
  );
}
