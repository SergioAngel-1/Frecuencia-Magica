'use client';

import { useTranslations } from 'next-intl';

import { ArrivalCheckIn } from '@/components/features/arrival/arrival-check-in';
import { Kicker, Swap } from '@/components/ui';
import { ARRIVALS } from '@/config/arrivals';
import { useArrival } from '@/hooks/use-arrival';
import { selectedMood } from '@/lib/arrival/selected-mood';
import { MOOD_IDS } from '@/types/mood';

/**
 * «¿Cómo llegas hoy?» en el umbral. Opcional: el botón de cruzar funciona igual
 * con o sin elegir. Elegir fija el tema en vivo y lo guarda, pero no suena nada:
 * el sonido sólo empieza cuando la persona lo pide, en el reproductor o en la Home.
 */
export function PortalArrival() {
  const t = useTranslations('portal.arrival');
  const tArrival = useTranslations('arrival');
  const tJournal = useTranslations('journal');
  const tAtmospheres = useTranslations('atmospheres');
  const { flow, pick } = useArrival({ restore: true });

  const options = MOOD_IDS.map((id) => ({ id, label: tJournal(`moods.${id}`) }));
  const selected = selectedMood(flow.key);
  const theme = flow.key ? ARRIVALS[flow.key].atmosphere : null;

  return (
    <div
      className="animate-fm-fade-up mb-[26px] flex w-full max-w-[520px] flex-col items-center gap-3 md:mb-[34px]"
      style={{ animationDelay: '0.4s' }}
    >
      <Kicker tone="teal" spacing="wide">
        {tArrival('title')}
      </Kicker>

      <ArrivalCheckIn
        legend={tArrival('legend')}
        options={options}
        selected={selected}
        onSelect={(id) => pick(`mood:${id}`)}
      />

      {/* Persistente: el lector anuncia el cambio de la línea, no su aparición. */}
      <div aria-live="polite" className="min-h-5">
        <Swap id={theme ?? 'optional'}>
          <p className="text-fg-meta text-meta tracking-ui font-sans">
            {theme ? t('proposed', { name: tAtmospheres(`${theme}.name`) }) : t('optional')}
          </p>
        </Swap>
      </div>
    </div>
  );
}
