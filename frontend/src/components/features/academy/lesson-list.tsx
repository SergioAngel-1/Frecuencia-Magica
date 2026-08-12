'use client';

import { useTranslations } from 'next-intl';

import { GlassPanel } from '@/components/ui';
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
    <GlassPanel radius={22} className="px-[22px] py-[22px]">
      <p className="font-sans text-[11px] uppercase tracking-[.3em] text-gold">
        {t('courseContent')}
      </p>

      <div className="mt-4 flex flex-col gap-2">
        {lessons.map((lesson, i) => {
          const isCurrent = currentIndex === i;
          const isCompleted = currentIndex !== undefined && i < currentIndex;
          return (
            <Link
              key={lesson.number}
              href={{ pathname: '/academia/[courseId]/[lessonId]', params: { courseId, lessonId: String(lesson.index + 1) } }}
              className={cn(
                'flex w-full items-center gap-3 rounded-[12px] px-[14px] py-[13px] transition-colors',
                isCurrent
                  ? 'bg-gold/10 text-ivory'
                  : 'hover:bg-ivory/4 text-ivory/80 hover:text-ivory',
              )}
            >
              <span
                className={cn(
                  'flex size-[30px] shrink-0 items-center justify-center rounded-full font-serif text-[14px]',
                  isCompleted
                    ? 'bg-gold/20 text-gold'
                    : isCurrent
                      ? 'border border-gold text-gold'
                      : 'border border-ivory/20 text-ivory/55',
                )}
              >
                {isCompleted ? '✓' : lesson.number}
              </span>
              <span className="flex-1 font-serif text-[18px] leading-[1.2]">
                {lesson.number}. {t(`lessonTitles.${lesson.titleIndex}` as 'lessonTitles.0')}
              </span>
              <span className="font-sans text-[11px] tracking-[.06em] text-ivory/55">
                {lesson.duration}
              </span>
            </Link>
          );
        })}
      </div>
    </GlassPanel>
  );
}
