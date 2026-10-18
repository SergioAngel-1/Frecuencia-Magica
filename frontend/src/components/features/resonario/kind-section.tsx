import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';

import { EditorialBanner } from '@/components/ui';
import type { AudioKindEntry } from '@/config/audio-kinds';
import type { EditorialMedia } from '@/types/editorial-media';

type KindSectionProps = {
  entry: AudioKindEntry;
  /** Banner del tipo (slot `resonario.kind-banner.*`). */
  banner: EditorialMedia;
  children: ReactNode;
};

/** Un tipo de escucha: su banner, qué es y para qué momento, y sus pistas debajo. */
export function KindSection({ entry, banner, children }: KindSectionProps) {
  const t = useTranslations('resonario');
  const title = t(`kinds.${entry.kind}.title`);

  return (
    <section aria-label={title} className="gap-section flex flex-col" data-kind={entry.kind}>
      <EditorialBanner
        media={banner}
        eyebrow={t('kinds.eyebrow')}
        title={title}
        body={t(`kinds.${entry.kind}.explanation`)}
        heightClassName="min-h-[clamp(220px,26vw,340px)]"
      />
      <div className="fm-editorial-container gap-section flex flex-col">{children}</div>
    </section>
  );
}
