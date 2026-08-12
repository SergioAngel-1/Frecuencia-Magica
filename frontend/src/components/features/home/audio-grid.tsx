'use client';

import type { ReactNode } from 'react';

import { EditorialImage, FrequencyDisc } from '@/components/ui';
import { usePlayerStore } from '@/stores/player-store';
import type { EditorialMedia } from '@/types/editorial-media';

type AudioItem = {
  id: string;
  hz: number;
  band: string;
  title: string;
  meta: string;
};

type AudioGridProps = {
  media: EditorialMedia;
  kicker: string;
  title: string;
  action?: ReactNode;
  audios: AudioItem[];
};

export function AudioGrid({ media, kicker, title, action, audios }: AudioGridProps) {
  const open = usePlayerStore((s) => s.open);
  const activeId = usePlayerStore((s) => s.audioId);
  const audioMedia = media;

  return (
    <section className="relative isolate min-h-[clamp(420px,48vw,680px)] overflow-hidden py-[clamp(42px,7vw,88px)]">
      <div className="absolute inset-0">
        <EditorialImage
          media={audioMedia}
          aspect="16:9"
          className="h-full opacity-[0.78]"
          focalPoint="50% 40%"
          scrim="bottom"
          overlay={false}
        />
      </div>

      <div className="relative z-20 mx-auto flex w-full max-w-[1280px] flex-col gap-10 px-6 sm:px-[8vw]">
        <header className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-teal font-sans text-[11px] tracking-[.3em] uppercase">{kicker}</p>
            <h2 className="text-ivory mt-3 max-w-[16ch] font-serif text-[clamp(34px,5vw,68px)] leading-[0.98] font-light">
              {title}
            </h2>
          </div>
          {action ? <div className="min-h-11">{action}</div> : null}
        </header>

        <div className="flex flex-col items-center justify-between gap-10 sm:flex-row sm:items-end sm:gap-4 lg:gap-8">
          {audios.slice(0, 4).map((audio) => (
            <div key={audio.id} className="w-full max-w-[220px] flex-1">
              <FrequencyDisc
                size="md"
                hz={audio.hz}
                band={audio.band}
                title={audio.title}
                meta={audio.meta}
                active={activeId === audio.id}
                showEqualizer
                showPlay
                floatDuration="7s"
                ariaLabel={`${audio.title} — ${audio.hz} Hz — ${audio.meta}`}
                onClick={() => open(audio.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
