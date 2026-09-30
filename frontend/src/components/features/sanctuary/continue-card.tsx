import { getTranslations } from 'next-intl/server';

import { EditorialImage, GlassPanel, Kicker } from '@/components/ui';
import { ButtonLink } from '@/components/layout';
import type { EditorialMedia } from '@/types/editorial-media';

type ContinueCardProps = {
  media: EditorialMedia;
};

export async function ContinueCard({ media }: ContinueCardProps) {
  const t = await getTranslations('sanctuary');

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
      <div className="flex flex-col gap-3 p-5">
        <Kicker tone="teal" spacing="widest">
          {t('continue.kicker')}
        </Kicker>
        <p className="text-ivory font-serif text-[21px] leading-tight">{t('continue.subtitle')}</p>
        <ButtonLink
          variant="accent"
          size="sm"
          tone="teal"
          className="self-start"
          href={{
            pathname: '/academia/[courseId]/[lessonId]',
            params: { courseId: 'c1', lessonId: '5' },
          }}
        >
          {t('continue.cta')}
        </ButtonLink>
      </div>
    </GlassPanel>
  );
}
