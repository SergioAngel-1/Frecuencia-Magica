import { useTranslations } from 'next-intl';

import { EditorialImage, Kicker } from '@/components/ui';
import type { EditorialMedia } from '@/types/editorial-media';

type CelticFeatureProps = {
  /** Foto de la pieza (slot `resonario.celtic`). */
  media: EditorialMedia;
};

const PARAGRAPHS = ['p1', 'p2', 'p3', 'p4', 'p5'] as const;

/**
 * La pieza celta, destacada dentro de melodías. Su texto es el que escribió
 * Marisol, tal cual en español; la traducción inglesa espera su aprobación.
 */
export function CelticFeature({ media }: CelticFeatureProps) {
  const t = useTranslations('resonario.celtic');

  return (
    <article
      className="grid items-center gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]"
      data-featured-piece="celtic"
    >
      {/* La proporción la da el contenedor: la imagen llena su altura. */}
      <div className="rounded-card relative aspect-video overflow-hidden">
        <EditorialImage media={media} aspect="16:9" overlay={false} className="h-full" />
      </div>
      <div className="flex flex-col gap-4">
        <Kicker>{t('kicker')}</Kicker>
        <h3 className="text-fg text-lead font-serif leading-tight">{t('heading')}</h3>
        {PARAGRAPHS.map((key) => (
          <p key={key} className="text-fg-body text-body font-light">
            {t(key)}
          </p>
        ))}
        <p className="text-fg text-lead font-serif italic">{t('closing')}</p>
      </div>
    </article>
  );
}
