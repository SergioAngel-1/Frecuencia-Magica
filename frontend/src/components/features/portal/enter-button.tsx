'use client';

import type { ReactNode } from 'react';

import { Magnetic } from '@/components/ui';
import { cn } from '@/lib/cn';

type EnterButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  /**
   * Estado de tránsito: bloquea nuevas pulsaciones mientras el cruce del
   * portal está en marcha. Lo cablea la Task 6.2 (`useCrossPortal`); aquí
   * sólo se refleja en `aria-busy` y en el bloqueo del click.
   */
  busy?: boolean;
};

/**
 * Botón de entrada del Portal.
 *
 * No es una variante de `Button`: su estructura de tres capas superpuestas
 * (anillo de cristal, glow pulsante, etiqueta) y el anillo que se expande al
 * pasar el ratón son exclusivos de este umbral, así que vive como pieza
 * propia (prototipo líneas 240–244).
 *
 * Sólo expone `onClick`/`disabled`/`busy` — la navegación real del cruce del
 * portal (`usePortalStore`, `useCrossPortal`) la cablea la Task 6.2.
 */
export function EnterButton({
  children,
  onClick,
  disabled = false,
  busy = false,
}: EnterButtonProps) {
  const isInert = disabled || busy;

  return (
    <Magnetic disabled={isInert}>
      <button
        type="button"
        onClick={onClick}
        disabled={isInert}
        aria-busy={busy}
        className={cn(
          'group text-ivory relative min-h-11 px-[46px] py-[18px] font-serif text-[22px] tracking-[.14em] uppercase',
          disabled && 'pointer-events-none opacity-45',
        )}
      >
        {/* Capa 1: cristal — borde y fondo de vidrio */}
        <span
          aria-hidden="true"
          className="rounded-pill absolute inset-0 border border-[rgba(216,185,120,0.5)] bg-[rgba(216,185,120,0.06)] backdrop-blur-[6px] transition-[inset] duration-300 ease-out group-hover:-inset-1"
        />
        {/* Capa 2: glow — respira sola, se intensifica al pasar el ratón */}
        <span
          aria-hidden="true"
          className="animate-fm-glow rounded-pill absolute inset-0 shadow-[0_0_40px_rgba(216,185,120,0.3)] transition-shadow duration-300 ease-out group-hover:shadow-[0_0_56px_rgba(216,185,120,0.45)]"
        />
        {/* Capa 3: etiqueta */}
        <span className="relative">{children}</span>
      </button>
    </Magnetic>
  );
}
