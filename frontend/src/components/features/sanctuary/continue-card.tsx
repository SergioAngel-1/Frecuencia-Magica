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
      className="relative isolate flex flex-col overflow-hidden"
      glow
      data-editorial-media="sanctuary.continue"
    >
      {/* Como la frecuencia del día: la foto se ancla arriba a su 16:8 y funde
          en la noche de la tarjeta en vez de cortarse; el texto entra sobre
          su tramo fundido, donde el scrim ya le da contraste. */}
      <div className="absolute inset-x-0 top-0 -z-10 aspect-[16/8]">
        <EditorialImage
          aspect="16:8"
          className="h-full"
          fade="bottom"
          focalPoint={media.position}
          media={media}
          overlay={false}
          scrim="bottom"
        />
      </div>
      {/* `pt` en %: relativo al ancho, como el alto de la foto (la mitad). */}
      <div className="flex flex-1 flex-col gap-4 p-5 pt-[36%] sm:p-7 sm:pt-[36%]">
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
