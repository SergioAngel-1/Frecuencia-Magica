'use client';

import { useTranslations } from 'next-intl';

import { messageKey } from '@/i18n/keys';
import { Link } from '@/i18n/navigation';
import type { Lesson } from '@/lib/academy/lessons';
import { cn } from '@/lib/cn';

type LessonListProps = {
  courseId: string;
  lessons: readonly Lesson[];
  currentIndex?: number;
};

/** Las lecciones de un módulo, cada una un enlace a su página. */
export function LessonList({ courseId, lessons, currentIndex }: LessonListProps) {
  const t = useTranslations('academy');

  return (
    <ol className="flex flex-col gap-1 pb-3">
      {lessons.map((lesson) => {
        const isCurrent = currentIndex === lesson.index;
        const isCompleted = currentIndex !== undefined && lesson.index < currentIndex;
        return (
          <li key={lesson.number}>
            <Link
              href={{
                pathname: '/academia/[courseId]/[lessonId]',
                params: { courseId, lessonId: String(lesson.index + 1) },
              }}
              aria-current={isCurrent ? 'page' : undefined}
              className={cn(
                'flex min-h-11 w-full items-center gap-3 px-3 py-2.5 transition-colors',
                isCurrent ? 'bg-accent/10 text-fg' : 'text-fg-soft hover:bg-fg/4 hover:text-fg',
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  'text-body flex size-8 shrink-0 items-center justify-center rounded-full font-serif',
                  isCompleted
                    ? 'bg-accent/20 text-accent'
                    : isCurrent
                      ? 'border-accent text-accent border'
                      : 'border-fg/20 text-fg-meta border',
                )}
              >
                {isCompleted ? '✓' : lesson.number}
              </span>
              <span className="min-w-0 flex-1 font-serif text-[18px] leading-[1.2]">
                {lesson.number}. {t(messageKey('academy', `lessonTitles.${lesson.titleIndex}`))}
              </span>
              <span className="text-fg-meta text-label tracking-soft shrink-0 font-sans">
                {lesson.duration}
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
