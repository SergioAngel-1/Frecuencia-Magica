import type { ReactNode } from 'react';

import { MarisolPortrait } from '@/components/features/about/marisol-portrait';
import { Display, Kicker } from '@/components/ui';
import type { EditorialMedia } from '@/types/editorial-media';

type AboutSectionProps = {
  media: EditorialMedia;
  kicker: string;
  title: string;
  p1: string;
  p2: string;
  /** Entrada a la vista interna de Marisol. */
  action?: ReactNode;
  /** El video de bienvenida (`VideoSlot`), bajo el texto. */
  video?: ReactNode;
};

export function AboutSection({ media, kicker, title, p1, p2, action, video }: AboutSectionProps) {
  return (
    <section className="relative">
      <div
        className="pointer-events-none absolute top-[18%] left-[-10%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(150,198,188,0.1),transparent_68%)] blur-3xl"
        aria-hidden="true"
      />
      <div className="fm-container relative grid grid-cols-1 items-center gap-[clamp(36px,8vw,120px)] md:grid-cols-[minmax(260px,0.8fr)_minmax(0,1.2fr)]">
        <MarisolPortrait media={media} className="mx-auto md:mx-0" />

        <div className="max-w-[680px]">
          <Kicker tone="gold" spacing="widest">
            {kicker}
          </Kicker>
          <Display size="md" className="mt-4 max-w-[14ch] leading-[0.98]">
            {title}
          </Display>
          <p className="text-fg-body text-lead mt-7 leading-[1.85]">{p1}</p>
          <p className="text-fg-soft mt-6 max-w-[48ch] font-serif text-[clamp(22px,3vw,34px)] leading-[1.25] font-light italic">
            {p2}
          </p>
          {action ? <div className="mt-9">{action}</div> : null}
        </div>
      </div>
      {video ? (
        <div className="fm-container relative mt-[clamp(36px,6vw,72px)]">{video}</div>
      ) : null}
    </section>
  );
}
