'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { Collapse, Float, GlassPanel, Kicker } from '@/components/ui';
import type { Lesson } from '@/lib/academy/lessons';
import { cn } from '@/lib/cn';
import { groupIntoModules, MODULE_SIZE } from '@/lib/academy/modules';

import { LessonList } from './lesson-list';

type ModuleListProps = {
  courseId: string;
  lessons: readonly Lesson[];
  /** Lección en curso (índice desde 0): su módulo arranca abierto y ella, marcada. */
  currentIndex?: number;
};

/**
 * El contenido del curso en módulos plegables. El panel abre y cierra con la
 * fila de rejilla `0fr` → `1fr` (como las secciones de producto), no animando
 * `height`; cerrado queda `inert` y fuera del árbol de accesibilidad.
 */
export function ModuleList({ courseId, lessons, currentIndex }: ModuleListProps) {
  const t = useTranslations('academy');
  const modules = groupIntoModules(lessons, MODULE_SIZE);
  const [openModule, setOpenModule] = useState<number | null>(
    modules.find((m) => m.lessons.some((lesson) => lesson.index === currentIndex))?.number ?? 1,
  );

  return (
    <nav aria-label={t('courseContent')}>
      <Float>
        <GlassPanel as="section" radius={22} className="px-5 py-6 sm:px-6">
          <Kicker tone="gold">{t('courseContent')}</Kicker>

          <div className="mt-4" data-course-modules>
            {modules.map((module) => {
              const isOpen = openModule === module.number;
              const bodyId = `course-module-${module.number}`;

              return (
                <div key={module.number} className="border-line border-t first:border-t-0">
                  <button
                    type="button"
                    onClick={() => setOpenModule(isOpen ? null : module.number)}
                    aria-expanded={isOpen}
                    aria-controls={bodyId}
                    className="flex min-h-11 w-full items-center justify-between gap-4 py-3 text-left"
                  >
                    <span className="flex flex-col">
                      <span className="text-fg text-serif-md font-serif leading-tight">
                        {t('facts.module', { number: module.number })}
                      </span>
                      <span className="text-fg-meta text-meta tracking-soft font-sans">
                        {t('facts.moduleLessons', { count: module.lessons.length })}
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className={cn(
                        'text-accent text-serif-lg shrink-0 font-serif leading-none transition-transform duration-300 motion-reduce:transition-none',
                        isOpen && 'rotate-45',
                      )}
                    >
                      +
                    </span>
                  </button>

                  <Collapse id={bodyId} open={isOpen} data-course-module-panel={module.number}>
                    <LessonList
                      courseId={courseId}
                      lessons={module.lessons}
                      currentIndex={currentIndex}
                    />
                  </Collapse>
                </div>
              );
            })}
          </div>
        </GlassPanel>
      </Float>
    </nav>
  );
}
