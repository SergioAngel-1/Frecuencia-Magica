import { cn } from '@/lib/cn';
import type {
  EditorialOverlayDirection,
  EditorialOverlayProps,
  EditorialTone,
} from '@/types/editorial-media';

/**
 * Peldaño más denso del velo: lee `--scrim-deep`. En la noche y los temas
 * oscuros vale el navy de siempre (10 18 32); en un tema claro, su propio
 * `--scrim` (ver `tokens.css`), para que el borde del velo no dibuje una franja
 * oscura sobre un fondo claro. El tema decide, no el consumidor.
 */
function denseStop(alpha: string): string {
  return `rgb(var(--scrim-deep) / ${alpha})`;
}

/** Peldaño medio del velo: `--scrim`, que en cada tema es el color del velo. */
function scrimStop(alpha: string): string {
  return `rgb(var(--scrim) / ${alpha})`;
}

function scrimGradient(direction: EditorialOverlayDirection): string {
  switch (direction) {
    case 'left':
      return `linear-gradient(90deg, ${denseStop('0.86')} 0%, ${scrimStop('0.58')} 44%, transparent 82%)`;
    case 'right':
      return `linear-gradient(270deg, ${denseStop('0.86')} 0%, ${scrimStop('0.58')} 44%, transparent 82%)`;
    case 'bottom':
      return `linear-gradient(180deg, transparent 24%, ${scrimStop('0.76')} 72%, ${denseStop('0.88')} 100%)`;
    case 'top':
      return `linear-gradient(0deg, transparent 24%, ${scrimStop('0.76')} 72%, ${denseStop('0.88')} 100%)`;
    case 'none':
      return 'none';
  }
}

const TINTS: Record<EditorialTone, string> = {
  gold: 'rgb(var(--halo) / 0.08)',
  teal: 'color-mix(in srgb, var(--color-accent-2) 8%, transparent)',
  lav: 'color-mix(in srgb, var(--color-accent-3) 8%, transparent)',
  ivory: 'color-mix(in srgb, var(--color-fg) 5%, transparent)',
};

/**
 * Velo editorial: un degradado de dirección (`direction`) y un tinte de acento
 * (`tone`) arriba al centro. Los colores salen de los tokens del tema activo
 * (`--scrim`, `--scrim-deep`, `--halo`): el mismo componente vale para los cinco.
 */
export function EditorialOverlay({
  direction = 'bottom',
  tone = 'gold',
  className,
}: EditorialOverlayProps) {
  const tint = direction === 'none' ? 'transparent' : TINTS[tone];

  return (
    <div
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 z-10', className)}
      style={{
        backgroundImage: `radial-gradient(80% 90% at 50% 0%, ${tint}, transparent 72%), ${scrimGradient(direction)}`,
      }}
    />
  );
}

export type { EditorialOverlayDirection, EditorialOverlayProps, EditorialTone };
