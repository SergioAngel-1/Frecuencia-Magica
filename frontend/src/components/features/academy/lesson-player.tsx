'use client';

import { useTranslations } from 'next-intl';

import { VideoSlot } from '@/components/features/player/video-slot';
import { Button, Display, EditorialImage, Kicker } from '@/components/ui';
import { getVideo, lessonVideoId } from '@/config/videos';
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
          <span className="border-accent/60 bg-scrim/35 text-accent mb-5 inline-flex size-14 items-center justify-center rounded-full border font-serif text-[24px] backdrop-blur-sm">
            <span aria-hidden="true">✓</span>
            <span className="sr-only">{t('completion.title')}</span>
          </span>
          <Display size="md" level="h1">
            {t('completion.title')}
          </Display>
          <p className="text-fg-body mt-5 max-w-[42ch] text-[16px] leading-[1.8]">
            {t('completion.description')}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button variant="outline" asChild>
              <Link href="/academia">{t('completion.back')}</Link>
            </Button>
            <Button variant="accent" asChild>
              <Link href="/resonario">{t('completion.exploreResonario')}</Link>
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
        className="text-fg-muted hover:text-fg text-meta tracking-ui inline-flex min-h-11 items-center py-3 font-sans uppercase transition-colors"
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
        data-editorial-media={lessonMedia.slot}
      >
        {/* El video de la lección: con fuente, el reproductor del sitio; sin ella,
            el póster del curso con «Próximamente», sin play ni reloj. `key`:
            cada lección estrena su propio espacio. */}
        <VideoSlot
          key={lessonIndex}
          video={getVideo(lessonVideoId(course.id, lessonIndex + 1))}
          media={lessonMedia}
          title={lessonTitle}
          className="aspect-[16/9] sm:aspect-[16/8]"
        />
        <figcaption className="border-line bg-fg/[0.025] text-fg-meta text-label tracking-caps border-x border-b px-5 py-4 font-sans uppercase">
          {t('media.alt.lesson', { title: lessonTitle })}
        </figcaption>
      </figure>

      <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
        {prevIndex !== null ? (
          <Button variant="outline" asChild>
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
          <Button variant="accent" asChild>
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
          <Button variant="accent" asChild>
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
