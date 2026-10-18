import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';

import { EditorialBanner } from '@/components/ui';
import type { AudioKindEntry } from '@/config/audio-kinds';
import { cn } from '@/lib/cn';
import type { EditorialMedia } from '@/types/editorial-media';

type KindSectionProps = {
  entry: AudioKindEntry;
  /** Banner del tipo (slot `resonario.kind-banner.*`). */
  banner: EditorialMedia;
  /**
   * Diferir el render cuando la sección queda fuera de pantalla (`fm-defer-render`).
   * La primera sección visible no se difiere.
   */
  deferRender?: boolean;
  children: ReactNode;
};

/** Un tipo de escucha: su banner, qué es y para qué momento, y sus pistas debajo. */
export function KindSection({ entry, banner, deferRender = false, children }: KindSectionProps) {
  const t = useTranslations('resonario');
  const title = t(`kinds.${entry.kind}.title`);

  return (
    <section
      aria-label={title}
      className={cn('gap-section flex flex-col', deferRender && 'fm-defer-render')}
      data-kind={entry.kind}
    >
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
