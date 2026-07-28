import { useTranslations } from 'next-intl';

import { COURSES } from '@/data';
import { Link } from '@/i18n/navigation';

import { CourseCard } from './course-card';

export function CourseList() {
  const t = useTranslations('academy');
  const featured = COURSES[0]!;
  const others = COURSES.slice(1);

  function levelKey(full: string) {
    return full.split('.').slice(1).join('.') as 'levels.foundations';
  }

  return (
    <div>
      <Link
        href={{ pathname: '/academia/[courseId]', params: { courseId: featured.id } }}
        className="mb-6 block text-ivory transition-colors hover:text-gold"
      >
        <CourseCard
          course={featured}
          title={t(`courses.${featured.id}.title` as 'courses.c1.title')}
          level={t(levelKey(featured.levelKey))}
          lessonsLabel={t('lessonsCount', { count: featured.lessons })}
          featured
        />
      </Link>

      <h2 className="font-sans text-[11px] uppercase tracking-[.3em] text-ivory/55 mb-5">
        {t('allCourses')}
      </h2>

      <div className="grid gap-6 md:grid-cols-2">
        {others.map((course) => (
          <Link
            key={course.id}
            href={{ pathname: '/academia/[courseId]', params: { courseId: course.id } }}
            className="block text-ivory transition-colors hover:text-gold"
          >
            <CourseCard
              course={course}
              title={t(`courses.${course.id}.title` as 'courses.c1.title')}
              level={t(levelKey(course.levelKey))}
              lessonsLabel={t('lessonsCount', { count: course.lessons })}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
