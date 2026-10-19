'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { div as Mdiv } from 'motion/react-m';
import { useTranslations } from 'next-intl';

import { ThemeSwatch } from '@/components/ui';
import { ARRIVALS } from '@/config/arrivals';
import { useAtmosphere } from '@/hooks/use-atmosphere';
import { useAtmosphereShift } from '@/hooks/use-atmosphere-shift';
import { useMounted } from '@/hooks/use-mounted';
import { originFromRect } from '@/lib/atmosphere/shift';
import {
  feelingOptions,
  isMoodOption,
  moodAtmosphere,
  moodOf,
  pressedOption,
  switcherOptions,
  type MoodSwitcherOption,
  type SwitcherOption,
} from '@/lib/atmosphere/switcher';
import { useArrivalStore } from '@/stores/arrival-store';
import { useAtmosphereStore } from '@/stores/atmosphere-store';
import type { MoodId } from '@/types/mood';

import { dockSegmentClasses } from './control-dock';
import { MoodOption, ThemeOption } from './theme-switcher-option';

const SECTION_TITLE_CLASSES = 'text-fg-meta tracking-label text-label font-sans uppercase';
const SECTION_DESCRIPTION_CLASSES = 'text-fg-soft text-meta mt-1 font-sans leading-snug';

/**
 * Selector de tema, siempre en el header. Un segmento con la muestra del tema activo abre un
 * panel con tres grupos y una sola opción activa: «Automático», que deja la luz al sitio (cada
 * lugar y cada sonido proponen la suya); «Cómo te sientes», con las ocho emociones del portal,
 * cada una con el tema que propone; y «Elegir un tema», con las cinco tarjetas. El cambio lo
 * anuncia la región `aria-live` del `AtmosphereProvider`. La elección vive en `localStorage`,
 * que el servidor no tiene: hasta montar, «Automático» aparece pulsado para no desajustar la
 * hidratación. Debajo, una línea describe la opción señalada (la del puntero o el foco; si no
 * hay ninguna, la elegida).
 */
export function ThemeSwitcher() {
  const t = useTranslations('atmospheres');
  const tJournal = useTranslations('journal');
  const mounted = useMounted();
  const { atmosphereId } = useAtmosphere();
  const choice = useAtmosphereStore((state) => state.choice);
  const feeling = useAtmosphereStore((state) => state.feeling);
  const shift = useAtmosphereShift();
  const [open, setOpen] = useState(false);
  const [peek, setPeek] = useState<SwitcherOption | null>(null);
  const root = useRef<HTMLDivElement>(null);

  const pressed = pressedOption(mounted ? choice : null, mounted ? feeling : null);
  const shown = peek ?? pressed;
  const nameOf = (option: SwitcherOption) => {
    if (option === 'auto') return t('switcher.auto');
    if (isMoodOption(option)) return tJournal(`moods.${moodOf(option) as MoodId}`);

    return t(`${option}.name`);
  };
  const descriptionOf = (option: SwitcherOption) => {
    if (option === 'auto') return t('switcher.autoDescription');
    if (isMoodOption(option)) return t(`${moodAtmosphere(option)}.description`);

    return t(`${option}.description`);
  };
  const labelOf = (mood: MoodSwitcherOption) => tJournal(`moods.${moodOf(mood) as MoodId}`);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setOpen(false);
      root.current?.querySelector('button')?.focus();
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  // El cambio pide confirmación y cruza con una onda que nace de la opción pulsada. Una emoción
  // fija el tema que propone y deja la llegada guardada, como el portal.
  const choose = (option: SwitcherOption, card: HTMLElement) => {
    if (option === pressed) return;

    setOpen(false);
    const origin = originFromRect(card.getBoundingClientRect(), {
      width: window.innerWidth,
      height: window.innerHeight,
    });

    if (isMoodOption(option)) {
      useArrivalStore.getState().setKey(option);
      shift(ARRIVALS[option].atmosphere, { source: 'feeling', feeling: option, origin });

      return;
    }

    shift(option === 'auto' ? null : option, { origin });
  };

  const optionEvents = (option: SwitcherOption) => ({
    checked: pressed === option,
    onChoose: (card: HTMLElement) => choose(option, card),
    onPeek: () => setPeek(option),
    onClearPeek: () => setPeek(null),
  });

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        aria-label={t('switcher.open')}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        data-magnetic
        className={dockSegmentClasses({ active: open })}
      >
        <ThemeSwatch theme={mounted ? atmosphereId : 'night'} />
      </button>

      <AnimatePresence>
        {open ? (
          <Mdiv
            key="panel"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="border-line bg-scrim/95 rounded-card shadow-glow-card fixed inset-x-5 top-[calc(env(safe-area-inset-top)+72px)] max-h-[calc(100svh-96px)] overflow-y-auto border p-5 backdrop-blur-md sm:absolute sm:inset-x-auto sm:top-full sm:right-0 sm:mt-3 sm:w-[352px]"
          >
            <div className="mb-4 flex items-baseline justify-between gap-4">
              <p className="text-fg-meta text-label tracking-kicker font-sans uppercase">
                {t('switcher.label')}
              </p>
              <p className="text-fg text-serif-md font-serif leading-none">{nameOf(pressed)}</p>
            </div>

            <div role="radiogroup" aria-label={t('switcher.label')}>
              <div className="mb-5">
                <ThemeOption
                  option="auto"
                  name={nameOf('auto')}
                  description={t('switcher.autoDescription')}
                  {...optionEvents('auto')}
                />
              </div>

              <section className="mb-5">
                <p className={SECTION_TITLE_CLASSES}>{t('switcher.feelingLabel')}</p>
                <p className={SECTION_DESCRIPTION_CLASSES}>{t('switcher.feelingDescription')}</p>
                <div className="mt-2.5 grid grid-cols-2 gap-2.5">
                  {feelingOptions().map((mood) => (
                    <MoodOption
                      key={mood}
                      mood={mood}
                      label={labelOf(mood)}
                      {...optionEvents(mood)}
                    />
                  ))}
                </div>
              </section>

              <section>
                <p className={SECTION_TITLE_CLASSES}>{t('switcher.themeLabel')}</p>
                <p className={SECTION_DESCRIPTION_CLASSES}>{t('switcher.themeDescription')}</p>
                <div className="mt-2.5 grid grid-cols-2 gap-2.5">
                  {switcherOptions()
                    .filter((option) => option !== 'auto')
                    .map((option) => (
                      <ThemeOption
                        key={option}
                        option={option}
                        name={nameOf(option)}
                        {...optionEvents(option)}
                      />
                    ))}
                </div>
              </section>
            </div>

            <p className="text-fg-soft text-meta mt-4 min-h-10 font-sans leading-snug">
              {descriptionOf(shown)}
            </p>
          </Mdiv>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
