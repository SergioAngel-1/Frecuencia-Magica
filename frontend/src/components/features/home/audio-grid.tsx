'use client';

import type { ReactNode } from 'react';

import { Display, EditorialImage, FrequencyDisc, Kicker } from '@/components/ui';
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
    <section className="fm-editorial-full-bleed relative isolate min-h-[clamp(420px,48vw,680px)] overflow-hidden py-[clamp(42px,7vw,88px)]">
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

      <div className="fm-container relative z-20 flex w-full flex-col gap-10">
        <header className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <Kicker tone="teal">{kicker}</Kicker>
            <Display level="h2" size="lg" className="mt-3 max-w-[16ch]">
              {title}
            </Display>
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
