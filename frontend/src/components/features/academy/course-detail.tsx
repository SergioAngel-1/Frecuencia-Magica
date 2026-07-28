'use client';

import { useTranslations } from 'next-intl';

import { Display, Kicker } from '@/components/ui';
import { Link } from '@/i18n/navigation';
import { buildLessons } from '@/lib/academy/lessons';
import type { Course } from '@/types/content';

import { LessonList } from './lesson-list';

type CourseDetailProps = {
  course: Course;
  currentLesson?: number;
};

export function CourseDetail({ course, currentLesson }: CourseDetailProps) {
  const t = useTranslations('academy');
  const lessons = buildLessons(course);

  return (
    <div>
      <Link
        href="/academia" className="font-sans text-[13px] uppercase tracking-[.12em] text-ivory/60 transition-colors hover:text-ivory"
      >
        ← {t('backLabel')}
      </Link>

      <div className="mt-8 grid gap-11 md:grid-cols-[1.5fr_1fr] md:items-start">
        <div>
          <Kicker tone="teal" spacing="widest">
            {t('featuredBadge')}
          </Kicker>
          <Display size="md" level="h1" className="mt-1">
            {t(`courses.${course.id}.title` as 'courses.c1.title')}
          </Display>
          <p className="text-ivory/74 mt-4 max-w-[52ch] text-[15px] leading-[1.8]">
            {t('courseDescription')}
          </p>

          <div
            className="relative mt-8 overflow-hidden rounded-[20px]"
            style={{
              aspectRatio: '16/8',
              backgroundImage: course.band,
            }}
          >
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(70% 100% at 30% 10%, rgba(247,244,234,0.18), transparent 60%)',
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                aria-hidden="true"
                className="flex size-[74px] animate-fm-breathe items-center justify-center rounded-full border border-ivory/60 backdrop-blur-[4px]"
                style={{ background: 'rgba(15,27,46,0.35)' }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="translate-x-[8%] text-ivory">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <LessonList
          courseId={course.id}
          lessons={lessons}
          currentIndex={currentLesson}
        />
      </div>
    </div>
  );
}
