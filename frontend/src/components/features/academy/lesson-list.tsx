'use client';

import { useTranslations } from 'next-intl';

import { GlassPanel, Kicker } from '@/components/ui';
import { Link } from '@/i18n/navigation';
import type { Lesson } from '@/lib/academy/lessons';
import { cn } from '@/lib/cn';

type LessonListProps = {
  courseId: string;
  lessons: Lesson[];
  currentIndex?: number;
};

export function LessonList({ courseId, lessons, currentIndex }: LessonListProps) {
  const t = useTranslations('academy');

  return (
    <nav aria-label={t('courseContent')}>
      <GlassPanel as="section" radius={22} className="px-5 py-6 sm:px-6">
        <Kicker tone="gold">{t('courseContent')}</Kicker>

        <ol className="mt-4 flex flex-col gap-1">
          {lessons.map((lesson, i) => {
            const isCurrent = currentIndex === i;
            const isCompleted = currentIndex !== undefined && i < currentIndex;
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
                    isCurrent
                      ? 'bg-gold/10 text-ivory'
                      : 'text-fg-soft hover:bg-ivory/4 hover:text-ivory',
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      'text-body flex size-8 shrink-0 items-center justify-center rounded-full font-serif',
                      isCompleted
                        ? 'bg-gold/20 text-gold'
                        : isCurrent
                          ? 'border-gold text-gold border'
                          : 'border-ivory/20 text-fg-meta border',
                    )}
                  >
                    {isCompleted ? '✓' : lesson.number}
                  </span>
                  <span className="min-w-0 flex-1 font-serif text-[18px] leading-[1.2]">
                    {lesson.number}. {t(`lessonTitles.${lesson.titleIndex}` as 'lessonTitles.0')}
                  </span>
                  <span className="text-fg-meta text-label tracking-soft shrink-0 font-sans">
                    {lesson.duration}
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </GlassPanel>
    </nav>
  );
}
