'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/cn';
import { Magnetic } from './magnetic';

interface PillOwnProps {
  children: ReactNode;
  /** Estado activo/seleccionado (filtro elegido, idioma actual...). */
  active?: boolean;
  className?: string;
}

export type PillProps = PillOwnProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | keyof PillOwnProps>;

/**
 * Píldora de filtro/toggle: la usa el filtro de biblioteca y el selector de
 * idioma. Cliente porque es interactiva (`onClick`, estado `active`).
 * El `<button>` es la raíz y `Magnetic` envuelve sólo el contenido interno,
 * igual que `Button`/`IconButton`: el prototipo marca sus pills de filtro
 * con `data-magnetic` (línea 551 de `Frecuencia Magica.dc.html`), así que
 * responden al mismo cursor luminoso.
 *
 * Altura mínima 44px (suelo de hit target), transición de .3s y
 * `aria-pressed` reflejando `active` — nunca se resuelve con `:disabled`,
 * el `disabled` nativo del `<button>` ya cubre puntero y teclado.
 */
export function Pill({
  children,
  active = false,
  disabled = false,
  className,
  type = 'button',
  ...rest
}: PillProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      aria-pressed={active}
      className={cn(
        'inline-flex min-h-11 items-center justify-center rounded-pill border font-sans text-[13px] tracking-[.08em]',
        'px-5 py-2 transition-[color,background-color,border-color] duration-300 ease-out active:scale-[0.98]',
        disabled && 'pointer-events-none opacity-45',
        active
          ? 'border-[rgba(216,185,120,0.55)] bg-[rgba(216,185,120,0.16)] text-ivory'
          : 'border-[rgba(247,244,234,0.14)] bg-[rgba(247,244,234,0.04)] text-[rgba(247,244,234,0.7)] hover:bg-[rgba(247,244,234,0.08)] hover:border-[rgba(247,244,234,0.22)]',
        className,
      )}
      {...rest}
    >
      {disabled ? children : <Magnetic>{children}</Magnetic>}
    </button>
  );
}
