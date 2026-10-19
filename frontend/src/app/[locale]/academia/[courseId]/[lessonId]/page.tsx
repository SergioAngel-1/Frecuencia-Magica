import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { LessonPlayer } from '@/components/features/academy/lesson-player';
import { PageShell } from '@/components/layout';
import { COURSES, getCourse } from '@/data/courses';
import { buildLessons } from '@/lib/academy/lessons';
import { messageKey } from '@/i18n/keys';
import { resolveLocale } from '@/i18n/resolve-locale';
import { resolveEditorialMedia } from '@/lib/editorial/asset-registry';
import { buildPageMetadata } from '@/lib/seo/page-metadata';
import { routing } from '@/i18n/routing';

type PageProps = { params: Promise<{ locale: string; courseId: string; lessonId: string }> };

/**
 * Sólo existen los ids del catálogo. El 404 de uno desconocido sale con su
 * estado real porque el `loading.tsx` del realm vive en `(catalogo)/` y no
 * envuelve esta ruta: un `notFound()` dentro del streaming responde 200.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  // Una página por lección más la de finalización (`lessons + 1`).
  return routing.locales.flatMap((locale) =>
    COURSES.flatMap((course) =>
      Array.from({ length: course.lessons + 1 }, (_, i) => ({
        locale,
        courseId: course.id,
        lessonId: String(i + 1),
      })),
    ),
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { courseId, lessonId } = await params;
  const course = getCourse(courseId);
  if (!course || !/^\d+$/.test(lessonId)) return {};

  const lessonIndex = Number(lessonId) - 1;
  const lessons = buildLessons(course);
  if (lessonIndex < 0 || lessonIndex > lessons.length) return {};

  const locale = await resolveLocale(params);
  const [t, common] = await Promise.all([
    getTranslations({ locale, namespace: 'academy' }),
    getTranslations({ locale, namespace: 'common' }),
  ]);

  const courseTitle = t(messageKey('academy', course.titleKey));
  const lessonData = lessons[lessonIndex];
  const completion = lessonIndex === lessons.length;
  const number = String(lessonIndex + 1);

  const title = completion
    ? t('meta.completionTitle')
    : t('meta.lessonTitle', {
        number,
        title: t(messageKey('academy', `lessonTitles.${lessonData!.titleIndex}`)),
      });
  const description = completion
    ? t('meta.completionDescription')
    : t('meta.lessonDescription', { number, course: courseTitle });

  return buildPageMetadata({
    locale,
    pathname: {
      pathname: '/academia/[courseId]/[lessonId]',
      params: { courseId: course.id, lessonId },
    },
    title,
    description,
    imageAlt: common('ogImageAlt'),
    noindex: true,
  });
}

export default async function LessonPage({ params }: PageProps) {
  const { courseId, lessonId } = await params;
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: 'academy' });

  const course = getCourse(courseId);
  if (!course) notFound();

  if (!/^\d+$/.test(lessonId)) notFound();

  const lessonIndex = Number(lessonId) - 1;
  const lessons = buildLessons(course);
  if (lessonIndex < 0 || lessonIndex > lessons.length) notFound();

  const lessonData = lessons[lessonIndex];
  const isLast = lessonIndex >= lessons.length - 1;
  const lessonTitle =
    lessonIndex < lessons.length
      ? `${lessonData?.number}. ${t(messageKey('academy', `lessonTitles.${lessonData!.titleIndex}`))}`
      : '';

  const lessonSizes = '(min-width: 1280px) 1240px, calc(100vw - 48px)';
  // La lección se ve con la imagen de su curso, la misma de su portada; la
  // escena genérica de lección queda para el curso que aún no tenga foto.
  const courseCover = resolveEditorialMedia('academy-course-cover', {
    instance: course.id,
    alt: t('media.alt.lesson', { title: lessonTitle }),
    sizes: lessonSizes,
    band: course.band,
  });
  const lessonMedia = courseCover.src
    ? courseCover
    : resolveEditorialMedia('academy-lesson-visual', {
        alt: t('media.alt.lesson', { title: lessonTitle }),
        sizes: lessonSizes,
        band: course.band,
      });
  const completionMedia = resolveEditorialMedia('academy.completion', {
    alt: t('media.alt.completion'),
    sizes: '(min-width: 1024px) 1000px, 100vw',
  });

  return (
    <PageShell width="wide" padding="none" fullBleed editorial>
      <div className="fm-editorial-full-bleed fm-container pb-section pt-hero">
        <LessonPlayer
          completionMedia={completionMedia}
          course={course}
          isLast={isLast}
          lessonIndex={lessonIndex}
          lessonMedia={lessonMedia}
          lessonTitle={lessonTitle}
        />
      </div>
    </PageShell>
  );
}
