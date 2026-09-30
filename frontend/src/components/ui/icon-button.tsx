'use client';

import type { ButtonHTMLAttributes, MouseEvent as ReactMouseEvent, ReactNode } from 'react';

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
  /**
   * Aspecto normal más pulso de luz (`animate-fm-glow`); pone `aria-busy` y
   * bloquea el click, pero NO aplica la opacidad de `disabled`.
   */
  loading?: boolean;
}

export type IconButtonProps = IconButtonOwnProps &
  Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'children' | keyof IconButtonOwnProps | 'aria-label'
  >;

// El botón entero es el hit target (44px, suelo de accesibilidad). La
// superficie glass visible es más pequeña (40px) y va centrada dentro por
// flex, tal como pide el brief: "visualmente 40px con área táctil ampliada
// por padding".
const HIT_AREA_CLASSES: Record<IconButtonSize, string> = {
  sm: 'h-11 w-11 min-h-11 min-w-11',
  md: 'h-11 w-11 min-h-11 min-w-11',
};

const SURFACE_SIZE_CLASSES: Record<IconButtonSize, string> = {
  sm: 'h-10 w-10 text-body',
  md: 'h-10 w-10 text-lead',
};

/**
 * Botón cuadrado sólo-icono: superficie glass, redondo, borde `--glass-brd`.
 * `active` lo vira al mismo tratamiento dorado que usa el icono de sesión
 * cuando la ruta activa es `/acceso`.
 *
 * Mismos seis estados que `Button` (default/hover/focus/pressed/loading/
 * disabled) y el mismo contrato de magnetismo: el contenido se envuelve en
 * `Magnetic` salvo que `disabled` sea verdadero.
 *
 * `disabled` y `loading` son estados independientes (ver el mismo comentario
 * en `button.tsx`): la opacidad reducida y la anulación de puntero se
 * calculan con clases explícitas — nunca con `:disabled`/`group-disabled` —
 * para que `disabled` sea el único que apaga visualmente el control y
 * `loading` sólo bloquee el click (por puntero y por teclado, vía
 * `handleClick`) manteniendo el aspecto normal más el pulso de luz.
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
  onClick,
  ...rest
}: IconButtonProps) {
  const handleClick = (event: ReactMouseEvent<HTMLButtonElement>): void => {
    if (disabled || loading) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  const surface = (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex items-center justify-center rounded-full border backdrop-blur-[10px]',
        'transition-[color,background-color,border-color,box-shadow,opacity] duration-300 ease-out group-active:scale-[0.98]',
        SURFACE_SIZE_CLASSES[size],
        loading && 'animate-fm-glow',
        disabled && 'opacity-45',
        active
          ? 'text-gold border-gold/60 bg-gold/18'
          : 'border-glass-brd bg-glass text-ivory group-hover:border-gold/40 group-hover:bg-ivory/9',
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
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        'group relative inline-flex items-center justify-center',
        (disabled || loading) && 'pointer-events-none',
        HIT_AREA_CLASSES[size],
        className,
      )}
      {...rest}
    >
      {disabled ? surface : <Magnetic>{surface}</Magnetic>}
    </button>
  );
}
