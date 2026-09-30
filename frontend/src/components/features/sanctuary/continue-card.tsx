import { getTranslations } from 'next-intl/server';

import { ButtonLink } from '@/components/layout';
import { EditorialImage, GlassPanel, Kicker, ProgressBar } from '@/components/ui';
import type { ResumeTarget } from '@/lib/sanctuary/profile';
import type { EditorialMedia } from '@/types/editorial-media';

type ContinueCardProps = {
  media: EditorialMedia;
  resume: ResumeTarget;
};

/** Retomar el curso: título, lección actual, avance y un solo botón. */
export async function ContinueCard({ media, resume }: ContinueCardProps) {
  const t = await getTranslations('sanctuary');
  const tAcademy = await getTranslations('academy');
  const courseTitle = tAcademy(`courses.${resume.course.id}.title` as 'courses.c1.title');
  const lessonTitle = tAcademy(`lessonTitles.${resume.titleIndex}` as 'lessonTitles.0');

  return (
    <GlassPanel
      className="flex flex-col overflow-hidden"
      glow
      data-editorial-media="sanctuary.continue"
    >
      <div className="relative aspect-[16/8]">
        <EditorialImage
          aspect="16:8"
          className="h-full"
          focalPoint={media.position}
          media={media}
          overlay={false}
          scrim="bottom"
        />
      </div>
      <div className="flex flex-1 flex-col gap-4 p-5 sm:p-7">
        <Kicker tone="teal" spacing="widest">
          {t('continue.kicker')}
        </Kicker>
        <div>
          <p className="text-ivory font-serif text-[clamp(26px,3vw,34px)] leading-[1.05]">
            {courseTitle}
          </p>
          <p className="text-fg-muted text-meta tracking-ui mt-2 font-sans">
            {t('continue.lesson', {
              number: resume.lessonNumber,
              total: resume.totalLessons,
              title: lessonTitle,
            })}
          </p>
        </div>
        <ProgressBar value={resume.percent} height={5} ariaLabel={t('continue.progress')} />
        <ButtonLink
          variant="accent"
          size="sm"
          tone="teal"
          className="self-start"
          href={{
            pathname: '/academia/[courseId]/[lessonId]',
            params: { courseId: resume.course.id, lessonId: String(resume.lessonNumber) },
          }}
        >
          {t('continue.cta')}
        </ButtonLink>
      </div>
    </GlassPanel>
  );
}
