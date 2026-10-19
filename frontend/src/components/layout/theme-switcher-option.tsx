'use client';

import { ThemeSwatch } from '@/components/ui';
import { ATMOSPHERE_IDS } from '@/config/atmospheres';
import { cn } from '@/lib/cn';
import {
  moodAtmosphere,
  type MoodSwitcherOption,
  type ThemeSwitcherOption,
} from '@/lib/atmosphere/switcher';
import type { AtmosphereId } from '@/types/atmosphere';

type OptionEvents = {
  checked: boolean;
  onChoose: (element: HTMLElement) => void;
  onPeek: () => void;
  onClearPeek: () => void;
};

const OPTION_CLASSES =
  'rounded-field group flex min-h-11 border text-left transition-[border-color,background-color] duration-300';

const CHECKED_CLASSES = 'border-accent/70 bg-accent/12';
const IDLE_CLASSES = 'border-line hover:border-fg/30 bg-transparent';

/**
 * Vista previa de un tema en su tarjeta: su fondo y sus tres luces (oro, teal y lavanda del
 * propio tema). Se pinta con los tokens del tema (`data-atmosphere` en la vista previa), no
 * con colores propios. «Automático» enseña los cinco fondos en franjas: cada lugar con el suyo.
 */
function Preview({ option }: { option: AtmosphereId | 'auto' }) {
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

/** Tarjeta de un tema (o de «Automático»), con su vista previa y su nombre. */
export function ThemeOption({
  option,
  name,
  description,
  ...events
}: OptionEvents & {
  option: ThemeSwitcherOption;
  name: string;
  description?: string;
}) {
  const automatic = option === 'auto';

  return (
    <button
      type="button"
      role="radio"
      aria-checked={events.checked}
      onClick={(event) => events.onChoose(event.currentTarget)}
      onPointerEnter={events.onPeek}
      onPointerLeave={events.onClearPeek}
      onFocus={events.onPeek}
      onBlur={events.onClearPeek}
      className={cn(
        OPTION_CLASSES,
        'flex-col overflow-hidden',
        events.checked ? CHECKED_CLASSES : IDLE_CLASSES,
      )}
    >
      <Preview option={option} />
      <span className="flex items-start justify-between gap-2 px-3 py-2.5">
        <span className="min-w-0">
          <span
            className={cn(
              'text-body tracking-ui font-sans',
              events.checked ? 'text-fg' : 'text-fg-soft group-hover:text-fg',
            )}
          >
            {name}
          </span>
          {automatic && description ? (
            <span className="text-fg-soft text-meta mt-1 block font-sans leading-snug">
              {description}
            </span>
          ) : null}
        </span>
        {events.checked ? (
          <span aria-hidden="true" className="bg-accent mt-1.5 size-1.5 rounded-full" />
        ) : null}
      </span>
    </button>
  );
}

/** Botón compacto de una emoción, con la muestra del tema que propone. */
export function MoodOption({
  mood,
  label,
  ...events
}: OptionEvents & {
  mood: MoodSwitcherOption;
  label: string;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={events.checked}
      onClick={(event) => events.onChoose(event.currentTarget)}
      onPointerEnter={events.onPeek}
      onPointerLeave={events.onClearPeek}
      onFocus={events.onPeek}
      onBlur={events.onClearPeek}
      className={cn(
        OPTION_CLASSES,
        'items-center gap-2.5 px-3',
        events.checked ? CHECKED_CLASSES : IDLE_CLASSES,
      )}
    >
      <ThemeSwatch theme={moodAtmosphere(mood)} size="sm" />
      <span
        className={cn(
          'text-body tracking-ui min-w-0 font-sans',
          events.checked ? 'text-fg' : 'text-fg-soft group-hover:text-fg',
        )}
      >
        {label}
      </span>
      {events.checked ? (
        <span aria-hidden="true" className="bg-accent ml-auto size-1.5 flex-none rounded-full" />
      ) : null}
    </button>
  );
}
