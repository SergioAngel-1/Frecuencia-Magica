'use client';

import { useEffect, useRef, useState } from 'react';

import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { getTuningTiming } from '@/lib/quiz-timing';

type TuningStepProps = {
  tuningLabel: string;
  onFinish: () => void;
};

export function TuningStep({ tuningLabel, onFinish }: TuningStepProps) {
  const [reveal, setReveal] = useState(false);
  const finishedRef = useRef(false);
  const reducedMotion = useReducedMotionSafe();

  useEffect(() => {
    const timing = getTuningTiming(reducedMotion);
    const revealTimer = setTimeout(() => setReveal(true), timing.reveal);
    const finishTimer = setTimeout(() => {
      if (!finishedRef.current) {
        finishedRef.current = true;
        onFinish();
      }
    }, timing.finish);

    return () => {
      clearTimeout(revealTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish, reducedMotion]);

  return (
    <div className="flex flex-col items-center gap-8 pt-[60px]">
      <div
        aria-hidden="true"
        className="relative flex h-[120px] w-[120px] items-center justify-center"
      >
        <div
          className="border-gold/20 absolute inset-0 animate-[fm-spin_4s_linear_infinite] rounded-full border"
          style={{ clipPath: 'inset(0 50% 0 0)' }}
        />
        <div
          className="border-teal/20 absolute inset-[12px] animate-[fm-spin-r_3s_linear_infinite] rounded-full border"
          style={{ clipPath: 'inset(0 0 0 50%)' }}
        />
        <div className="animate-fm-sparkle bg-gold/40 h-[16px] w-[16px] rounded-full" />
      </div>

      <p
        className={`tracking-soft font-serif text-[20px] italic transition-opacity duration-700 ${
          reveal ? 'text-ivory' : 'text-fg-meta'
        }`}
      >
        {tuningLabel}
      </p>
    </div>
  );
}
