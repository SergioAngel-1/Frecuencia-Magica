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
          'group text-ivory relative min-h-11 px-[46px] py-[18px] font-serif text-[22px] tracking-[.14em] uppercase',
          isBusy && 'pointer-events-none opacity-45',
        )}
      >
        <span
          aria-hidden="true"
          className="rounded-pill absolute inset-0 scale-100 border border-[rgba(216,185,120,0.5)] bg-[rgba(216,185,120,0.06)] backdrop-blur-[6px] transition-transform duration-300 ease-out group-hover:scale-[1.03]"
        />
        <span
          aria-hidden="true"
          className="animate-fm-glow rounded-pill absolute inset-0 shadow-[0_0_40px_rgba(216,185,120,0.3)] transition-shadow duration-300 ease-out group-hover:shadow-[0_0_56px_rgba(216,185,120,0.45)]"
        />
        <span className="relative">{children}</span>
      </button>
    </Magnetic>
  );
}
