import type { ReactNode } from 'react';

import { PageShell } from '@/components/layout';
import { FullBleedSection } from '@/components/ui';
import { Halo, OrbitalRings } from '@/components/world';
import { cn } from '@/lib/cn';
import { mediaSizes } from '@/lib/editorial/media-sizes';
import type { DiscoverPhase } from '@/lib/discover/media';
import type { EditorialMedia } from '@/types/editorial-media';

export { DISCOVER_MEDIA_SLOTS } from '@/lib/discover/media';

type QuizLayoutProps = {
  children: ReactNode;
  media: EditorialMedia;
  phase: DiscoverPhase;
  className?: string;
};

/**
 * Cómo ocupa la imagen cada fase. El resultado crece con su texto: la foto se
 * ancla a su 16:9 en vez de estirarse a toda la sección. La atmósfera de
 * pregunta es la excepción `backdrop` del contrato: cubre la pantalla.
 */
function phaseMode(phase: DiscoverPhase) {
  if (phase === 'questions') return 'portrait' as const;
  if (phase === 'tuning') return 'banner' as const;
  if (phase === 'result') return 'anchored' as const;
  return 'viewport' as const;
}

export function QuizLayout({ children, media, phase, className }: QuizLayoutProps) {
  return (
    <FullBleedSection
      media={media}
      mode={phaseMode(phase)}
      overlay={phase === 'questions' ? 'left' : 'bottom'}
      // Las preguntas leen sobre una atmósfera de bajo contraste que ya trae su
      // aurora: un solo velo, sin el tinte que lo doblaba. En móvil el kicker
      // cae sobre la aurora más clara y el tinte se queda para cumplir AA.
      tint={phase === 'questions' ? 'mobile' : true}
      fade="bottom"
      // El fondo de pregunta y la sintonía cubren la pantalla por encima de su
      // ratio: `sizes` por alto, o el navegador sirve una variante pequeña.
      sizes={
        phase === 'questions' || phase === 'tuning'
          ? mediaSizes('viewport', media.aspect)
          : undefined
      }
      className={cn('fm-editorial-full-bleed fm-editorial-shell', className)}
      contentClassName="flex items-center justify-center"
    >
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-0 z-10 overflow-hidden',
          phase === 'result' && 'opacity-30',
        )}
        data-editorial-geometry="true"
      >
        <Halo
          color="rgba(216,185,120,0.16), rgba(150,198,188,0.08) 55%"
          inset="18%"
          className={cn(phase === 'questions' ? 'opacity-20' : 'opacity-70')}
        />
        {phase !== 'result' ? (
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
        ) : null}
      </div>
      <PageShell
        width={phase === 'result' ? 'narrow' : 'result'}
        padding="centered"
        reserveBottomUi
        className="flex min-h-[clamp(520px,100svh,920px)] flex-col items-center justify-center text-center"
      >
        <div data-editorial-phase={phase} className="w-full">
          {children}
        </div>
      </PageShell>
    </FullBleedSection>
  );
}
