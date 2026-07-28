'use client';

import { useEffect, useRef, useState } from 'react';

type TuningStepProps = {
  tuningLabel: string;
  onFinish: () => void;
};

export function TuningStep({ tuningLabel, onFinish }: TuningStepProps) {
  const [reveal, setReveal] = useState(false);
  const finishedRef = useRef(false);

  useEffect(() => {
    const revealTimer = setTimeout(() => setReveal(true), 1800);
    const finishTimer = setTimeout(() => {
      if (!finishedRef.current) {
        finishedRef.current = true;
        onFinish();
      }
    }, 3000);

    return () => {
      clearTimeout(revealTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div className="flex flex-col items-center gap-8 pt-[60px]">
      <div
        aria-hidden="true"
        className="relative flex h-[120px] w-[120px] items-center justify-center"
      >
        <div
          className="absolute inset-0 animate-[fm-spin_4s_linear_infinite] rounded-full border border-gold/20"
          style={{ clipPath: 'inset(0 50% 0 0)' }}
        />
        <div
          className="absolute inset-[12px] animate-[fm-spin-r_3s_linear_infinite] rounded-full border border-teal/20"
          style={{ clipPath: 'inset(0 0 0 50%)' }}
        />
        <div
          className="h-[16px] w-[16px] animate-fm-sparkle rounded-full bg-gold/40"
        />
      </div>

      <p
        className={`font-serif text-[20px] italic tracking-[.06em] transition-opacity duration-700 ${
          reveal ? 'text-ivory' : 'text-ivory/40'
        }`}
      >
        {tuningLabel}
      </p>
    </div>
  );
}
