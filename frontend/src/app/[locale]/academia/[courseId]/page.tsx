import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { CourseDetail } from '@/components/features/academy/course-detail';
import { PageShell } from '@/components/layout';
import { getCourse } from '@/data';
import { resolveLocale } from '@/i18n/resolve-locale';
import { resolveEditorialMedia } from '@/lib/editorial/asset-registry';
import { routing } from '@/i18n/routing';

type PageProps = { params: Promise<{ locale: string; courseId: string }> };

export function generateStaticParams() {
  const ids = ['c1', 'c2', 'c3'];

  return routing.locales.flatMap((locale) => ids.map((courseId) => ({ locale, courseId })));
}

export async function generateMetadata({ params }: PageProps) {
  const { courseId } = await params;
  const course = getCourse(courseId);
  if (!course) return {};

  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: 'academy' });

  return { title: t(course.titleKey.replace('academy.', '') as 'courses.c1.title') };
}

export default async function CoursePage({ params }: PageProps) {
  const { courseId } = await params;
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: 'academy' });

  const course = getCourse(courseId);
  if (!course) notFound();

  const courseMedia = resolveEditorialMedia('academy-course-cover', {
    alt: t('media.alt.courseCover', {
      title: t(`courses.${course.id}.title` as 'courses.c1.title'),
    }),
    sizes: '(min-width: 1024px) 580px, calc(100vw - 48px)',
  });

  return (
    <PageShell width="wide" padding="none" fullBleed editorial>
      <div className="fm-editorial-full-bleed fm-container pt-[clamp(100px,12vw,160px)] pb-[220px]">
        <CourseDetail course={course} media={courseMedia} />
      </div>
    </PageShell>
  );
}
