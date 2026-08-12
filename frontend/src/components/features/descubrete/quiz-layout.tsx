import type { ReactNode } from 'react';

import { PageShell } from '@/components/layout';
import { FullBleedSection } from '@/components/ui';
import { Halo, OrbitalRings } from '@/components/world';
import { cn } from '@/lib/cn';
import type { EditorialMedia } from '@/types/editorial-media';

export const DISCOVER_MEDIA_SLOTS = {
  intro: 'discover.hero',
  questions: 'discover.question-atmosphere',
  tuning: 'discover.tuning',
  result: 'discover.result',
} as const;

type QuizLayoutProps = {
  children: ReactNode;
  media: EditorialMedia;
  phase: keyof typeof DISCOVER_MEDIA_SLOTS;
  className?: string;
};

function phaseMode(phase: keyof typeof DISCOVER_MEDIA_SLOTS) {
  if (phase === 'questions') return 'portrait' as const;
  if (phase === 'tuning') return 'banner' as const;
  return 'viewport' as const;
}

export function QuizLayout({ children, media, phase, className }: QuizLayoutProps) {
  return (
    <FullBleedSection
      media={media}
      mode={phaseMode(phase)}
      overlay={phase === 'questions' ? 'left' : 'bottom'}
      className={cn('fm-editorial-full-bleed fm-editorial-shell', className)}
      contentClassName="flex min-h-full items-center justify-center"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
        data-editorial-geometry="true"
      >
        <Halo
          color="rgba(216,185,120,0.16), rgba(150,198,188,0.08) 55%"
          inset="18%"
          className={cn(phase === 'questions' ? 'opacity-40' : 'opacity-70')}
        />
        <OrbitalRings
          size={620}
          spin={phase === 'tuning' ? 80 : 140}
          direction={phase === 'questions' ? 'ccw' : 'cw'}
          className={cn(
            'absolute top-1/2 left-1/2 h-[min(92vw,700px)] w-[min(92vw,700px)] -translate-x-1/2 -translate-y-1/2',
            phase === 'questions' ? 'opacity-25' : 'opacity-45',
          )}
          style={{ width: 'min(92vw, 700px)', height: 'min(92vw, 700px)' }}
          rings={[
            { r: 280, stroke: 'rgba(216,185,120,0.18)' },
            { r: 226, stroke: 'rgba(150,198,188,0.14)', dash: '2 12' },
            { r: 174, stroke: 'rgba(185,176,214,0.14)' },
          ]}
        />
      </div>
      <PageShell
        width="result"
        padding="centered"
        className="flex min-h-[clamp(520px,100svh,920px)] flex-col items-center justify-center text-center"
      >
        <div data-editorial-phase={phase} className="w-full">
          {children}
        </div>
      </PageShell>
    </FullBleedSection>
  );
}
