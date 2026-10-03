'use client';

import { FrequencyDisc, type DiscSize } from '@/components/ui';
import { cn } from '@/lib/cn';
import { usePlayerStore } from '@/stores/player-store';

export type FrequencyStripItem = {
  id: string;
  hz: number;
  band: string;
  /** Título ya traducido. */
  title: string;
  /** Línea de meta ya compuesta; la escala `xs` no la pinta. */
  meta?: string;
};

type FrequencyStripProps = {
  items: readonly FrequencyStripItem[];
  /** Nombre accesible de la lista, ya traducido. */
  label: string;
  size?: Extract<DiscSize, 'xs' | 'sm'>;
  className?: string;
};

/** Cuatro por fila en `sm` (dos en móvil); en `xs`, los que quepan, centrados. */
const LAYOUT: Record<NonNullable<FrequencyStripProps['size']>, string> = {
  xs: 'flex flex-wrap justify-center gap-x-4 gap-y-5',
  sm: 'grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 lg:gap-x-8',
};

const ITEM: Record<NonNullable<FrequencyStripProps['size']>, string> = {
  xs: 'w-[92px]',
  sm: 'min-w-0',
};

/**
 * Hilera de discos pequeños que abren su audio en el reproductor. Es la
 * subsección de «más frecuencias» de la Home y de Mi Santuario: el mismo
 * gesto y el mismo estado activo en los dos sitios.
 */
export function FrequencyStrip({ items, label, size = 'sm', className }: FrequencyStripProps) {
  const open = usePlayerStore((state) => state.open);
  const activeId = usePlayerStore((state) => state.audioId);

  return (
    <ul aria-label={label} className={cn(LAYOUT[size], className)}>
      {items.map((item, index) => (
        <li key={item.id} className={ITEM[size]}>
          <FrequencyDisc
            size={size}
            hz={item.hz}
            band={item.band}
            title={item.title}
            meta={item.meta}
            active={activeId === item.id}
            floatDuration={`${7 + (index % 4) * 0.6}s`}
            floatDelay={`${(index % 4) * 0.35}s`}
            ariaLabel={[item.title, `${item.hz} Hz`, item.meta].filter(Boolean).join(' — ')}
            onClick={() => open(item.id)}
          />
        </li>
      ))}
    </ul>
  );
}
