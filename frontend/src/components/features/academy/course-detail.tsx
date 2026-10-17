'use client';

import { useTranslations } from 'next-intl';

import { VideoSlot } from '@/components/features/player/video-slot';
import { Display, EditorialImage, Float, Kicker } from '@/components/ui';
import { courseIntroId, getVideo } from '@/config/videos';
import { Link } from '@/i18n/navigation';
import { buildLessons } from '@/lib/academy/lessons';
import type { EditorialMedia } from '@/types/editorial-media';
import type { Course } from '@/types/content';

import { CourseFacts } from './course-facts';
import { CoursePoints } from './course-points';
import { ModuleList } from './module-list';

type CourseDetailProps = {
  course: Course;
  media: EditorialMedia;
  /** El póster de la presentación del curso (`videoPosterMedia`). */
  introMedia: EditorialMedia;
  currentLesson?: number;
};

/**
 * La ficha del curso alterna lo que se lee y lo que se mira: texto y portada,
 * presentación en video y «qué aprenderás», «qué incluye» y los módulos. En
 * móvil todo se apila en ese mismo orden.
 */
export function CourseDetail({ course, media, introMedia, currentLesson }: CourseDetailProps) {
  const t = useTranslations('academy');
  const lessons = buildLessons(course);
  const title = t(`courses.${course.id}.title` as 'courses.c1.title');

  return (
    <div>
      <Link
        href="/academia"
        className="text-fg-muted hover:text-fg text-meta tracking-ui inline-flex min-h-11 items-center py-3 font-sans uppercase transition-colors"
      >
        ← {t('backLabel')}
      </Link>

      <div className="mt-8 grid gap-[clamp(36px,7vw,96px)] md:grid-cols-2 md:items-center">
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
          <CourseFacts course={course} className="mt-6" />
        </article>

        <Float
          as="figure"
          className="rounded-card-lg overflow-hidden"
          data-editorial-media="academy-course-cover"
        >
          <div className="relative aspect-[16/10]">
            <EditorialImage
              aspect="16:8"
              className="h-full"
              focalPoint={media.position}
              media={media}
              overlay="bottom"
              scrim="bottom"
            />
          </div>
          <figcaption className="border-line bg-fg/[0.025] text-fg-meta text-label tracking-caps border-x border-b px-5 py-4 font-sans uppercase">
            {t('media.alt.courseCover', { title })}
          </figcaption>
        </Float>
      </div>

      <div className="mt-section grid gap-[clamp(36px,7vw,96px)] md:grid-cols-2 md:items-center">
        <VideoSlot
          video={getVideo(courseIntroId(course.id))}
          media={introMedia}
          title={t('facts.introTitle')}
          className="rounded-card-lg aspect-[16/9]"
        />
        <CoursePoints title={t('facts.learnTitle')} keys={course.learnKeys} />
      </div>

      <div className="mt-section grid gap-[clamp(36px,7vw,96px)] md:grid-cols-[minmax(0,1fr)_minmax(280px,0.9fr)] md:items-start">
        <CoursePoints title={t('facts.includesTitle')} keys={course.includesKeys} />
        <aside className="md:sticky md:top-[112px]">
          <ModuleList courseId={course.id} currentIndex={currentLesson} lessons={lessons} />
        </aside>
      </div>
    </div>
  );
}
