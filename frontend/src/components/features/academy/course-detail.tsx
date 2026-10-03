'use client';

import { useTranslations } from 'next-intl';

import { Display, EditorialImage, Kicker } from '@/components/ui';
import { Link } from '@/i18n/navigation';
import { buildLessons } from '@/lib/academy/lessons';
import type { EditorialMedia } from '@/types/editorial-media';
import type { Course } from '@/types/content';

import { LessonList } from './lesson-list';

type CourseDetailProps = {
  course: Course;
  media: EditorialMedia;
  currentLesson?: number;
};

export function CourseDetail({ course, media, currentLesson }: CourseDetailProps) {
  const t = useTranslations('academy');
  const lessons = buildLessons(course);
  const title = t(`courses.${course.id}.title` as 'courses.c1.title');

  return (
    <div>
      <Link
        href="/academia"
        className="text-fg-muted hover:text-ivory text-meta tracking-ui inline-flex min-h-11 items-center py-3 font-sans uppercase transition-colors"
      >
        ← {t('backLabel')}
      </Link>

      <div className="mt-8 grid gap-[clamp(36px,7vw,96px)] md:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)] md:items-start">
        <article>
          <Kicker tone="teal" spacing="widest">
            {t('featuredBadge')}
          </Kicker>
          <Display size="lg" level="h1" className="mt-3 max-w-[13ch]">
            {title}
          </Display>
          <p className="text-fg-soft mt-5 max-w-[56ch] text-[16px] leading-[1.8]">
            {t('courseDescription')}
          </p>

          <figure
            className="rounded-card-lg mt-9 overflow-hidden"
            data-editorial-media="academy-course-cover"
          >
            <div className="relative aspect-[16/8]">
              <EditorialImage
                aspect="16:8"
                className="h-full"
                focalPoint={media.position}
                media={media}
                overlay="bottom"
                scrim="bottom"
              />
            </div>
            <figcaption className="border-gold/20 bg-ivory/[0.025] text-fg-meta text-label tracking-caps border-x border-b px-5 py-4 font-sans uppercase">
              {t('media.alt.courseCover', { title })}
            </figcaption>
          </figure>
        </article>

        <aside className="md:sticky md:top-[112px]">
          <LessonList courseId={course.id} currentIndex={currentLesson} lessons={lessons} />
        </aside>
      </div>
    </div>
  );
}
