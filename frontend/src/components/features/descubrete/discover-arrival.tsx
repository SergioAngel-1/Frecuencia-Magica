'use client';

import { ArrivalPanel } from '@/components/features/arrival/arrival-panel';
import { ArrivalReveal } from '@/components/features/arrival/arrival-reveal';
import { Button } from '@/components/ui';
import type { ArrivalKey } from '@/config/arrivals';
import { useArrival } from '@/hooks/use-arrival';

type DiscoverArrivalProps = {
  /** La intención dominante del resultado, como entrada de llegada. */
  arrivalKey: ArrivalKey;
  /** La pista que recomienda el disco: la misma que suena primero en el panel. */
  featuredId: string;
  ctaLabel: string;
};

/**
 * La misma respuesta de «¿Cómo llegas hoy?», con la intención dominante. Sólo
 * la pide el gesto: hasta pulsarla no suena ni cambia nada. El panel va siempre
 * montado, así su región de anuncio ya existe cuando llega la respuesta.
 */
export function DiscoverArrival({ arrivalKey, featuredId, ctaLabel }: DiscoverArrivalProps) {
  const { flow, atmosphere, choose, step, other, stop } = useArrival();

  return (
    <div className="flex w-full flex-col items-center">
      <ArrivalReveal open={!flow.response}>
        <div className="flex justify-center">
          <Button variant="outline" onClick={() => choose(arrivalKey, featuredId)}>
            {ctaLabel}
          </Button>
        </div>
      </ArrivalReveal>
      <ArrivalPanel
        flow={flow}
        atmosphere={atmosphere}
        onStep={step}
        onOther={other}
        onStop={stop}
      />
    </div>
  );
}
