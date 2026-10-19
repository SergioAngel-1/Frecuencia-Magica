'use client';

import { useTranslations } from 'next-intl';

import { ArrivalCheckIn } from '@/components/features/arrival/arrival-check-in';
import { ArrivalPanel } from '@/components/features/arrival/arrival-panel';
import { BreathIcon } from '@/components/layout';
import { Button, Display, Float, Kicker } from '@/components/ui';
import { ARRIVALS } from '@/config/arrivals';
import { useArrival } from '@/hooks/use-arrival';
import { selectedMood } from '@/lib/arrival/selected-mood';
import { useBreathingStore } from '@/stores/breathing-store';
import { MOOD_IDS } from '@/types/mood';

/**
 * «Tu llegada» en la Home. Sin estado guardado es el check-in de siempre; con uno
 * (elegido en el portal o aquí antes), responde directamente con el panel, sin
 * sonar, y deja las píldoras para cambiarlo. Elegir un estado cambia el tema de
 * todo el sitio (la respuesta nombra el tema que propone).
 */
export function ArrivalSection() {
  const t = useTranslations('arrival');
  const tJournal = useTranslations('journal');
  const { flow, atmosphere, choose, step, other, stop } = useArrival({ restore: true });
  const showBreathing = useBreathingStore((s) => s.show);

  const options = MOOD_IDS.map((id) => ({
    id,
    label: tJournal(`moods.${id}`),
    atmosphere: ARRIVALS[`mood:${id}`].atmosphere,
  }));
  const returning = flow.key !== null;

  return (
    <section aria-labelledby="arrival-title" className="fm-editorial-full-bleed">
      <div className="fm-container relative flex flex-col items-center text-center">
        {/* Sin `gap` en el contenedor: el panel se pliega a 0 y no debe dejar hueco. */}
        <div className="flex flex-col items-center gap-6">
          <Kicker tone="teal" spacing="wide">
            {t('kicker')}
          </Kicker>
          <Display level="h2" size="md" id="arrival-title">
            {returning ? t('returnTitle') : t('title')}
          </Display>
          <p className="text-fg-soft text-body max-w-measure-wide leading-[1.8]">
            {returning ? t('returnIntro') : t('intro')}
          </p>

          <Float className="w-full">
            <ArrivalCheckIn
              legend={t('legend')}
              options={options}
              selected={selectedMood(flow.key)}
              onSelect={(id) => choose(`mood:${id}`)}
            />
          </Float>
          <p className="text-fg-meta text-meta tracking-ui font-sans">{t('silent')}</p>
          <Float order={1}>
            <Button variant="outline" iconLeft={<BreathIcon />} onClick={showBreathing}>
              {t('breatheOnly')}
            </Button>
          </Float>
        </div>

        <ArrivalPanel
          flow={flow}
          atmosphere={atmosphere}
          onStep={step}
          onOther={other}
          onStop={stop}
        />
      </div>
    </section>
  );
}
