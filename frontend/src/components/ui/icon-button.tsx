'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/cn';
import { Magnetic } from './magnetic';

export type IconButtonSize = 'sm' | 'md';

interface IconButtonOwnProps {
  /** Icono a mostrar; único contenido del botón. */
  children: ReactNode;
  /**
   * Nombre accesible obligatorio: al no haber texto visible, se convierte en
   * `aria-label`. Sin este prop no hay forma de que un lector de pantalla
   * anuncie qué hace el botón.
   */
  label: string;
  size?: IconButtonSize;
  /** Estado activo (p. ej. el icono de sesión mientras estás en `/acceso`). */
  active?: boolean;
  loading?: boolean;
}

export type IconButtonProps = IconButtonOwnProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | keyof IconButtonOwnProps | 'aria-label'>;

// El botón entero es el hit target (44px, suelo de accesibilidad). La
// superficie glass visible es más pequeña (40px) y va centrada dentro por
// flex, tal como pide el brief: "visualmente 40px con área táctil ampliada
// por padding".
const HIT_AREA_CLASSES: Record<IconButtonSize, string> = {
  sm: 'h-11 w-11 min-h-11 min-w-11',
  md: 'h-11 w-11 min-h-11 min-w-11',
};

const SURFACE_SIZE_CLASSES: Record<IconButtonSize, string> = {
  sm: 'h-10 w-10 text-[15px]',
  md: 'h-10 w-10 text-[17px]',
};

/**
 * Botón cuadrado sólo-icono: superficie glass, redondo, borde `--glass-brd`.
 * `active` lo vira al mismo tratamiento dorado que usa el icono de sesión
 * cuando la ruta activa es `/acceso`.
 *
 * Mismos seis estados que `Button` (default/hover/focus/pressed/loading/
 * disabled) y el mismo contrato de magnetismo: el contenido se envuelve en
 * `Magnetic` salvo que `disabled` sea verdadero.
 */
export function IconButton({
  children,
  label,
  size = 'md',
  active = false,
  loading = false,
  disabled = false,
  className,
  type = 'button',
  ...rest
}: IconButtonProps) {
  const surface = (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex items-center justify-center rounded-full border backdrop-blur-[10px]',
        'transition-all duration-300 ease-out group-active:scale-[0.98] group-disabled:opacity-45',
        SURFACE_SIZE_CLASSES[size],
        loading && 'animate-fm-glow',
        active
          ? 'border-[rgba(216,185,120,0.6)] bg-[rgba(216,185,120,0.18)] text-gold'
          : 'border-glass-brd bg-glass text-ivory group-hover:bg-[rgba(247,244,234,0.09)] group-hover:border-[rgba(216,185,120,0.4)]',
      )}
    >
      {children}
    </span>
  );

  return (
    <button
      type={type}
      aria-label={label}
      aria-busy={loading}
      aria-pressed={active}
      disabled={disabled || loading}
      className={cn(
        'group relative inline-flex items-center justify-center disabled:pointer-events-none',
        HIT_AREA_CLASSES[size],
        className,
      )}
      {...rest}
    >
      {disabled ? surface : <Magnetic>{surface}</Magnetic>}
    </button>
  );
}
