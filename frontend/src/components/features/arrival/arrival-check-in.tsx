import { cn } from '@/lib/cn';
import type { MoodId } from '@/types/mood';

export type ArrivalCheckInOption = { id: MoodId; label: string };

type ArrivalCheckInProps = {
  /** Nombre del grupo para lectores de pantalla («Tu estado», «Cómo llegas»…). */
  legend: string;
  options: readonly ArrivalCheckInOption[];
  selected: MoodId | null;
  onSelect(id: MoodId): void;
};

/**
 * Los estados de ánimo como píldoras de elección única. Lo usan el diario de
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
            'rounded-pill text-label tracking-ui min-h-11 flex-1 basis-[86px] border px-3 py-2 font-sans uppercase transition-[color,background-color,border-color] duration-300',
            selected === option.id
              ? 'bg-accent/15 text-accent border-accent/40'
              : 'bg-surface text-fg-muted border-line hover:border-fg/20',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
