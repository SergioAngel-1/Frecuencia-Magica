import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * Fragmento cursivo con degradado de texto oro→teal→lavanda (patrón
 * `heroTitleEm`). Pensado como hijo inline de `Display`, no como componente
 * de nivel de bloque.
 */
export function GradientText({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <em
      className={cn(
        'bg-[linear-gradient(100deg,var(--color-accent),var(--color-accent-2)_55%,var(--color-accent-3))] bg-clip-text text-transparent',
        className,
      )}
    >
      {children}
    </em>
  );
}
