import { getTranslations } from 'next-intl/server';

import { EditorialImage, FrequencyDisc, GlassPanel, Kicker } from '@/components/ui';
import type { EditorialMedia } from '@/types/editorial-media';

type DailyCardProps = {
  media: EditorialMedia;
};

export async function DailyCard({ media }: DailyCardProps) {
  const t = await getTranslations('sanctuary');

  return (
    <GlassPanel
      className="relative isolate flex flex-col items-center gap-3 overflow-hidden p-5 text-center"
      glow
      data-editorial-media="sanctuary.daily"
    >
      <div className="absolute inset-0 -z-10">
        <EditorialImage
          aspect="1:1"
          className="h-full"
          focalPoint={media.position}
          media={media}
          overlay={false}
          scrim="bottom"
        />
      </div>
      <Kicker tone="gold" spacing="widest">
        {t('daily.kicker')}
      </Kicker>
      <p className="text-meta tracking-ui text-fg-soft font-sans">{t('daily.subtitle')}</p>
      <FrequencyDisc
        size="sm"
        hz={432}
        band="linear-gradient(150deg,#16273f,#0a1220)"
        title="432 Hz"
      />
    </GlassPanel>
  );
}
