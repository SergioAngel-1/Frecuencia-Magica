import { cn } from '@/lib/cn';
import type {
  EditorialOverlayDirection,
  EditorialOverlayProps,
  EditorialScrimTone,
  EditorialTone,
} from '@/types/editorial-media';

/**
 * Peldaño más denso del velo. En el tono `dark` (la noche) es void-2, el punto
 * más oscuro del fondo; no tiene token (`scrim` vale #0f1b2e), así que se queda
 * crudo y figura en ALLOWED de `semantic-color-usage`. En `light` lee `--scrim`.
 */
function denseStop(tone: EditorialScrimTone, alpha: string): string {
  return tone === 'dark' ? `rgba(10,18,32,${alpha})` : `rgb(var(--scrim) / ${alpha})`;
}

/** Peldaño medio del velo: `--scrim`, que en cada atmósfera es el color del velo. */
function scrimStop(alpha: string): string {
  return `rgb(var(--scrim) / ${alpha})`;
}

function scrimGradient(direction: EditorialOverlayDirection, tone: EditorialScrimTone): string {
  switch (direction) {
    case 'left':
      return `linear-gradient(90deg, ${denseStop(tone, '0.86')} 0%, ${scrimStop('0.58')} 44%, transparent 82%)`;
    case 'right':
      return `linear-gradient(270deg, ${denseStop(tone, '0.86')} 0%, ${scrimStop('0.58')} 44%, transparent 82%)`;
    case 'bottom':
      return `linear-gradient(180deg, transparent 24%, ${scrimStop('0.76')} 72%, ${denseStop(tone, '0.88')} 100%)`;
    case 'top':
      return `linear-gradient(0deg, transparent 24%, ${scrimStop('0.76')} 72%, ${denseStop(tone, '0.88')} 100%)`;
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
 * (`tone`) arriba al centro.
 *
 * `scrimTone` elige el esquema del velo. `dark` (por defecto) es el de la
 * noche. `light` es para los scopes de esquema claro (dawn, study, store,
 * marisol): todo el velo lee `--scrim`, que en esas atmósferas ya es claro, y
 * el peldaño void-2 no aparece. En la noche los dos tonos se ven igual salvo
 * ese peldaño, así que el consumidor sólo cambia el tono al cambiar de esquema.
 */
export function EditorialOverlay({
  direction = 'bottom',
  tone = 'gold',
  scrimTone = 'dark',
  className,
}: EditorialOverlayProps) {
  const tint = direction === 'none' ? 'transparent' : TINTS[tone];

  return (
    <div
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 z-10', className)}
      style={{
        backgroundImage: `radial-gradient(80% 90% at 50% 0%, ${tint}, transparent 72%), ${scrimGradient(direction, scrimTone)}`,
      }}
    />
  );
}

export type { EditorialOverlayDirection, EditorialOverlayProps, EditorialScrimTone, EditorialTone };
