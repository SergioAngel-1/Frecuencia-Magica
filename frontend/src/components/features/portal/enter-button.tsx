'use client';

import type { ReactNode } from 'react';

import { useCrossPortal } from '@/hooks/use-cross-portal';
import { usePortalStore } from '@/stores/portal-store';
import { Magnetic } from '@/components/ui';
import { cn } from '@/lib/cn';

type EnterButtonProps = {
  children: ReactNode;
};

/**
 * Botón de entrada del Portal.
 *
 * No es una variante de `Button`: su estructura de tres capas superpuestas
 * (anillo de cristal, glow pulsante, etiqueta) y el anillo que se expande al
 * pasar el ratón son exclusivos de este umbral, así que vive como pieza
 * propia (prototipo líneas 240–244).
 *
 * Cablea internamente `useCrossPortal` para disparar la coreografía completa
 * (audio ambiental + overlay + navegación) y refleja el estado de tránsito en
 * `aria-busy` y `disabled`.
 */
export function EnterButton({ children }: EnterButtonProps) {
  const phase = usePortalStore((s) => s.phase);
  const cross = useCrossPortal();
  const isBusy = phase !== 'idle';

  return (
    <Magnetic disabled={isBusy}>
      <button
        type="button"
        onClick={cross}
        disabled={isBusy}
        aria-busy={isBusy}
        className={cn(
          'group text-fg tracking-label relative inline-flex min-h-14 min-w-[min(100%,280px)] items-center justify-center px-[34px] py-[15px] font-serif text-[20px] uppercase transition-opacity duration-500 ease-out md:px-[46px] md:text-[22px]',
          isBusy && 'pointer-events-none opacity-0',
        )}
      >
        <span
          aria-hidden="true"
          className="rounded-pill border-accent/50 bg-accent/6 absolute inset-0 scale-100 border backdrop-blur-[6px] transition-transform duration-300 ease-out group-hover:scale-[1.03]"
        />
        <span
          aria-hidden="true"
          className="animate-fm-glow rounded-pill absolute inset-0 shadow-[0_0_40px_rgb(var(--halo)_/_0.3)] transition-shadow duration-300 ease-out group-hover:shadow-[0_0_56px_rgb(var(--halo)_/_0.45)]"
        />
        <span className="relative">{children}</span>
      </button>
    </Magnetic>
  );
}
