'use client';

import {
  Display,
  EditorialImage,
  FrequencyDisc,
  Kicker,
  ArrowGlyph,
  arrowLinkClasses,
} from '@/components/ui';
import { usePlayerStore } from '@/stores/player-store';
import type { EditorialMedia } from '@/types/editorial-media';

type DailyFrequencyProps = {
  media: EditorialMedia;
  hz: number;
  band: string;
  audioId: string;
  kicker: string;
  title: string;
  description: string;
  meta: string;
  cta: string;
};

export function DailyFrequency({
  media,
  hz,
  band,
  audioId,
  kicker,
  title,
  description,
  meta,
  cta,
}: DailyFrequencyProps) {
  const open = usePlayerStore((s) => s.open);
  const activeId = usePlayerStore((s) => s.audioId);
  const isActive = activeId === audioId;
  const dailyMedia = media;

  return (
    <section className="fm-editorial-full-bleed relative isolate min-h-[clamp(360px,42vw,620px)] overflow-hidden">
      <div className="absolute inset-0">
        <EditorialImage
          media={dailyMedia}
          aspect="16:8"
          className="h-full"
          focalPoint="50% 50%"
          scrim="bottom"
          overlay="bottom"
        />
      </div>

      <div className="fm-container relative z-20 grid min-h-[clamp(360px,42vw,620px)] w-full grid-cols-1 items-center gap-8 py-12 md:grid-cols-[minmax(220px,0.8fr)_minmax(0,1fr)] md:gap-[clamp(34px,7vw,110px)] md:py-[clamp(44px,7vw,90px)]">
        <div className="mx-auto w-full max-w-[380px] md:mx-0">
          <FrequencyDisc size="lg" hz={hz} band={band} active={isActive} floatDuration="8s" />
        </div>

        <div className="max-w-[620px]">
          <Kicker tone="gold">{kicker}</Kicker>
          <Display level="h2" size="lg" className="mt-3 max-w-[12ch]">
            {title}
          </Display>
          <p className="text-fg-body text-lead mt-5 max-w-[48ch] leading-[1.75]">{description}</p>
          <div className="mt-6 flex min-h-11 items-center gap-4">
            <button
              type="button"
              aria-pressed={isActive}
              onClick={() => open(audioId)}
              className={arrowLinkClasses('gold', isActive && 'bg-gold/4')}
            >
              {cta}
              <ArrowGlyph />
            </button>
            <span className="text-fg-soft text-meta tracking-ui font-sans">{meta}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
