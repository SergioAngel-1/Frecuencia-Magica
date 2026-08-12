import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { LessonPlayer } from '@/components/features/academy/lesson-player';
import { PageShell } from '@/components/layout';
import { getCourse } from '@/data';
import { buildLessons } from '@/lib/academy/lessons';
import { resolveLocale } from '@/i18n/resolve-locale';
import { resolveEditorialMedia } from '@/lib/editorial/asset-registry';
import { routing } from '@/i18n/routing';

type PageProps = { params: Promise<{ locale: string; courseId: string; lessonId: string }> };

export function generateStaticParams() {
  const ids = ['c1', 'c2', 'c3'];

  return routing.locales.flatMap((locale) =>
    ids.flatMap((courseId) => {
      const course = getCourse(courseId);
      if (!course) return [];

      return Array.from({ length: course.lessons }, (_, i) => ({
        locale,
        courseId,
        lessonId: String(i + 1),
      }));
    }),
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { courseId } = await params;
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: 'academy' });

  return { title: t(`courses.${courseId}.title` as 'courses.c1.title') };
}

export default async function LessonPage({ params }: PageProps) {
  const { courseId, lessonId } = await params;
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: 'academy' });

  const course = getCourse(courseId);
  if (!course) notFound();

  const lessonIndex = Number(lessonId) - 1;
  const lessons = buildLessons(course);
  const lessonData = lessons[lessonIndex];
  const isLast = lessonIndex >= lessons.length - 1;
  const lessonTitle =
    lessonIndex < lessons.length
      ? `${lessonData?.number}. ${t(`lessonTitles.${lessonData!.titleIndex}` as 'lessonTitles.0')}`
      : '';

  const lessonMedia = resolveEditorialMedia('academy-lesson-visual', {
    alt: t('media.alt.lesson', { title: lessonTitle }),
    sizes: '(min-width: 1024px) 900px, 100vw',
  });
  const completionMedia = resolveEditorialMedia('academy.completion', {
    alt: t('media.alt.completion'),
    sizes: '(min-width: 1024px) 1000px, 100vw',
  });

  return (
    <PageShell width="wide" padding="none" fullBleed editorial>
      <div className="mx-auto w-full max-w-[1280px] px-6 pt-[clamp(100px,12vw,160px)] pb-[220px] md:px-[8vw]">
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
