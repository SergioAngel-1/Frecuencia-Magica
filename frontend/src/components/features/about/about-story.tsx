import { Display, Kicker } from '@/components/ui';
import type { EditorialMedia } from '@/types/editorial-media';

import { MarisolPortrait } from './marisol-portrait';

type AboutStoryProps = {
  media: EditorialMedia;
  kicker: string;
  title: string;
  p1: string;
  p2: string;
  quote: string;
};

/**
 * El camino de Marisol: el relato a la izquierda y el retrato a la derecha,
 * al revés que en el home para que la vista no repita su sección. En móvil
 * el retrato va primero: es a ella a quien se viene a conocer.
 */
export function AboutStory({ media, kicker, title, p1, p2, quote }: AboutStoryProps) {
  return (
    <section className="fm-editorial-full-bleed relative" aria-labelledby="about-story-title">
      <div className="fm-container relative grid grid-cols-1 items-center gap-[clamp(36px,8vw,120px)] md:grid-cols-[minmax(0,1.2fr)_minmax(260px,0.8fr)]">
        <MarisolPortrait media={media} className="mx-auto md:order-last md:mx-0 md:ml-auto" />

        <div className="max-w-[680px]">
          <Kicker tone="gold" spacing="widest">
            {kicker}
          </Kicker>
          <Display id="about-story-title" size="md" className="mt-4 max-w-[18ch]">
            {title}
          </Display>
          <p className="text-fg-body text-lead mt-7 max-w-[60ch] leading-[1.85]">{p1}</p>
          <p className="text-fg-body text-body mt-5 max-w-[60ch] leading-[1.8]">{p2}</p>
          <blockquote className="border-accent/30 text-fg-soft mt-9 max-w-[30ch] border-t pt-7 font-serif text-[clamp(22px,3vw,34px)] leading-[1.25] font-light italic">
            {quote}
          </blockquote>
        </div>
      </div>
    </section>
  );
}
