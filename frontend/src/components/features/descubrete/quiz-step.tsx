'use client';

import { useCallback, useId } from 'react';

import { Button, ProgressBar } from '@/components/ui';
import { cn } from '@/lib/cn';

type QuizStepProps = {
  prompt: string;
  options: string[];
  currentIndex: number;
  total: number;
  progressLabel: string;
  backLabel: string;
  onAnswer: (optionIndex: number) => void;
  onBack: () => void;
};

export function QuizStep({
  prompt,
  options,
  currentIndex,
  total,
  progressLabel,
  backLabel,
  onAnswer,
  onBack,
}: QuizStepProps) {
  const uid = useId();
  const pct = ((currentIndex + 1) / total) * 100;

  return (
    <div className="flex w-full flex-col items-center">
      <p className="text-lav font-sans text-[11px] tracking-[.25em] uppercase">{progressLabel}</p>

      <ProgressBar
        value={pct}
        height={4}
        ariaLabel={progressLabel}
        className="mt-4 mb-10 w-full max-w-[360px]"
      />

      <h2 className="text-ivory font-serif text-[clamp(22px,3.2vw,32px)] leading-[1.2] tracking-[.02em]">
        {prompt}
      </h2>

      <div className="mt-8 flex w-full flex-col gap-3">
        {options.map((opt, i) => (
          <OptionButton key={`${uid}-${i}`} label={opt} index={i} onSelect={onAnswer} />
        ))}
      </div>

      {currentIndex > 0 && (
        <Button variant="ghost" size="sm" className="mt-6 text-[15px]" onClick={onBack}>
          {backLabel}
        </Button>
      )}
    </div>
  );
}

function OptionButton({
  label,
  index,
  onSelect,
}: {
  label: string;
  index: number;
  onSelect: (i: number) => void;
}) {
  const handleClick = useCallback(() => onSelect(index), [index, onSelect]);

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'group min-h-11 w-full border-b px-2 py-[14px] text-left text-[15px] leading-[1.5] transition-[color,border-color] duration-300',
        'border-ivory/25 text-ivory/90 bg-transparent',
        'hover:border-gold/60 hover:text-ivory',
        'focus-visible:ring-gold/50 focus-visible:ring-offset-void focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
      )}
    >
      <span className="text-gold/60 group-hover:text-gold/90 mr-4 font-serif">0{index + 1}</span>
      {label}
    </button>
  );
}
