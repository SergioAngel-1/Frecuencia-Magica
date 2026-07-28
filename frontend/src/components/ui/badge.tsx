import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/cn';

export type BadgeTone = 'gold' | 'teal' | 'lav';

const TONE_TEXT_CLASSES: Record<BadgeTone, string> = {
  gold: 'text-gold',
  teal: 'text-teal',
  lav: 'text-lav',
};

interface BadgeOwnProps {
  children: ReactNode;
  /**
   * Acento del texto en la variante translúcida. Fondo y borde de esa
   * variante son valores fijos del brief 4.3 (no cambian con `tone`).
   * Sin efecto cuando `solid` es `true`: el tratamiento "Destacado" es
   * siempre oro, valor exacto del prototipo. Por defecto `'gold'`.
   */
  tone?: BadgeTone;
  /**
   * `true` = tratamiento "Destacado": fondo oro sólido
   * `rgba(216,185,120,0.92)`, texto `#12213a`. Por defecto `false`
   * (variante translúcida: fondo `rgba(15,27,46,0.35)`, borde marfil).
   */
  solid?: boolean;
  className?: string;
}

export type BadgeProps = BadgeOwnProps & Omit<HTMLAttributes<HTMLSpanElement>, keyof BadgeOwnProps>;

/**
 * Píldora corta en mayúsculas (badge "Destacado", etiquetas de nivel/modo...).
 * Server Component puro, texto ya traducido vía `children`.
 */
export function Badge({ children, tone = 'gold', solid = false, className, ...rest }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center whitespace-nowrap rounded-pill px-[14px] py-[6px] font-sans text-[10px] uppercase tracking-[.2em]',
        solid
          ? 'bg-[rgba(216,185,120,0.92)] text-[#12213a]'
          : cn('border border-[rgba(247,244,234,0.16)] bg-[rgba(15,27,46,0.35)]', TONE_TEXT_CLASSES[tone]),
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
