'use client';

import { useTranslations } from 'next-intl';

import { ArrivalCheckIn } from '@/components/features/arrival/arrival-check-in';
import { ArrivalPanel } from '@/components/features/arrival/arrival-panel';
import { Display, Kicker } from '@/components/ui';
import { useArrival } from '@/hooks/use-arrival';
import { MOOD_IDS, type MoodId } from '@/types/mood';

/** `mood:<id>` → `<id>`; cualquier otra entrada (una intención) no es un estado. */
function selectedMood(key: string | null): MoodId | null {
  if (!key?.startsWith('mood:')) return null;
  const id = key.slice('mood:'.length);

  return (MOOD_IDS as readonly string[]).includes(id) ? (id as MoodId) : null;
}

/**
 * «¿Cómo llegas hoy?» en la Home. Sin sesión: cualquiera puede elegir. Elegir un
 * estado cambia el tema de todo el sitio (la respuesta nombra el tema que
 * propone), y la persona puede volver a cambiarlo desde el header.
 */
export function ArrivalSection() {
  const t = useTranslations('arrival');
  const tJournal = useTranslations('journal');
  const { flow, atmosphere, choose, step, other, stop } = useArrival();

  const options = MOOD_IDS.map((id) => ({ id, label: tJournal(`moods.${id}`) }));

  return (
    <section aria-labelledby="arrival-title" className="fm-editorial-full-bleed py-section">
      <div className="fm-container relative flex flex-col items-center text-center">
        {/* Sin `gap` en el contenedor: el panel se pliega a 0 y no debe dejar hueco. */}
        <div className="flex flex-col items-center gap-6">
          <Kicker tone="teal" spacing="wide">
            {t('kicker')}
          </Kicker>
          <Display level="h2" size="md" id="arrival-title">
            {t('title')}
          </Display>
          <p className="text-fg-soft text-body max-w-[52ch] leading-[1.8]">{t('intro')}</p>

          <ArrivalCheckIn
            legend={t('legend')}
            options={options}
            selected={selectedMood(flow.key)}
            onSelect={(id) => choose(`mood:${id}`)}
          />
          <p className="text-fg-meta text-meta tracking-ui font-sans">{t('silent')}</p>
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
