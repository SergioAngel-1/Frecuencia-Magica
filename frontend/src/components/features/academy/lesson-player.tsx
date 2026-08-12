'use client';

import { useTranslations } from 'next-intl';

import { Button, Display, EditorialImage, Kicker } from '@/components/ui';
import { Link } from '@/i18n/navigation';
import { buildLessons } from '@/lib/academy/lessons';
import type { EditorialMedia } from '@/types/editorial-media';
import type { Course } from '@/types/content';

type LessonPlayerProps = {
  course: Course;
  lessonIndex: number;
  isLast: boolean;
  lessonTitle: string;
  lessonMedia: EditorialMedia;
  completionMedia: EditorialMedia;
};

export function LessonPlayer({
  course,
  lessonIndex,
  isLast,
  lessonTitle,
  lessonMedia,
  completionMedia,
}: LessonPlayerProps) {
  const t = useTranslations('academy');
  const lessons = buildLessons(course);
  const prevIndex = lessonIndex > 0 ? lessonIndex - 1 : null;
  const nextIndex = !isLast ? lessonIndex + 1 : null;

  if (lessonIndex >= lessons.length) {
    return (
      <section
        className="rounded-card-lg relative isolate min-h-[clamp(430px,48vw,680px)] overflow-hidden"
        data-editorial-media="academy.completion"
      >
        <div className="absolute inset-0">
          <EditorialImage
            aspect="16:8"
            className="h-full"
            media={completionMedia}
            overlay="bottom"
            scrim="bottom"
          />
        </div>
        <div className="relative z-10 flex min-h-[clamp(430px,48vw,680px)] max-w-[600px] flex-col justify-end px-[clamp(24px,7vw,84px)] py-[clamp(30px,7vw,84px)]">
          <span className="border-gold/60 bg-void/35 text-gold mb-5 inline-flex size-14 items-center justify-center rounded-full border font-serif text-[24px] backdrop-blur-sm">
            <span aria-hidden="true">✓</span>
            <span className="sr-only">{t('completion.title')}</span>
          </span>
          <Display size="md" level="h1">
            {t('completion.title')}
          </Display>
          <p className="text-ivory/82 mt-5 max-w-[42ch] text-[16px] leading-[1.8]">
            {t('completion.description')}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button variant="outline" asChild>
              <Link href="/academia">{t('completion.back')}</Link>
            </Button>
            <Button variant="accent" asChild>
              <Link href="/biblioteca">{t('completion.exploreLibrary')}</Link>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <article>
      <Link
        href={{ pathname: '/academia/[courseId]', params: { courseId: course.id } }}
        className="text-ivory/62 hover:text-ivory min-h-11 py-3 font-sans text-[13px] tracking-[.12em] uppercase transition-colors"
      >
        ← {t('backLabel')}
      </Link>

      <Kicker tone="teal" spacing="widest" className="mt-8">
        {t(`courses.${course.id}.title` as 'courses.c1.title')}
      </Kicker>
      <Display size="lg" level="h1" className="mt-3 max-w-[15ch]">
        {lessonTitle}
      </Display>

      <figure
        className="rounded-card-lg relative mt-9 overflow-hidden"
        data-editorial-media="academy-lesson-visual"
      >
        <div className="relative aspect-[16/8]">
          <EditorialImage
            aspect="16:8"
            className="h-full"
            focalPoint={lessonMedia.position}
            media={lessonMedia}
            overlay="bottom"
            scrim="bottom"
          />
          <div className="absolute inset-x-0 bottom-0 z-10 px-5 py-5 sm:px-8 sm:py-7">
            <audio
              aria-describedby="lesson-audio-note"
              aria-label={t('audioLabel')}
              className="accent-gold h-11 w-full"
              controls
              preload="none"
            />
            <p
              id="lesson-audio-note"
              className="text-ivory/70 mt-3 max-w-[52ch] font-sans text-[12px] leading-[1.5]"
            >
              {t('audioDeferred')}
            </p>
          </div>
        </div>
        <figcaption className="border-gold/20 bg-ivory/[0.025] text-ivory/58 border-x border-b px-5 py-4 font-sans text-[11px] tracking-[.18em] uppercase">
          {t('media.alt.lesson', { title: lessonTitle })}
        </figcaption>
      </figure>

      <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
        {prevIndex !== null ? (
          <Button variant="outline" size="sm" asChild>
            <Link
              href={{
                pathname: '/academia/[courseId]/[lessonId]',
                params: { courseId: course.id, lessonId: String(prevIndex + 1) },
              }}
            >
              ← {t('previousLesson')}
            </Link>
          </Button>
        ) : (
          <span />
        )}

        {nextIndex !== null ? (
          <Button variant="accent" size="sm" asChild>
            <Link
              href={{
                pathname: '/academia/[courseId]/[lessonId]',
                params: { courseId: course.id, lessonId: String(nextIndex + 1) },
              }}
            >
              {t('nextLesson')} →
            </Link>
          </Button>
        ) : (
          <Button variant="accent" size="sm" asChild>
            <Link
              href={{
                pathname: '/academia/[courseId]/[lessonId]',
                params: { courseId: course.id, lessonId: String(lessons.length + 1) },
              }}
            >
              {t('finish')}
            </Link>
          </Button>
        )}
      </div>
    </article>
  );
}
