'use client';

import { animate } from 'motion/react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

import { VideoSlot } from '@/components/features/player/video-slot';
import { Button, Display } from '@/components/ui';
import { BREATHING } from '@/config/breathing';
import { getVideo } from '@/config/videos';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import {
  advanceBreath,
  currentBreathPhase,
  initialBreath,
  orbScale,
  type BreathPhase,
} from '@/lib/breathing/guide';
import { videoPosterMedia } from '@/lib/video/poster';

const PHASE_KEY: Record<BreathPhase, 'inhale' | 'hold' | 'exhale'> = {
  inhale: 'inhale',
  hold: 'hold',
  exhale: 'exhale',
};

type BreathingGuideProps = {
  /** Cierra la guía. Sin él no hay control de parar. */
  onClose?: () => void;
};

/**
 * Guía de respiración: un orbe que crece al inhalar y al sostener y vuelve al
 * exhalar, con los mismos segundos que la indicación (`BREATHING`). Sólo escala
 * (transform). Con movimiento reducido no se mueve y quedan las indicaciones.
 *
 * El video `breathing-guide` (la grabación de Marisol) tiene su espacio bajo el
 * orbe: hasta que ella lo entregue dice «Próximamente», sin play. No se promete
 * a nadie en pantalla antes de tiempo.
 */
export function BreathingGuide({ onClose }: BreathingGuideProps) {
  const t = useTranslations('arrival.breathing');
  const tVideo = useTranslations('video');
  const reduced = useReducedMotionSafe();
  const [state, setState] = useState(initialBreath);
  const current = currentBreathPhase(state);
  // El temporizador depende sólo de primitivos: un re-render no reinicia la fase.
  const { round: roundIndex, step } = state;
  const seconds = current?.seconds ?? 0;

  useEffect(() => {
    if (seconds === 0) return;

    const timer = setTimeout(
      () => setState((previous) => advanceBreath(previous, BREATHING.rounds)),
      seconds * 1000,
    );

    return () => clearTimeout(timer);
  }, [roundIndex, step, seconds]);

  // El orbe se anima de forma imperativa: un `initial` de motion no se aplica
  // dentro de la transición de página (`AnimatePresence initial={false}`) y el
  // orbe saltaría a su valor. Aquí anima desde la escala actual, al ritmo de la fase.
  const orbRef = useRef<HTMLSpanElement>(null);
  const orbTarget = reduced ? 1 : orbScale(current?.phase ?? null);
  const orbSeconds = reduced || !current ? 0.2 : current.seconds;

  useEffect(() => {
    const orb = orbRef.current;
    if (!orb) return;

    const controls = animate(
      orb,
      { scale: orbTarget },
      { duration: orbSeconds, ease: 'easeInOut' },
    );

    return () => controls.stop();
  }, [orbTarget, orbSeconds]);

  const done = current === null;
  const label = done ? t('done') : t(PHASE_KEY[current.phase]);
  const round = Math.min(state.round + 1, BREATHING.rounds);

  return (
    <section
      aria-labelledby="breathing-guide-title"
      className="flex flex-col items-center gap-6 text-center"
    >
      <Display level="h3" size="md" id="breathing-guide-title" className="text-fg">
        {t('title')}
      </Display>
      <p className="text-fg-soft text-body max-w-[44ch] leading-[1.8]">{t('intro')}</p>

      <div
        aria-hidden="true"
        className="relative flex size-[min(64vw,260px)] items-center justify-center"
      >
        <span
          ref={orbRef}
          className="border-accent bg-accent/10 shadow-glow-card absolute inset-0 rounded-full border-2"
        />
      </div>

      <p aria-live="polite" className="text-fg text-body tracking-ui font-sans uppercase">
        {label}
      </p>
      <p className="text-fg-meta text-meta tracking-ui font-sans">
        {t('round', { current: round, total: BREATHING.rounds })}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {done ? (
          <Button variant="primary" onClick={() => setState(initialBreath())}>
            {t('again')}
          </Button>
        ) : null}
        {onClose ? (
          <Button variant="ghost" onClick={onClose}>
            {t('stop')}
          </Button>
        ) : null}
      </div>

      <VideoSlot
        video={getVideo('breathing-guide')}
        media={videoPosterMedia(getVideo('breathing-guide'), {
          alt: tVideo('titles.breathingGuide'),
          sizes: '(min-width: 640px) 420px, 90vw',
        })}
        title={tVideo('titles.breathingGuide')}
        className="rounded-card aspect-[16/9] w-full max-w-[420px]"
      />
    </section>
  );
}
