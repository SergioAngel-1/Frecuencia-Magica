import { ThemeSwatch } from '@/components/ui';
import { cn } from '@/lib/cn';
import type { AtmosphereId } from '@/types/atmosphere';
import type { MoodId } from '@/types/mood';

export type ArrivalCheckInOption = {
  id: MoodId;
  label: string;
  /** El tema que propone el estado: si viene, la píldora lleva su muestra. */
  atmosphere?: AtmosphereId;
};

type ArrivalCheckInProps = {
  /** Nombre del grupo para lectores de pantalla («Tu estado», «Cómo llegas»…). */
  legend: string;
  options: readonly ArrivalCheckInOption[];
  selected: MoodId | null;
  onSelect(id: MoodId): void;
};

/**
 * Los estados de ánimo como píldoras de elección única; cada una puede mostrar la muestra del
 * tema que propone, para que se vea adónde lleva antes de elegir. Lo usan el diario de
 * Mi Santuario (sólo guarda la elección) y el bloque de llegada de la Home (la
 * elección abre la respuesta). No sabe nada de eso: recibe el texto y el estado.
 */
export function ArrivalCheckIn({ legend, options, selected, onSelect }: ArrivalCheckInProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2" role="group" aria-label={legend}>
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onSelect(option.id)}
          aria-pressed={selected === option.id}
          className={cn(
            // En móvil, tres columnas del mismo ancho: la que queda sin par se centra sin estirarse, para que
            // ninguna tenga más peso visual. Desde 640 px, el ancho de su contenido.
            'rounded-pill text-label tracking-ui flex min-h-11 w-[calc((100%-1rem)/3)] flex-none items-center justify-center gap-2 border px-3 py-2 font-sans uppercase transition-[color,background-color,border-color] duration-300 sm:w-auto sm:min-w-[86px]',
            selected === option.id
              ? 'bg-accent/15 text-accent border-accent/40'
              : 'bg-surface text-fg-muted border-line hover:border-fg/20',
          )}
        >
          {option.atmosphere ? <ThemeSwatch theme={option.atmosphere} size="xs" /> : null}
          {option.label}
        </button>
      ))}
    </div>
  );
}
