'use client';

import type { CSSProperties } from 'react';
import { useTranslations } from 'next-intl';
import { div as Mdiv } from 'motion/react-m';

import { Display, Kicker } from '@/components/ui';
import { ATMOSPHERE_SHIFT_TIMING, cssEase, EASE } from '@/config/motion';
import { useFeelingLabel } from '@/hooks/use-feeling-label';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { shiftWaveScale } from '@/lib/atmosphere/veil';
import { useAtmosphereShiftStore } from '@/stores/atmosphere-shift-store';

/**
 * Fracción de `cover` tras la que el fondo del tema nuevo empieza a fundirse por debajo de la
 * onda. Termina justo con ella, así que no hay un tramo de pantalla opaca antes de tiempo.
 */
const WASH_FROM = 0.55;

/**
 * Fracción de `cover` en la que arranca el fundido de la frase; termina cuando termina la
 * cobertura. Al entrar en `hold` la frase ya se lee y nunca queda la pantalla llena y vacía.
 */
const PHRASE_FROM = 0.7;

const ms = (value: number) => `${Math.round(value)}ms`;

/**
 * Velo del cambio de atmósfera: se cruza hacia otra forma de sentir el sitio.
 *
 * - `in`: una onda de la luz del tema nuevo nace donde se pidió el cambio y el fondo del tema
 *   nuevo cubre la pantalla.
 * - `hold`: pantalla cubierta; el tema ya está aplicado debajo y el velo dice su frase (y el
 *   estado del ánimo que lo trajo, si lo hay).
 * - `out`: el velo se disuelve sobre el mundo nuevo.
 *
 * Distinto al portal a propósito: el portal es un umbral de luz hacia la noche; éste es el color
 * del tema nuevo, que se pinta con sus propios tokens (`data-atmosphere` en el velo), no con los
 * del tema que se deja. Sólo se animan `transform` y `opacity`; con movimiento reducido (`quick`)
 * queda un fundido sin onda.
 */
export function AtmosphereShiftVeil() {
  const t = useTranslations('atmospheres');
  const feelingLabel = useFeelingLabel();
  const reduced = useReducedMotionSafe();
  const phase = useAtmosphereShiftStore((state) => state.phase);
  const mode = useAtmosphereShiftStore((state) => state.mode);
  const request = useAtmosphereShiftStore((state) => state.request);
  const origin = useAtmosphereShiftStore((state) => state.origin);

  if (!request || phase === 'idle' || phase === 'confirming') return null;

  const { cover, reveal } = ATMOSPHERE_SHIFT_TIMING[mode];
  const wave = mode === 'full' && !reduced;
  const covering = phase !== 'out';
  const washDelay = wave ? cover * WASH_FROM : 0;
  const phrase = t(`${request.resolved}.phrase`);

  const viewport =
    typeof window === 'undefined'
      ? { width: 1, height: 1 }
      : { width: window.innerWidth, height: window.innerHeight };
  const waveScale = wave ? shiftWaveScale(origin, viewport) : 0;
  const phraseDelay = covering && phase === 'in' ? (cover * PHRASE_FROM) / 1000 : 0;
  const phraseDuration = covering && phase === 'in' ? (cover * (1 - PHRASE_FROM)) / 1000 : 0;

  return (
    <div
      aria-hidden="true"
      data-atmosphere={request.resolved}
      className="z-portal fixed inset-0 overflow-hidden"
    >
      <Mdiv
        className="absolute inset-0 bg-[image:var(--atmo-bg)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: covering ? 1 : 0 }}
        transition={
          covering
            ? { duration: (cover - washDelay) / 1000, delay: washDelay / 1000, ease: 'easeIn' }
            : { duration: reveal / 1000, ease: EASE.soft }
        }
      />

      {wave && covering ? (
        <span
          className="fm-shift-wave"
          style={
            {
              left: `${(origin?.x ?? 0.5) * 100}%`,
              top: `${(origin?.y ?? 0.5) * 100}%`,
              '--shift-wave-scale': String(waveScale),
              animation: `fm-shift-wave ${ms(cover)} ${cssEase(EASE.portal)} both`,
            } as CSSProperties
          }
        />
      ) : null}

      <Mdiv
        className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: covering ? 1 : 0 }}
        transition={
          covering
            ? { duration: phraseDuration, delay: phraseDelay, ease: EASE.soft }
            : { duration: reveal / 1000, ease: EASE.soft }
        }
      >
        <Kicker spacing="widest">
          {request.feeling
            ? t('shift.feeling', { feeling: feelingLabel(request.feeling) })
            : t('shift.kicker')}
        </Kicker>
        <Display level="span" size="md" className="text-fg">
          {phrase}
        </Display>
      </Mdiv>
    </div>
  );
}
