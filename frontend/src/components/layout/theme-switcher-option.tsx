'use client';

import { ThemeSwatch } from '@/components/ui';
import { ATMOSPHERE_IDS } from '@/config/atmospheres';
import { cn } from '@/lib/cn';
import {
  moodAtmosphere,
  type MoodSwitcherOption,
  type ThemeSwitcherOption,
} from '@/lib/atmosphere/switcher';

type OptionEvents = {
  checked: boolean;
  onChoose: (element: HTMLElement) => void;
  onPeek: () => void;
  onClearPeek: () => void;
};

const OPTION_CLASSES =
  'group flex border text-left transition-[border-color,background-color] duration-300';

const CHECKED_CLASSES = 'border-accent/70 bg-accent/12 text-fg';
const IDLE_CLASSES = 'border-line hover:border-fg/25';

/**
 * La opción protagonista: una emoción, con la muestra del tema que propone. Más alta y con
 * relleno de vidrio, para que el grupo de «Cómo te sientes» pese más que los dos de abajo.
 */
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
        'rounded-field min-h-12 items-center gap-2.5 px-3',
        events.checked ? CHECKED_CLASSES : cn(IDLE_CLASSES, 'bg-surface text-fg-soft'),
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

/**
 * «Automático», en la zona tranquila: una sola fila, ancho completo, sin descripción dentro. A la
 * izquierda, las cinco muestras diminutas (cada lugar propone la suya); el nombre, en meta.
 */
export function AutoOption({ name, ...events }: OptionEvents & { name: string }) {
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
        'rounded-field min-h-11 w-full items-center gap-2.5 px-3',
        events.checked ? 'border-accent/50 text-fg' : cn(IDLE_CLASSES, 'text-fg-soft'),
      )}
    >
      <span aria-hidden="true" className="flex items-center">
        {ATMOSPHERE_IDS.map((id, index) => (
          <ThemeSwatch
            key={id}
            theme={id}
            size="xs"
            className={index > 0 ? '-ml-1.5' : undefined}
          />
        ))}
      </span>
      <span className="text-meta tracking-ui font-sans">{name}</span>
      {events.checked ? (
        <span aria-hidden="true" className="bg-accent ml-auto size-1.5 flex-none rounded-full" />
      ) : null}
    </button>
  );
}

/**
 * Un tema de la fila de muestras: 44 px de área táctil con la muestra centrada y el aro de acento
 * cuando está activo. El nombre no se pinta debajo; lo da la línea de descripción y el `aria-label`.
 */
export function ThemeChoice({
  option,
  name,
  ...events
}: OptionEvents & {
  option: Exclude<ThemeSwitcherOption, 'auto'>;
  name: string;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={events.checked}
      aria-label={name}
      onClick={(event) => events.onChoose(event.currentTarget)}
      onPointerEnter={events.onPeek}
      onPointerLeave={events.onClearPeek}
      onFocus={events.onPeek}
      onBlur={events.onClearPeek}
      className={cn(
        'flex size-11 items-center justify-center rounded-full transition-shadow duration-300',
        events.checked ? 'ring-accent ring-1' : 'hover:ring-fg/20 hover:ring-1',
      )}
    >
      <ThemeSwatch theme={option} size="sm" />
    </button>
  );
}
