'use client';

import { animate } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

import { Swap } from '@/components/ui';
import { OrbitalRings } from '@/components/world';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { orbScale, type BreathPhase } from '@/lib/breathing/guide';

type BreathingOrbProps = {
  /** Fase en curso; `null` cuando la guía ha terminado. */
  phase: BreathPhase | null;
  /** Duración de la fase en curso, en segundos. */
  seconds: number;
  /** La indicación visible dentro del orbe («Inhala», «Sostén»…), ya traducida. */
  label: string;
  /** Identidad de la fase (ronda y paso): al cambiar, la indicación y la cuenta se renuevan. */
  phaseKey: string;
};

/** Anillos orbitales de reposo: el mismo lenguaje que el umbral del portal, a escala de tarjeta. */
const RINGS = [
  { r: 340, stroke: 'rgb(var(--halo) / 0.34)' },
  { r: 305, stroke: 'color-mix(in srgb, var(--color-accent-2) 30%, transparent)', dash: '2 9' },
  { r: 270, stroke: 'color-mix(in srgb, var(--color-accent-3) 26%, transparent)' },
] as const;

/** La cuenta atrás de la fase: un segundo por tic, sin bajar de 1. Se renueva con cada fase. */
function Countdown({ seconds }: { seconds: number }) {
  const [left, setLeft] = useState(seconds);

  useEffect(() => {
    const timer = setInterval(() => setLeft((value) => Math.max(1, value - 1)), 1000);

    return () => clearInterval(timer);
  }, []);

  return <span className="text-fg-soft text-body tracking-ui font-sans tabular-nums">{left}</span>;
}

/**
 * El orbe de la guía: una esfera de luz que se hincha al inhalar y al sostener y vuelve al exhalar,
 * con un resplandor que respira con ella y tres anillos orbitales quietos alrededor. La indicación
 * y la cuenta atrás van dentro, centradas y sin escalar: el orbe respira, el texto no.
 *
 * Sólo `transform` y `opacity`. Se anima de forma imperativa: un `initial` de motion no se aplica
 * dentro de la transición de página (`AnimatePresence initial={false}`) y el orbe saltaría a su
 * valor. Aquí anima desde la escala actual, al ritmo de la fase. Con movimiento reducido no se
 * mueve y quedan la indicación y la cuenta.
 */
export function BreathingOrb({ phase, seconds, label, phaseKey }: BreathingOrbProps) {
  const reduced = useReducedMotionSafe();
  const orbRef = useRef<HTMLSpanElement>(null);
  const glowRef = useRef<HTMLSpanElement>(null);
  const scale = reduced ? 1 : orbScale(phase);
  const lit = phase === null || phase === 'exhale' ? 0.5 : 1;
  const duration = reduced || phase === null ? 0.2 : seconds;

  useEffect(() => {
    const orb = orbRef.current;
    const glow = glowRef.current;
    if (!orb || !glow) return;

    const options = { duration, ease: 'easeInOut' } as const;
    const controls = [
      animate(orb, { scale }, options),
      animate(glow, { scale: scale * 1.15, opacity: reduced ? 0.5 : lit }, options),
    ];

    return () => controls.forEach((control) => control.stop());
  }, [scale, lit, duration, reduced]);

  return (
    <div aria-hidden="true" className="relative size-[min(56vw,208px)] flex-none">
      <OrbitalRings
        size={208}
        spin={140}
        className="absolute inset-0"
        style={{ width: '100%', height: '100%' }}
        rings={RINGS}
      />
      <span
        ref={glowRef}
        className="absolute inset-[8%] rounded-full bg-[radial-gradient(closest-side,rgb(var(--halo)/0.30),rgb(var(--halo)/0.08)_62%,transparent)] opacity-50"
      />
      <span
        ref={orbRef}
        className="border-accent/45 shadow-glow-card absolute inset-[20%] rounded-full border bg-[radial-gradient(circle_at_36%_30%,rgb(var(--halo)/0.55),rgb(var(--halo)/0.16)_58%,rgb(var(--halo)/0.06))]"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <Swap id={phaseKey} className="flex flex-col items-center gap-1 text-center">
          <span className="text-fg text-serif-xl font-serif leading-none">{label}</span>
          {phase !== null ? <Countdown seconds={seconds} /> : null}
        </Swap>
      </div>
    </div>
  );
}
