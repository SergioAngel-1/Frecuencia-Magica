import { getTranslations } from 'next-intl/server';

import { ButtonLink } from '@/components/layout';
import { EditorialImage, GlassPanel, Kicker, ProgressBar } from '@/components/ui';
import { messageKey } from '@/i18n/keys';
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
  const courseTitle = tAcademy(`courses.${resume.course.id}.title`);
  const lessonTitle = tAcademy(messageKey('academy', `lessonTitles.${resume.titleIndex}`));

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
      {/* El texto se asienta al pie de la tarjeta y deja arriba todo el aire
          para la foto y su fundido. `pt` en % (relativo al ancho, como el alto
          de la foto) es el mínimo: en una tarjeta baja, el texto empieza
          sobre el tramo ya fundido. */}
      <div className="flex flex-1 flex-col justify-end gap-4 p-5 pt-[36%] sm:p-7 sm:pt-[36%]">
        <Kicker tone="teal" spacing="widest">
          {t('continue.kicker')}
        </Kicker>
        <div>
          <p className="text-fg font-serif text-[clamp(26px,3vw,34px)] leading-[1.05]">
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
