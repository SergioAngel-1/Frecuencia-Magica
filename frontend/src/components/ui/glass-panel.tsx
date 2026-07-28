import type { CSSProperties, ElementType, HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/cn';

/**
 * Radios exactos que pide el brief 4.3: 22px (por defecto) y 26px para
 * cards destacadas ya tienen token propio (`rounded-card`/`rounded-card-lg`);
 * los tres escalones menores (20/18/16px) no lo tienen, así que se expresan
 * como valor arbitrario. Las claves son literales estáticas en el objeto de
 * abajo (nunca interpoladas en runtime), que es lo que exige Tailwind v4
 * para poder generarlas: no puede ver una clase construida con un template
 * string dinámico.
 */
export type GlassPanelRadius = 16 | 18 | 20 | 22 | 26;

const RADIUS_CLASSES: Record<GlassPanelRadius, string> = {
  16: 'rounded-[16px]',
  18: 'rounded-[18px]',
  20: 'rounded-[20px]',
  22: 'rounded-card',
  26: 'rounded-card-lg',
};

/** Elementos semánticos habituales para una card: contenedor, tarjeta de lista, figura con imagen... */
export type GlassPanelTag = 'div' | 'section' | 'article' | 'li' | 'figure';

interface GlassPanelOwnProps {
  children?: ReactNode;
  /** Radio de esquina en px. Por defecto 22 (`rounded-card`). */
  radius?: GlassPanelRadius;
  /**
   * Intensidad del `backdrop-filter: blur()` en px. `fm-surface` ya aplica
   * 12px (dentro del rango 10–14px de constraints.md); este prop sólo hace
   * falta cuando una card puntual pide un valor distinto.
   */
  blur?: number;
  /** Añade un halo de acento: `box-shadow` de baja opacidad y blur alto. */
  glow?: boolean;
  /** `false` quita el borde de `fm-surface`, para cards con su propio borde de acento. Por defecto `true`. */
  bordered?: boolean;
  /** Elemento semántico a renderizar. Por defecto `div`. */
  as?: GlassPanelTag;
  className?: string;
}

export type GlassPanelProps = GlassPanelOwnProps &
  Omit<HTMLAttributes<HTMLElement>, keyof GlassPanelOwnProps | 'style'> & {
    style?: CSSProperties;
  };

/**
 * Superficie de vidrio base de todas las cards: fondo `--glass`, borde
 * `--glass-brd` y blur vía la utilidad `fm-surface`, con radio/halo/borde
 * configurables por props. Server Component puro — sin estado ni efectos,
 * no importa de `data/`, `stores/` ni `i18n/`.
 *
 * `blur` y `bordered={false}` se aplican vía `style` inline en vez de vía
 * clases: `fm-surface` fija ambos en una única declaración CSS (`@utility`),
 * así que una clase Tailwind añadida después no tiene garantía de ganarle en
 * cascada. El `style` inline sí gana siempre.
 */
export function GlassPanel({
  children,
  radius = 22,
  blur,
  glow = false,
  bordered = true,
  as = 'div',
  className,
  style,
  ...rest
}: GlassPanelProps) {
  const Tag = as as ElementType;

  return (
    <Tag
      className={cn(
        'fm-surface relative',
        RADIUS_CLASSES[radius],
        glow && 'shadow-[0_0_60px_rgba(216,185,120,0.18)]',
        className,
      )}
      style={{
        ...(blur !== undefined ? { backdropFilter: `blur(${blur}px)` } : null),
        ...(bordered ? null : { border: 'none' }),
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
