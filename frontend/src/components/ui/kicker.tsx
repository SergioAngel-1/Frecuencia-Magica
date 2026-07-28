import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type KickerTone = 'gold' | 'teal' | 'lav' | 'muted';
export type KickerSpacing = 'tight' | 'wide' | 'widest';

interface KickerProps {
  children: ReactNode;
  /** Color de acento. Por defecto `gold`, el acento primario de marca. */
  tone?: KickerTone;
  /** Nivel de tracking. Por defecto `wide`. */
  spacing?: KickerSpacing;
  /** Elemento semántico. Por defecto `p`; usar `span` en contextos inline. */
  as?: 'p' | 'span';
  className?: string;
}

const TONE_CLASSES: Record<KickerTone, string> = {
  gold: 'text-gold',
  teal: 'text-teal',
  lav: 'text-lav',
  muted: 'text-ivory/55',
};

/**
 * El prototipo usa un tracking distinto casi por instancia (de .14em a
 * .5em). Estos tres escalones colapsan ese rango en los valores más
 * representativos de cada franja, tal como pide el brief:
 * - `tight` (.14em): cifras/labels de apoyo (stats del hero).
 * - `wide` (.3em): el valor de tracking "medio" más repetido del prototipo.
 * - `widest` (.4em): kickers de cabecera de realm (authKicker, libKicker...).
 */
const SPACING_CLASSES: Record<KickerSpacing, string> = {
  tight: 'tracking-[.14em]',
  wide: 'tracking-[.3em]',
  widest: 'tracking-[.4em]',
};

/**
 * Etiqueta corta en mayúsculas que antecede a un título. Presentacional y sin
 * estado: el texto llega ya traducido por `children`.
 */
export function Kicker({ children, tone = 'gold', spacing = 'wide', as = 'p', className }: KickerProps) {
  const Tag = as;

  return (
    <Tag className={cn('font-sans text-[11px] uppercase', TONE_CLASSES[tone], SPACING_CLASSES[spacing], className)}>
      {children}
    </Tag>
  );
}
