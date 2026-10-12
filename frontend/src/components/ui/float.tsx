import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/cn';
import { floatStyle, type FloatOptions } from '@/lib/motion/float';

type FloatTag = 'div' | 'li' | 'figure' | 'section';

type FloatProps = FloatOptions & {
  /** Etiqueta del envoltorio: `li` dentro de una lista, `figure` para una imagen. */
  as?: FloatTag;
  children: ReactNode;
  className?: string;
} & Omit<HTMLAttributes<HTMLElement>, 'children' | 'className' | 'style'>;

/**
 * Envoltorio que hace flotar lo que lleva dentro (`floatStyle`).
 *
 * Es un nodo aparte a propósito: el flotado anima `transform`, y en el mismo
 * nodo anularía cualquier realce de hover (`hover:-translate-y-1`) del
 * contenido. Dentro de una rejilla, el envoltorio es la celda: recibe el
 * `col-span` y su hijo se estira con `h-full`.
 *
 * Se detiene mientras el cursor o el foco están dentro, para que un botón o
 * un enlace no se muevan justo cuando se van a pulsar.
 */
export function Float({
  as: Tag = 'div',
  order,
  depth,
  duration,
  delay,
  className,
  children,
  ...rest
}: FloatProps) {
  return (
    <Tag
      className={cn(
        'focus-within:[animation-play-state:paused] hover:[animation-play-state:paused]',
        className,
      )}
      style={floatStyle({ order, depth, duration, delay })}
      data-float="true"
      {...rest}
    >
      {children}
    </Tag>
  );
}
