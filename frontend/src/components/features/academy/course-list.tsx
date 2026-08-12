import { useTranslations } from 'next-intl';

import { COURSES } from '@/data';
import { Link } from '@/i18n/navigation';
import type { EditorialMedia } from '@/types/editorial-media';

import { CourseCard } from './course-card';

export type AcademyMedia = {
  hero: EditorialMedia;
  featuredCourse: EditorialMedia;
  courseCover: EditorialMedia;
};

export function CourseList({ media }: { media: AcademyMedia }) {
  const t = useTranslations('academy');
  const featured = COURSES[0]!;
  const others = COURSES.slice(1);

  const courseTitle = (course: (typeof COURSES)[number]) =>
    t(`courses.${course.id}.title` as 'courses.c1.title');
  const level = (course: (typeof COURSES)[number]) =>
    t(course.levelKey.replace('academy.', '') as 'levels.foundations');
  const courseMedia = (course: (typeof COURSES)[number]): EditorialMedia => ({
    ...media.courseCover,
    alt: t('media.alt.courseCover', { title: courseTitle(course) }),
  });

  return (
    <div>
      <Link
        href={{ pathname: '/academia/[courseId]', params: { courseId: featured.id } }}
        className="group text-ivory hover:text-gold mb-[clamp(42px,7vw,90px)] block min-h-11 transition-colors"
      >
        <CourseCard
          course={featured}
          cta={t('featuredCta')}
          description={t('featuredDescription')}
          level={level(featured)}
          lessonsLabel={`${t('lessonsCount', { count: featured.lessons })} · ${featured.hours}`}
          media={media.featuredCourse}
          title={courseTitle(featured)}
          featured
        />
      </Link>

      <section data-editorial-archive="true" aria-labelledby="academy-archive-title">
        <div className="mb-7 max-w-[58ch]">
          <p className="text-teal font-sans text-[11px] tracking-[.3em] uppercase">
            {t('archive.kicker')}
          </p>
          <h2
            id="academy-archive-title"
            className="text-ivory mt-3 font-serif text-[clamp(32px,4vw,54px)] leading-[0.98]"
          >
            {t('archive.title')}
          </h2>
          <p className="text-ivory/72 mt-4 text-[16px] leading-[1.7]">{t('archive.description')}</p>
        </div>

        <div className="grid gap-x-6 gap-y-8 md:grid-cols-2">
          {others.map((course) => (
            <Link
              key={course.id}
              href={{ pathname: '/academia/[courseId]', params: { courseId: course.id } }}
              className="text-ivory hover:text-gold block min-h-11 transition-colors"
            >
              <CourseCard
                course={course}
                level={level(course)}
                lessonsLabel={`${t('lessonsCount', { count: course.lessons })} · ${course.hours}`}
                media={courseMedia(course)}
                title={courseTitle(course)}
              />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
