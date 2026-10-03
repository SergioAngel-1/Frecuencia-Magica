'use client';

import type { ReactNode } from 'react';

import { AudioDisc } from '@/components/features/player/audio-disc';
import {
  FrequencyStrip,
  type FrequencyStripItem,
} from '@/components/features/player/frequency-strip';
import { Display, EditorialImage, Kicker, ArrowGlyph, arrowLinkClasses } from '@/components/ui';
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
  /** La resonario, como subsección: más frecuencias bajo la de hoy. */
  resonario: {
    kicker: string;
    title: string;
    /** Enlace «Ver todo». */
    action: ReactNode;
    audios: readonly FrequencyStripItem[];
  };
};

/**
 * La frecuencia del día y, debajo y dentro de la misma banda, una muestra de
 * el resonario. Una sola sección con dos niveles: el disco grande y su
 * titular mandan; la hilera de discos pequeños es su continuación.
 */
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
  resonario,
}: DailyFrequencyProps) {
  const open = usePlayerStore((s) => s.open);
  const activeId = usePlayerStore((s) => s.audioId);
  const isActive = activeId === audioId;

  return (
    <section
      aria-labelledby="home-daily-title"
      // Sin `overflow-hidden`: el aura del disco es más grande que la banda y
      // debe poder derramarse sobre el aire de arriba. La foto se recorta en
      // su propia capa.
      className="fm-editorial-full-bleed relative isolate"
    >
      <div className="absolute inset-0 overflow-hidden">
        <EditorialImage
          media={media}
          aspect="16:8"
          className="h-full"
          focalPoint="50% 50%"
          scrim="bottom"
          overlay="bottom"
        />
      </div>

      <div className="fm-container py-block relative z-20 w-full">
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-[minmax(220px,0.8fr)_minmax(0,1fr)] md:gap-[clamp(34px,7vw,110px)]">
          <div className="mx-auto w-full max-w-[380px] md:mx-0">
            <AudioDisc
              audio={{ id: audioId, hz, band }}
              title={title}
              meta={meta}
              size="lg"
              caption={false}
              showPlay
              showEqualizer
              floatDuration="8s"
            />
          </div>

          <div className="max-w-[620px]">
            <Kicker tone="gold">{kicker}</Kicker>
            <Display level="h2" size="lg" id="home-daily-title" className="mt-3 max-w-[16ch]">
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

        <section
          aria-labelledby="home-resonario-title"
          className="border-ivory/10 mt-block pt-block border-t"
        >
          <header className="mb-10 flex flex-wrap items-end justify-between gap-x-5 gap-y-2">
            <div>
              <Kicker tone="teal">{resonario.kicker}</Kicker>
              <Display level="h3" size="sm" id="home-resonario-title" className="mt-2">
                {resonario.title}
              </Display>
            </div>
            {resonario.action}
          </header>
          <FrequencyStrip items={resonario.audios} label={resonario.kicker} size="sm" />
        </section>
      </div>
    </section>
  );
}
