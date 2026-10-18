'use client';

import { Skeleton } from '@/components/ui';
import { useUpcomingDates } from '@/hooks/use-upcoming-dates';

type ExperienceDateProps = {
  /** Cuántas fechas se piden: la lista entera de experiencias. */
  count: number;
  /** La posición de esta fila dentro de esas fechas. */
  index: number;
  /** Etiqueta de la fecha ("Próxima cita"). */
  label: string;
  /** `featured` va en línea con el resto de metadatos; `row` es la columna del archivo. */
  variant?: 'featured' | 'row';
};

/**
 * Fecha de la próxima cita de una experiencia, ya resuelta en el cliente para
 * que el HTML estático no congele el día del build. Mientras no hay fecha
 * pinta una silueta con la misma forma: sin texto inventado y sin salto.
 */
export function ExperienceDate({ count, index, label, variant = 'row' }: ExperienceDateProps) {
  const date = useUpcomingDates(count)?.[index];

  if (variant === 'featured') {
    return (
      <time dateTime={date?.iso}>
        <span className="sr-only">{label}: </span>
        {date ? (
          <>
            {date.dow} {date.day} {date.month}
          </>
        ) : (
          <Skeleton className="inline-block h-[1em] w-[6em] align-middle" />
        )}
      </time>
    );
  }

  return (
    <div className="flex min-h-11 flex-col justify-center">
      <span className="text-fg-muted text-meta tracking-ui font-sans uppercase">{label}</span>
      <time dateTime={date?.iso} className="text-fg mt-1 block font-serif text-[22px]">
        {date ? (
          <>
            {date.dow} {date.day} {date.month}
          </>
        ) : (
          <Skeleton className="h-[22px] w-[6em]" />
        )}
      </time>
    </div>
  );
}
