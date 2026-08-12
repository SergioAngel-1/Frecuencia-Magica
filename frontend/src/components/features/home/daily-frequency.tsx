'use client';

import { FrequencyDisc, EditorialImage } from '@/components/ui';
import { usePlayerStore } from '@/stores/player-store';
import { cn } from '@/lib/cn';
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
    <section className="relative isolate min-h-[clamp(360px,42vw,620px)] overflow-hidden">
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

      <div className="relative z-20 grid min-h-[clamp(360px,42vw,620px)] w-full grid-cols-1 items-center gap-8 px-6 py-12 sm:px-[8vw] md:grid-cols-[minmax(220px,0.8fr)_minmax(0,1fr)] md:gap-[clamp(34px,7vw,110px)] md:py-[clamp(44px,7vw,90px)]">
        <div className="mx-auto w-full max-w-[380px] md:mx-0">
          <FrequencyDisc size="lg" hz={hz} band={band} active={isActive} floatDuration="8s" />
        </div>

        <div className="max-w-[620px]">
          <p className="text-gold font-sans text-[11px] tracking-[.3em] uppercase">{kicker}</p>
          <h2 className="text-ivory mt-3 max-w-[12ch] font-serif text-[clamp(34px,5vw,72px)] leading-[0.98] font-light">
            {title}
          </h2>
          <p className="text-ivory/84 mt-5 max-w-[48ch] text-[17px] leading-[1.75]">
            {description}
          </p>
          <div className="mt-6 flex min-h-11 items-center gap-4">
            <button
              type="button"
              aria-pressed={isActive}
              onClick={() => open(audioId)}
              className={cn(
                'border-gold/60 text-gold focus-visible:ring-gold inline-flex min-h-11 items-center border-b pb-1 font-sans text-[11px] tracking-[.18em] uppercase outline-none focus-visible:ring-2',
                isActive && 'bg-[rgba(216,185,120,0.04)]',
              )}
            >
              {cta}
              <span aria-hidden="true" className="ml-3 text-[18px] leading-none">
                →
              </span>
            </button>
            <span className="text-ivory/65 font-sans text-[13px] tracking-[.08em]">{meta}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
