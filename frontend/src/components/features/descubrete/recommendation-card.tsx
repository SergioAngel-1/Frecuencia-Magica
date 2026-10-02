import type { ComponentProps } from 'react';

import { ArrowGlyph, Band, Kicker } from '@/components/ui';
import { Link } from '@/i18n/navigation';

export type RecommendationCardProps = {
  /** Qué es («Un curso», «Una experiencia»…). */
  kind: string;
  title: string;
  meta: string;
  /** Gradiente del ítem del catálogo: su identidad mientras no hay foto. */
  band: string;
  href: ComponentProps<typeof Link>['href'];
  openLabel: string;
};

/**
 * Una recomendación de Descúbrete: la banda del ítem, qué es, su nombre y la
 * puerta para entrar. Sin estado: recibe el texto ya traducido.
 */
export function RecommendationCard({
  kind,
  title,
  meta,
  band,
  href,
  openLabel,
}: RecommendationCardProps) {
  return (
    <Link
      href={href}
      className="group fm-surface rounded-card hover:border-gold/45 focus-visible:ring-gold/60 flex h-full flex-col overflow-hidden transition-colors outline-none focus-visible:ring-2"
    >
      <Band aspect="16/8" gradient={band} overlay="bottom" />
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
