'use client';

import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';

import { Button, Display } from '@/components/ui';
import { BREATHING, BREATHING_CYCLE_SECONDS } from '@/config/breathing';
import {
  advanceBreath,
  currentBreathPhase,
  initialBreath,
  type BreathPhase,
} from '@/lib/breathing/guide';
import { cn } from '@/lib/cn';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';

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
 * Guía de respiración: un orbe que inhala y exhala al ritmo de `BREATHING`, con
 * la indicación en texto. El orbe usa el `breathe` del sistema; con movimiento
 * reducido no escala y sólo quedan las indicaciones.
 *
 * El slot de video `breathing-guide` (la grabación de Marisol) entra en la fase
 * E: hasta entonces no se promete a nadie en pantalla.
 */
export function BreathingGuide({ onClose }: BreathingGuideProps) {
  const t = useTranslations('arrival.breathing');
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

  const done = current === null;
  const label = done ? t('done') : t(PHASE_KEY[current.phase]);
  const round = Math.min(state.round + 1, BREATHING.rounds);

  return (
    <section
      aria-labelledby="breathing-guide-title"
      className="flex flex-col items-center gap-6 text-center"
    >
      <Display level="h3" size="md" id="breathing-guide-title">
        {t('title')}
      </Display>
      <p className="text-fg-soft text-body max-w-[44ch] leading-[1.8]">{t('intro')}</p>

      <div
        aria-hidden="true"
        className="relative flex size-[min(72vw,300px)] items-center justify-center"
      >
        <span
          className={cn(
            'border-accent/40 bg-accent/10 shadow-glow-card absolute inset-0 rounded-full border',
            !reduced && !done && 'animate-fm-breathe',
          )}
          style={
            !reduced && !done ? { animationDuration: `${BREATHING_CYCLE_SECONDS}s` } : undefined
          }
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
    </section>
  );
}
