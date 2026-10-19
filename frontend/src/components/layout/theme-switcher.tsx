'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { div as Mdiv } from 'motion/react-m';
import { useTranslations } from 'next-intl';

import { ThemeSwatch } from '@/components/ui';
import { ATMOSPHERE_IDS } from '@/config/atmospheres';
import { useAtmosphere } from '@/hooks/use-atmosphere';
import { useAtmosphereShift } from '@/hooks/use-atmosphere-shift';
import { useFeelingLabel } from '@/hooks/use-feeling-label';
import { useMounted } from '@/hooks/use-mounted';
import { cn } from '@/lib/cn';
import { originFromRect } from '@/lib/atmosphere/shift';
import { pressedOption, switcherOptions, type SwitcherOption } from '@/lib/atmosphere/switcher';
import { useAtmosphereStore } from '@/stores/atmosphere-store';

import { dockSegmentClasses } from './control-dock';

/**
 * Vista previa de un tema en su tarjeta: su fondo y sus tres luces (oro, teal y lavanda del propio
 * tema). Se pinta con los tokens del tema (`data-atmosphere` en la vista previa), no con colores
 * propios. «Automático» enseña los cinco fondos en franjas: cada lugar con el suyo.
 */
function Preview({ option }: { option: SwitcherOption }) {
  if (option === 'auto') {
    return (
      <span aria-hidden="true" className="flex h-12 w-full overflow-hidden">
        {ATMOSPHERE_IDS.map((id) => (
          <span key={id} data-atmosphere={id} className="h-full flex-1 bg-[image:var(--atmo-bg)]" />
        ))}
      </span>
    );
  }

  return (
    <span
      aria-hidden="true"
      data-atmosphere={option}
      className="flex h-12 w-full items-center justify-center gap-1.5 bg-[image:var(--atmo-bg)]"
    >
      <span className="bg-accent size-2 rounded-full" />
      <span className="bg-accent-2 size-1.5 rounded-full" />
      <span className="bg-accent-3 size-1.5 rounded-full" />
    </span>
  );
}

/**
 * Selector de tema, siempre en el header. Un segmento con la muestra del tema activo abre un panel
 * con dos modos: «Automático», que deja la luz al sitio (cada lugar y cada sonido proponen la
 * suya), y «Según cómo te sientes», con las cinco tarjetas de tema. Elegir cambia los tokens de
 * todo el sitio; el cambio lo anuncia la región `aria-live` del `AtmosphereProvider`.
 *
 * Es un `radiogroup`: una sola opción activa entre las seis. La elección vive en `localStorage`,
 * que el servidor no tiene: hasta montar, «Automático» aparece pulsado para no desajustar la
 * hidratación. Debajo, una línea describe el tema señalado (el de la tarjeta bajo el puntero o el
 * foco; si no hay ninguno, el elegido).
 */
export function ThemeSwitcher() {
  const t = useTranslations('atmospheres');
  const mounted = useMounted();
  const { atmosphereId } = useAtmosphere();
  const choice = useAtmosphereStore((state) => state.choice);
  const feeling = useAtmosphereStore((state) => state.feeling);
  const feelingLabel = useFeelingLabel();
  const shift = useAtmosphereShift();
  const [open, setOpen] = useState(false);
  const [peek, setPeek] = useState<SwitcherOption | null>(null);
  const root = useRef<HTMLDivElement>(null);

  const pressed = pressedOption(mounted ? choice : null);
  const shown = peek ?? pressed;
  const nameOf = (option: SwitcherOption) =>
    option === 'auto' ? t('switcher.auto') : t(`${option}.name`);
  const descriptionOf = (option: SwitcherOption) =>
    option === 'auto' ? t('switcher.autoDescription') : t(`${option}.description`);

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

  // El cambio pide confirmación y cruza con una onda que nace de la tarjeta pulsada.
  const choose = (option: SwitcherOption, card: HTMLElement) => {
    if (option === pressed) return;

    setOpen(false);
    shift(option === 'auto' ? null : option, {
      origin: originFromRect(card.getBoundingClientRect(), {
        width: window.innerWidth,
        height: window.innerHeight,
      }),
    });
  };

  const renderOption = (option: SwitcherOption) => {
    const checked = pressed === option;
    const automatic = option === 'auto';

    return (
      <button
        key={option}
        type="button"
        role="radio"
        aria-checked={checked}
        onClick={(event) => choose(option, event.currentTarget)}
        onPointerEnter={() => setPeek(option)}
        onPointerLeave={() => setPeek(null)}
        onFocus={() => setPeek(option)}
        onBlur={() => setPeek(null)}
        className={cn(
          'rounded-field group flex min-h-11 flex-col overflow-hidden border text-left transition-[border-color,background-color] duration-300',
          checked
            ? 'border-accent/70 bg-accent/12'
            : 'border-line hover:border-fg/30 bg-transparent',
        )}
      >
        <Preview option={option} />
        <span className="flex items-start justify-between gap-2 px-3 py-2.5">
          <span className="min-w-0">
            <span
              className={cn(
                'text-body tracking-ui font-sans',
                checked ? 'text-fg' : 'text-fg-soft group-hover:text-fg',
              )}
            >
              {nameOf(option)}
            </span>
            {automatic ? (
              <span className="text-fg-soft text-meta mt-1 block font-sans leading-snug">
                {t('switcher.autoDescription')}
              </span>
            ) : null}
          </span>
          {checked ? (
            <span aria-hidden="true" className="bg-accent mt-1.5 size-1.5 rounded-full" />
          ) : null}
        </span>
      </button>
    );
  };

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
            className="border-line bg-scrim/95 rounded-card shadow-glow-card fixed inset-x-5 top-[calc(env(safe-area-inset-top)+72px)] border p-5 backdrop-blur-md sm:absolute sm:inset-x-auto sm:top-full sm:right-0 sm:mt-3 sm:w-[352px]"
          >
            <div className="mb-4 flex items-baseline justify-between gap-4">
              <p className="text-fg-meta text-label tracking-kicker font-sans uppercase">
                {t('switcher.label')}
              </p>
              <p className="text-fg text-serif-md font-serif leading-none">
                {nameOf(mounted ? (choice ?? 'auto') : 'auto')}
              </p>
            </div>

            <div role="radiogroup" aria-label={t('switcher.label')}>
              <div className="mb-5">{renderOption('auto')}</div>

              <div className="mb-2.5">
                <p className="text-fg-meta tracking-label text-label font-sans uppercase">
                  {t('switcher.feelingLabel')}
                  {mounted && feeling ? ` · ${feelingLabel(feeling)}` : ''}
                </p>
                <p className="text-fg-soft text-meta mt-1 font-sans leading-snug">
                  {t('switcher.feelingDescription')}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {switcherOptions()
                  .filter((option) => option !== 'auto')
                  .map(renderOption)}
              </div>
            </div>

            <p className="text-fg-soft text-meta mt-4 min-h-10 font-sans leading-snug">
              {shown === 'auto' ? '' : descriptionOf(shown)}
            </p>
          </Mdiv>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
