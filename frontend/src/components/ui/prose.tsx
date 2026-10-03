import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type ProseSize = 'sm' | 'base' | 'lg';
export type ProseMaxWidth = 40 | 42 | 44 | 46 | 48 | 50 | 52 | 54;

interface ProseProps {
  children: ReactNode;
  /** Por defecto `base` (15–16px). */
  size?: ProseSize;
  /** Atenúa el color a la opacidad secundaria (0.6) en vez de la 0.74 por defecto. */
  muted?: boolean;
  /** Ancho máximo en `ch`, uno de los valores usados por el prototipo. */
  maxWidth?: ProseMaxWidth;
  className?: string;
}

/**
 * Sólo `font-size`: el `line-height` propio de `text-sm`/`text-base` de
 * Tailwind competiría por especificidad con el `leading-[1.85]` explícito de
 * abajo. Usando tamaños arbitrarios evitamos esa carrera de cascada.
 */
const SIZE_CLASSES: Record<ProseSize, string> = {
  sm: 'text-body',
  base: 'text-[16px]',
  lg: 'text-[clamp(15px,1.6vw,19px)]',
};

/**
 * Los ocho anchos del prototipo se listan de forma literal para que el
 * escáner de Tailwind detecte la clase arbitraria en build: una plantilla
 * `max-w-[${n}ch]` construida en runtime no es estática y no generaría CSS.
 */
const MAX_WIDTH_CLASSES: Record<ProseMaxWidth, string> = {
  40: 'max-w-[40ch]',
  42: 'max-w-[42ch]',
  44: 'max-w-[44ch]',
  46: 'max-w-[46ch]',
  48: 'max-w-[48ch]',
  50: 'max-w-[50ch]',
  52: 'max-w-[52ch]',
  54: 'max-w-[54ch]',
};

/**
 * Párrafo de cuerpo. Hereda el peso 300 del body; `text-pretty` evita
 * huérfanas y el color por defecto reproduce `rgba(247,244,234,0.74)` del
 * prototipo (`muted` lo atenúa a 0.6, la opacidad secundaria más repetida).
 */
export function Prose({ children, size = 'base', muted = false, maxWidth, className }: ProseProps) {
  return (
    <p
      className={cn(
        'font-sans leading-[1.85] text-pretty',
        muted ? 'text-fg-muted' : 'text-fg-soft',
        SIZE_CLASSES[size],
        maxWidth ? MAX_WIDTH_CLASSES[maxWidth] : undefined,
        className,
      )}
    >
      {children}
    </p>
  );
}
