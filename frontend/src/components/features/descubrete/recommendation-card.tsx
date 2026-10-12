import type { ComponentProps } from 'react';

import { ArrowGlyph, EditorialImage, Kicker } from '@/components/ui';
import { Link } from '@/i18n/navigation';
import type { EditorialMedia } from '@/types/editorial-media';

export type RecommendationCardProps = {
  /** Qué es («Un curso», «Una experiencia»…). */
  kind: string;
  title: string;
  meta: string;
  /**
   * La imagen del propio ítem, resuelta con el mismo slot e instancia que en
   * su realm: el curso, la experiencia y el objeto se ven aquí como allí. Sin
   * foto publicada pinta la banda del ítem.
   */
  media: EditorialMedia;
  href: ComponentProps<typeof Link>['href'];
  openLabel: string;
};

/**
 * Una recomendación de Descúbrete: la imagen del ítem, qué es, su nombre y la
 * puerta para entrar. Sin estado: recibe el texto ya traducido.
 */
export function RecommendationCard({
  kind,
  title,
  meta,
  media,
  href,
  openLabel,
}: RecommendationCardProps) {
  return (
    <Link
      href={href}
      className="group fm-surface rounded-card hover:border-gold/45 focus-visible:ring-gold/60 flex h-full flex-col overflow-hidden transition-colors outline-none focus-visible:ring-2"
    >
      {/* Una sola caja para los tres ratios (16:8, 16:9 y 1:1): el texto va
          debajo, así que la imagen no lleva velo. */}
      <div className="relative aspect-[4/3] shrink-0" data-editorial-media={media.slot}>
        <EditorialImage
          className="h-full"
          focalPoint={media.position}
          media={media}
          overlay={false}
          scrim={false}
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5 text-left">
        <Kicker tone="teal" spacing="wide">
          {kind}
        </Kicker>
        <p className="text-ivory group-hover:text-gold font-serif text-[clamp(22px,2.2vw,26px)] leading-tight transition-colors">
          {title}
        </p>
        <p className="text-fg-meta text-meta tracking-soft font-sans">{meta}</p>
        <span className="text-gold text-label tracking-caps mt-auto inline-flex min-h-11 items-center pt-2 font-sans uppercase">
          {openLabel}
          <ArrowGlyph />
        </span>
      </div>
    </Link>
  );
}
