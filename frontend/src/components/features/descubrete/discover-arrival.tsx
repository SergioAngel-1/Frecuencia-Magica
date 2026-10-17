'use client';

import { ArrivalPanel } from '@/components/features/arrival/arrival-panel';
import { Button } from '@/components/ui';
import type { ArrivalKey } from '@/config/arrivals';
import { useArrival } from '@/hooks/use-arrival';

type DiscoverArrivalProps = {
  /** La intención dominante del resultado, como entrada de llegada. */
  arrivalKey: ArrivalKey;
  ctaLabel: string;
};

/**
 * La misma respuesta de «¿Cómo llegas hoy?», con la intención dominante. Sólo
 * la pide el gesto: hasta pulsarla no suena ni cambia nada.
 */
export function DiscoverArrival({ arrivalKey, ctaLabel }: DiscoverArrivalProps) {
  const { flow, choose, step, other, stop } = useArrival();

  if (!flow.response) {
    return (
      <div className="flex justify-center">
        <Button variant="outline" onClick={() => choose(arrivalKey)}>
          {ctaLabel}
        </Button>
      </div>
    );
  }

  return <ArrivalPanel flow={flow} onStep={step} onOther={other} onStop={stop} />;
}
