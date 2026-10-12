import { useTranslations } from 'next-intl';

import { Display, EditorialImage, Float, Kicker } from '@/components/ui';
import { COURSES } from '@/data';
import { Link } from '@/i18n/navigation';
import type { EditorialMedia } from '@/types/editorial-media';

import { CourseCard } from './course-card';

export type AcademyMedia = {
  hero: EditorialMedia;
  featuredCourse: EditorialMedia;
  courseCovers: Record<string, EditorialMedia>;
};

type CourseRowProps = {
  course: (typeof COURSES)[number];
  title: string;
  level: string;
  lessonsLabel: string;
  media: EditorialMedia;
  /** Posición en el archivo: desfasa el flotado de su portada. */
  order: number;
};

function CourseRow({ course, title, level, lessonsLabel, media, order }: CourseRowProps) {
  return (
    <Link
      href={{ pathname: '/academia/[courseId]', params: { courseId: course.id } }}
      className="group text-ivory hover:text-gold border-gold/20 grid min-h-11 gap-5 border-b py-5 transition-colors md:grid-cols-[minmax(180px,0.8fr)_minmax(0,1.2fr)] md:items-center md:gap-8"
    >
      {/* Flota la portada, no la fila: las filas comparten sus líneas divisorias. */}
      <Float order={order} className="rounded-card relative aspect-[16/8] overflow-hidden">
        <EditorialImage aspect="16:8" className="h-full" media={media} />
      </Float>
      <div className="flex min-h-11 flex-col justify-center">
        <p className="text-teal text-label tracking-caps font-sans uppercase">{level}</p>
        <h3 className="mt-2 font-serif text-[clamp(26px,3vw,40px)] leading-[1.02]">{title}</h3>
        <p className="text-fg-muted text-meta tracking-soft mt-3 font-sans">{lessonsLabel}</p>
      </div>
    </Link>
  );
}

export function CourseList({ media }: { media: AcademyMedia }) {
  const t = useTranslations('academy');
  const featured = COURSES[0]!;
  const others = COURSES.slice(1);

  const courseTitle = (course: (typeof COURSES)[number]) =>
    t(`courses.${course.id}.title` as 'courses.c1.title');
  const level = (course: (typeof COURSES)[number]) =>
    t(course.levelKey.replace('academy.', '') as 'levels.foundations');
  const courseMedia = (course: (typeof COURSES)[number]): EditorialMedia => ({
    ...media.courseCovers[course.id]!,
    alt: t('media.alt.courseCover', { title: courseTitle(course) }),
    band: course.band,
  });

  return (
    <div>
      <Float className="mb-section">
        <Link
          href={{ pathname: '/academia/[courseId]', params: { courseId: featured.id } }}
          className="group text-ivory hover:text-gold block min-h-11 transition-colors"
        >
          <CourseCard
            course={featured}
            cta={t('featuredCta')}
            description={t('featuredDescription')}
            level={level(featured)}
            lessonsLabel={`${t('lessonsCount', { count: featured.lessons })} · ${featured.hours}`}
            media={{ ...media.featuredCourse, band: featured.band }}
            title={courseTitle(featured)}
            featured
          />
        </Link>
      </Float>

      <section data-editorial-archive="true" aria-labelledby="academy-archive-title">
        <div className="mb-7 max-w-[58ch]">
          <Kicker tone="teal">{t('archive.kicker')}</Kicker>
          <Display level="h2" size="md" id="academy-archive-title" className="mt-3">
            {t('archive.title')}
          </Display>
          <p className="text-fg-soft mt-4 text-[16px] leading-[1.7]">{t('archive.description')}</p>
        </div>

        <div>
          {others.map((course, index) => (
            <CourseRow
              key={course.id}
              order={index + 1}
              course={course}
              level={level(course)}
              lessonsLabel={`${t('lessonsCount', { count: course.lessons })} · ${course.hours}`}
              media={courseMedia(course)}
              title={courseTitle(course)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
