'use client';

import { Button, Display, Kicker } from '@/components/ui';
import { FrequencyDisc } from '@/components/ui/frequency-disc';
import { Link } from '@/i18n/navigation';

import { RecommendationCard, type RecommendationCardProps } from './recommendation-card';

export type ResultStepProps = {
  kicker: string;
  /** Nombre de la intención dominante («Calma», «Raíz»…). */
  intent: string;
  description: string;
  hz: number;
  band: string;
  audioTitle: string;
  ctaLabel: string;
  restartLabel: string;
  pathKicker: string;
  pathTitle: string;
  recommendations: readonly (RecommendationCardProps & { id: string })[];
  onListen: () => void;
  onRestart: () => void;
};

/**
 * Resultado de Descúbrete: la frecuencia como protagonista y, debajo, un
 * curso, una experiencia y un objeto afines. Sin lógica: la recomendación
 * llega ya resuelta y traducida.
 */
export function ResultStep({
  kicker,
  intent,
  description,
  hz,
  band,
  audioTitle,
  ctaLabel,
  restartLabel,
  pathKicker,
  pathTitle,
  recommendations,
  onListen,
  onRestart,
}: ResultStepProps) {
  return (
    <div className="pb-block flex w-full max-w-[1040px] flex-col items-center gap-6">
      <Kicker tone="gold" spacing="widest">
        {kicker}
      </Kicker>

      <FrequencyDisc hz={hz} band={band} size="lg" title={audioTitle} />

      <Display level="h1" size="lg" className="text-center">
        {intent}
      </Display>

      <p className="text-fg-soft text-body max-w-[48ch] text-center leading-[1.8]">{description}</p>

      <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
        <Button variant="primary" size="lg" asChild onClick={onListen}>
          <Link href="/biblioteca">{ctaLabel}</Link>
        </Button>
        <Button variant="ghost" size="sm" className="text-body" onClick={onRestart}>
          {restartLabel}
        </Button>
      </div>

      <section aria-labelledby="discover-path-title" className="mt-block w-full">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <Kicker tone="teal" spacing="wide">
            {pathKicker}
          </Kicker>
          <Display level="h2" size="md" id="discover-path-title">
            {pathTitle}
          </Display>
        </div>
        <ul className="grid gap-5 md:grid-cols-3">
          {recommendations.map(({ id, ...card }) => (
            <li key={id}>
              <RecommendationCard {...card} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
