'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { ArrivalCheckIn } from '@/components/features/arrival/arrival-check-in';
import { ArrivalPanel } from '@/components/features/arrival/arrival-panel';
import { AtmosphereScope, Display, Kicker } from '@/components/ui';
import { ATMOSPHERES } from '@/config/atmospheres';
import { useArrival } from '@/hooks/use-arrival';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { MOOD_IDS, type MoodId } from '@/types/mood';

/** `mood:<id>` → `<id>`; cualquier otra entrada (una intención) no es un estado. */
function selectedMood(key: string | null): MoodId | null {
  if (!key?.startsWith('mood:')) return null;
  const id = key.slice('mood:'.length);

  return (MOOD_IDS as readonly string[]).includes(id) ? (id as MoodId) : null;
}

/**
 * «¿Cómo llegas hoy?» en la Home. Sin sesión: cualquiera puede elegir. El bloque
 * vive en su propio `AtmosphereScope`: al elegir adopta la atmósfera y el fondo
 * se funde en dos capas con `opacity`. La elección se guarda para Resonario,
 * Descúbrete y Mi Santuario.
 */
export function ArrivalSection() {
  const t = useTranslations('arrival');
  const tJournal = useTranslations('journal');
  const reduced = useReducedMotionSafe();
  const { flow, atmosphere, choose, step, other, stop } = useArrival();

  // Sin elección, el bloque es de día (`dawn`): es el peldaño claro del ritmo de la Home
  // (spec §10). Al elegir adopta la atmósfera elegida. El store sigue sin elección: sólo
  // se pinta, no se fija.
  const shown = atmosphere === 'night' ? 'dawn' : atmosphere;
  const scheme = ATMOSPHERES[shown].scheme;
  const options = MOOD_IDS.map((id) => ({ id, label: tJournal(`moods.${id}`) }));

  return (
    <section aria-labelledby="arrival-title" className="fm-editorial-full-bleed py-section">
      <AnimatePresence initial={false}>
        <motion.div
          key={shown}
          aria-hidden="true"
          data-atmosphere={shown}
          data-scheme={scheme}
          className="fm-fade-top absolute inset-0 -z-10"
          style={{ background: 'var(--atmo-backdrop)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0.2 : 0.6, ease: 'easeOut' }}
        />
      </AnimatePresence>

      <AtmosphereScope
        atmosphere={shown}
        scheme={scheme}
        className="fm-container relative flex flex-col items-center text-center"
      >
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

        <ArrivalPanel flow={flow} atmosphere={shown} onStep={step} onOther={other} onStop={stop} />
      </AtmosphereScope>
    </section>
  );
}
