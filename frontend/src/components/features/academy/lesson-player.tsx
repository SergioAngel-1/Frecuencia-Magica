'use client';

import { useTranslations } from 'next-intl';

import { Button, Display, Kicker } from '@/components/ui';
import { Link } from '@/i18n/navigation';
import { buildLessons } from '@/lib/academy/lessons';
import type { Course } from '@/types/content';

type LessonPlayerProps = {
  course: Course;
  lessonIndex: number;
  isLast: boolean;
  lessonTitle: string;
};

export function LessonPlayer({ course, lessonIndex, isLast, lessonTitle }: LessonPlayerProps) {
  const t = useTranslations('academy');
  const lessons = buildLessons(course);
  const prevIndex = lessonIndex > 0 ? lessonIndex - 1 : null;
  const nextIndex = !isLast ? lessonIndex + 1 : null;

  // Pantalla de finalización para la vista posterior a la última lección
  // (se renderiza cuando el índice excede el número de lecciones).
  if (lessonIndex >= lessons.length) {
    return (
      <div className="mx-auto mt-[60px] flex max-w-[480px] flex-col items-center text-center">
        <div
          aria-hidden="true"
          className="mb-8 size-[120px] animate-fm-breathe rounded-full"
          style={{
            background:
              'radial-gradient(circle at 42% 38%, rgba(247,244,234,0.9), rgba(216,185,120,0.55) 44%, transparent 72%)',
            boxShadow: '0 0 80px 22px rgba(216,185,120,0.3)',
          }}
        />
        <Display size="xs">{t('completion.title')}</Display>
        <p className="text-ivory/72 mt-4 max-w-[40ch] text-[15px] leading-[1.8]">
          {t('completion.description')}
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Button variant="outline" asChild>
            <Link href="/academia">{t('completion.back')}</Link>
          </Button>
          <Button variant="accent" asChild>
            <Link href="/biblioteca">{t('completion.exploreLibrary')}</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Link
        href={{ pathname: '/academia/[courseId]', params: { courseId: course.id } }}
        className="font-sans text-[13px] uppercase tracking-[.12em] text-ivory/60 transition-colors hover:text-ivory"
      >
        ← {t('backLabel')}
      </Link>

      <Kicker tone="teal" spacing="widest" className="mt-8">
        {t(`courses.${course.id}.title` as 'courses.c1.title')}
      </Kicker>
      <Display size="md" level="h1" className="mt-1">
        {lessonTitle}
      </Display>

      <div
        className="relative mt-8 overflow-hidden rounded-[22px]"
        style={{ aspectRatio: '16/8', backgroundImage: course.band }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(70% 100% at 30% 10%, rgba(247,244,234,0.18), transparent 60%)',
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 px-[22px] py-[18px]"
          style={{ background: 'linear-gradient(0deg, rgba(10,18,32,0.7), transparent)' }}
        >
          <div className="flex items-center gap-4">
            <button
              type="button"
              aria-label={t('lesson')}
              className="flex size-[48px] shrink-0 items-center justify-center rounded-full border border-ivory/60 backdrop-blur-[4px]"
              style={{ background: 'rgba(15,27,46,0.35)' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="translate-x-[6%] text-ivory">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        {prevIndex !== null ? (
          <Button variant="outline" size="sm" asChild>
            <Link href={{ pathname: '/academia/[courseId]/[lessonId]', params: { courseId: course.id, lessonId: String(prevIndex + 1) } }}>
              ← {t('previousLesson')}
            </Link>
          </Button>
        ) : (
          <div />
        )}

        {nextIndex !== null ? (
          <Button variant="accent" size="sm" asChild>
            <Link href={{ pathname: '/academia/[courseId]/[lessonId]', params: { courseId: course.id, lessonId: String(nextIndex + 1) } }}>
              {t('nextLesson')} →
            </Link>
          </Button>
        ) : (
          <Button variant="accent" size="sm" asChild>
            <Link href={{ pathname: '/academia/[courseId]/[lessonId]', params: { courseId: course.id, lessonId: String(lessons.length + 1) } }}>
              {t('finish')}
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
