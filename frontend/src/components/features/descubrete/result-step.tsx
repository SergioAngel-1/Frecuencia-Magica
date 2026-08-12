'use client';

import { Button, Kicker } from '@/components/ui';
import { FrequencyDisc } from '@/components/ui/frequency-disc';
import { Link } from '@/i18n/navigation';

type ResultStepProps = {
  kicker: string;
  hz: number;
  band: string;
  description: string;
  ctaLabel: string;
  restartLabel: string;
  onListen: () => void;
  onRestart: () => void;
};

export function ResultStep({
  kicker,
  hz,
  band,
  description,
  ctaLabel,
  restartLabel,
  onListen,
  onRestart,
}: ResultStepProps) {
  return (
    <div className="flex flex-col items-center gap-6">
      <Kicker tone="gold" spacing="widest">
        {kicker}
      </Kicker>

      <FrequencyDisc hz={hz} band={band} size="lg" />

      <p className="text-ivory/78 max-w-[48ch] text-center text-[15px] leading-[1.8]">
        {description}
      </p>

      <div className="mt-2 flex flex-wrap items-center gap-4">
        <Button variant="primary" size="lg" asChild onClick={onListen}>
          <Link href="/biblioteca">{ctaLabel}</Link>
        </Button>
        <Button variant="ghost" size="sm" className="text-[15px]" onClick={onRestart}>
          {restartLabel}
        </Button>
      </div>
    </div>
  );
}
