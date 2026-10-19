'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { div as Mdiv } from 'motion/react-m';
import { useTranslations } from 'next-intl';

import { IconButton } from '@/components/ui';
import { useAtmosphere } from '@/hooks/use-atmosphere';
import { useMounted } from '@/hooks/use-mounted';
import { cn } from '@/lib/cn';
import { pressedOption, switcherOptions, type SwitcherOption } from '@/lib/atmosphere/switcher';
import { useAtmosphereStore } from '@/stores/atmosphere-store';
import type { AtmosphereId } from '@/types/atmosphere';

/**
 * Muestra de un tema: un disco con su fondo y un punto de su acento. Se pinta con los tokens
 * del propio tema (`data-atmosphere` en la muestra), no con colores propios.
 */
function Swatch({ id, className }: { id: AtmosphereId; className?: string }) {
  return (
    <span
      aria-hidden="true"
      data-atmosphere={id}
      className={cn(
        'border-line-strong relative inline-block flex-none overflow-hidden rounded-full border',
        className,
      )}
      style={{ width: 24, height: 24, background: 'var(--atmo-bg)' }}
    >
      <span
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ width: 8, height: 8, background: 'var(--color-accent)' }}
      />
    </span>
  );
}

/**
 * Selector de tema, siempre en el header. Un botón con la muestra del tema activo abre un panel
 * con los cinco temas y «Automático» (cada lugar con el suyo). Elegir cambia los tokens de todo
 * el sitio; el cambio lo anuncia la región `aria-live` del `AtmosphereProvider`.
 *
 * Es un `radiogroup`: una sola opción activa. La elección vive en `localStorage`, que el
 * servidor no tiene: hasta montar, «Automático» aparece pulsado para no desajustar la hidratación.
 */
export function ThemeSwitcher() {
  const t = useTranslations('atmospheres');
  const mounted = useMounted();
  const { atmosphereId } = useAtmosphere();
  const choice = useAtmosphereStore((state) => state.choice);
  const setChoice = useAtmosphereStore((state) => state.setChoice);
  const clear = useAtmosphereStore((state) => state.clear);
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  const pressed = pressedOption(mounted ? choice : null);

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

  const choose = (option: SwitcherOption) => {
    if (option === 'auto') clear();
    else setChoice(option);
  };

  return (
    <div ref={root} className="pointer-events-auto relative">
      <IconButton
        label={t('switcher.open')}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <Swatch id={mounted ? atmosphereId : 'night'} />
      </IconButton>

      <AnimatePresence>
        {open ? (
          <Mdiv
            key="panel"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="border-line bg-scrim/95 rounded-card fixed inset-x-5 top-[calc(env(safe-area-inset-top)+68px)] border p-4 backdrop-blur-md sm:absolute sm:inset-x-auto sm:top-full sm:right-0 sm:mt-2 sm:w-[288px]"
          >
            <p className="text-fg-meta text-label tracking-kicker mb-3 font-sans uppercase">
              {t('switcher.label')}
            </p>
            <div role="radiogroup" aria-label={t('switcher.label')} className="flex flex-col gap-1">
              {switcherOptions().map((option) => {
                const checked = pressed === option;
                const name = option === 'auto' ? t('switcher.auto') : t(`${option}.name`);
                const description =
                  option === 'auto' ? t('switcher.autoDescription') : t(`${option}.description`);

                return (
                  <button
                    key={option}
                    type="button"
                    role="radio"
                    aria-checked={checked}
                    onClick={() => choose(option)}
                    className={cn(
                      'rounded-field flex min-h-11 items-center gap-3 px-3 py-2 text-left transition-colors duration-300',
                      checked ? 'bg-accent/16 text-fg' : 'text-fg-soft hover:text-fg',
                    )}
                  >
                    {option === 'auto' ? (
                      <span
                        aria-hidden="true"
                        style={{ width: 24, height: 24 }}
                        className="border-line-strong text-fg-soft text-label inline-flex flex-none items-center justify-center rounded-full border font-sans"
                      >
                        A
                      </span>
                    ) : (
                      <Swatch id={option} className="flex-none" />
                    )}
                    <span className="flex min-w-0 flex-col">
                      <span className="text-body tracking-ui font-sans">{name}</span>
                      <span className="text-fg-meta text-meta font-sans">{description}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </Mdiv>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
