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
   * `rgba(216,185,120,0.92)`, texto `ink`. Por defecto `false`
   * (variante translúcida: fondo `rgba(15,27,46,0.35)`, borde marfil).
   */
  solid?: boolean;
  className?: string;
}

export type BadgeProps = BadgeOwnProps & Omit<HTMLAttributes<HTMLSpanElement>, keyof BadgeOwnProps>;

/**
 * Píldora corta en mayúsculas (badge "Destacado", etiquetas de nivel/modo...).
 * Server Component puro, texto ya traducido vía `children`.
 *
 * `w-fit self-start`: dentro de un contenedor `flex-col` una píldora
 * `inline-flex` se estira al ancho de la columna y el oro sólido pasa de
 * etiqueta a barra. El acento es luz, no relleno grande.
 */
export function Badge({ children, tone = 'gold', solid = false, className, ...rest }: BadgeProps) {
  return (
    <span
      className={cn(
        'rounded-pill text-label tracking-caps inline-flex w-fit items-center self-start px-[14px] py-[6px] font-sans whitespace-nowrap uppercase',
        solid
          ? 'bg-gold/92 text-ink'
          : cn('border-ivory/16 bg-void/35 border', TONE_TEXT_CLASSES[tone]),
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
