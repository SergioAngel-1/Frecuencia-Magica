import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type DisplaySize = 'hero' | 'xl' | 'feature' | 'lg' | 'md' | 'sm' | 'xs';
export type DisplayLevel = 'h1' | 'h2' | 'h3' | 'span';

interface DisplayProps {
  children: ReactNode;
  /** Elemento semántico. Por defecto `h2`. */
  level?: DisplayLevel;
  /** Escala tipográfica. Por defecto `lg`. */
  size?: DisplaySize;
  /** Activa la variante cursiva completa del título. */
  italic?: boolean;
  /** Para `aria-labelledby` de la sección que encabeza. */
  id?: string;
  className?: string;
}

/**
 * Clamps reales del prototipo (portalTitle, heroTitle, libTitle/acTitle/
 * expTitle/stTitle, memberTitle, audioTitle, bookTitle). El line-height
 * acompaña cada escalón dentro del rango .98–1.05 que fija el brief.
 */
const SIZE_CLASSES: Record<DisplaySize, string> = {
  hero: 'text-[clamp(46px,8vw,104px)] leading-[.98]',
  xl: 'text-[clamp(46px,6.2vw,86px)] leading-[1]',
  /** Titular de la pieza destacada de una vista (curso, experiencia, realm). */
  feature: 'text-[clamp(38px,6vw,78px)] leading-[.92]',
  lg: 'text-[clamp(36px,5.5vw,72px)] leading-[1]',
  md: 'text-[clamp(30px,4.4vw,56px)] leading-[1.05]',
  sm: 'text-[clamp(28px,3.6vw,46px)] leading-[1.05]',
  xs: 'text-[clamp(28px,4vw,44px)] leading-[1.05]',
};

/**
 * Título en Cormorant Garamond peso 300. `level` decide el elemento
 * semántico (o `span` para uso inline dentro de otro título), `size` fija la
 * escala y `italic` activa la variante cursiva completa.
 *
 * Para contenido mixto con un fragmento enfatizado (patrón `heroTitleEm`,
 * prototipo línea 261: cursiva con degradado oro→teal→lavanda) envolver ese
 * fragmento con `GradientText` entre los hijos de `Display`:
 *
 * ```tsx
 * <Display size="xl">
 *   {heroTitlePre}{' '}
 *   <GradientText>{heroTitleEm}</GradientText>
 * </Display>
 * ```
 */
export function Display({
  children,
  level = 'h2',
  size = 'lg',
  italic = false,
  id,
  className,
}: DisplayProps) {
  const Tag = level;

  return (
    <Tag
      id={id}
      className={cn('font-serif font-light', SIZE_CLASSES[size], italic && 'italic', className)}
    >
      {children}
    </Tag>
  );
}
