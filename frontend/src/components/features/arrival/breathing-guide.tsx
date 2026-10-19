'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { VideoSlot } from '@/components/features/player/video-slot';
import { Button, Swap } from '@/components/ui';
import { BREATHING } from '@/config/breathing';
import { getVideo } from '@/config/videos';
import { cn } from '@/lib/cn';
import {
  advanceBreath,
  currentBreathPhase,
  initialBreath,
  type BreathPhase,
} from '@/lib/breathing/guide';
import { videoPosterMedia } from '@/lib/video/poster';

import { BreathingOrb } from './breathing-orb';

const PHASE_KEY: Record<BreathPhase, 'inhale' | 'hold' | 'exhale'> = {
  inhale: 'inhale',
  hold: 'hold',
  exhale: 'exhale',
};

/**
 * Guía de respiración compacta: un orbe de luz que crece al inhalar y al sostener y vuelve al
 * exhalar, con los mismos segundos que la indicación (`BREATHING`). La indicación y la cuenta
 * atrás viven dentro del orbe; debajo, un punto por ronda y una línea que acompaña. Se cierra con
 * el control del modal que la aloja; al terminar ofrece «Otra ronda».
 *
 * El video `breathing-guide` (la grabación de Marisol) tiene su espacio en una franja baja: hasta
 * que ella lo entregue dice «Próximamente», sin play. No se promete a nadie en pantalla antes de
 * tiempo.
 */
export function BreathingGuide() {
  const t = useTranslations('arrival.breathing');
  const tVideo = useTranslations('video');
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
  const label = done ? t('finished') : t(PHASE_KEY[current.phase]);
  const round = Math.min(roundIndex + 1, BREATHING.rounds);
  const roundText = t('round', { current: round, total: BREATHING.rounds });

  return (
    <section aria-label={t('intro')} className="flex flex-col items-center gap-4 text-center">
      <BreathingOrb
        phase={current?.phase ?? null}
        seconds={seconds}
        label={label}
        phaseKey={done ? 'done' : `${roundIndex}-${step}`}
      />

      {/* El lector anuncia la fase y la ronda; lo visible (orbe y puntos) es decorativo. */}
      <p aria-live="polite" className="sr-only">
        {done ? t('done') : `${label}. ${roundText}`}
      </p>

      <div aria-hidden="true" className="flex items-center gap-2.5">
        {Array.from({ length: BREATHING.rounds }, (_, index) => (
          <span
            key={index}
            className={cn(
              'size-1.5 rounded-full transition-[background-color,transform] duration-700',
              index < roundIndex || done
                ? 'bg-accent'
                : index === roundIndex
                  ? 'bg-accent scale-150'
                  : 'bg-fg/20',
            )}
          />
        ))}
      </div>

      <div className="flex min-h-[44px] items-center justify-center">
        <Swap id={done ? 'done' : 'intro'}>
          {done ? (
            <Button variant="primary" onClick={() => setState(initialBreath())}>
              {t('again')}
            </Button>
          ) : (
            <p className="text-fg-soft text-meta max-w-measure-narrow leading-relaxed">
              {t('intro')}
            </p>
          )}
        </Swap>
      </div>

      <VideoSlot
        video={getVideo('breathing-guide')}
        media={videoPosterMedia(getVideo('breathing-guide'), {
          alt: tVideo('titles.breathingGuide'),
          sizes: '(min-width: 640px) 392px, 90vw',
        })}
        title={tVideo('titles.breathingGuide')}
        className="rounded-card aspect-[16/5] w-full"
      />
    </section>
  );
}
