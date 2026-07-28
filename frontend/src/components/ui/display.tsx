import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type DisplaySize = 'hero' | 'xl' | 'lg' | 'md' | 'sm' | 'xs';
export type DisplayLevel = 'h1' | 'h2' | 'h3' | 'span';

interface DisplayProps {
  children: ReactNode;
  /** Elemento semántico. Por defecto `h2`. */
  level?: DisplayLevel;
  /** Escala tipográfica. Por defecto `lg`. */
  size?: DisplaySize;
  /** Activa la variante cursiva completa del título. */
  italic?: boolean;
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
export function Display({ children, level = 'h2', size = 'lg', italic = false, className }: DisplayProps) {
  const Tag = level;

  return (
    <Tag className={cn('font-serif font-light', SIZE_CLASSES[size], italic && 'italic', className)}>{children}</Tag>
  );
}

/**
 * Fragmento cursivo con degradado de texto oro→teal→lavanda (patrón
 * `heroTitleEm`). Pensado como hijo inline de `Display`, no como componente
 * de nivel de bloque.
 */
export function GradientText({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <em
      className={cn(
        'bg-[linear-gradient(100deg,var(--color-gold),var(--color-teal)_55%,var(--color-lav))] bg-clip-text italic text-transparent',
        className,
      )}
    >
      {children}
    </em>
  );
}
