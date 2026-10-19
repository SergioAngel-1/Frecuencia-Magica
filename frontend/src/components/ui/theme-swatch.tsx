import type { AtmosphereId } from '@/types/atmosphere';

import { cn } from '@/lib/cn';

export type ThemeSwatchSize = 'xs' | 'sm' | 'lg';

/**
 * Medidas en px, en `style` y no en clases: el disco lleva `data-atmosphere`, y un ancho de
 * clase no gana al del contenedor flex de la píldora que lo aloja.
 */
const SIZES: Record<ThemeSwatchSize, { disc: number; dot: number }> = {
  xs: { disc: 14, dot: 4 },
  sm: { disc: 24, dot: 8 },
  lg: { disc: 44, dot: 14 },
};

/**
 * Muestra de un tema: un disco con su fondo y un punto de su acento. Se pinta con los tokens
 * del propio tema (`data-atmosphere` en la muestra), así que siempre enseña el tema que dice,
 * no el activo. Decorativa: el nombre del tema lo da quien la usa.
 */
export function ThemeSwatch({
  theme,
  size = 'sm',
  className,
}: {
  theme: AtmosphereId;
  size?: ThemeSwatchSize;
  className?: string;
}) {
  const { disc, dot } = SIZES[size];

  return (
    <span
      aria-hidden="true"
      data-atmosphere={theme}
      className={cn(
        'border-line-strong relative inline-block flex-none overflow-hidden rounded-full border bg-[image:var(--atmo-bg)]',
        disc,
        className,
      )}
      style={{ width: disc, height: disc }}
    >
      <span
        className="bg-accent absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ width: dot, height: dot }}
      />
    </span>
  );
}
