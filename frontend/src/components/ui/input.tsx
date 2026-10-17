import { forwardRef, type InputHTMLAttributes } from 'react';

import { cn } from '@/lib/cn';

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

/**
 * Campo de texto nativo envuelto: fondo glass, borde `--glass-brd`, radio
 * 14px (`rounded-field`, dentro del rango 13–14px del brief). Sin `outline`
 * nativo — el foco propio (borde dorado + halo de 3px) lo aporta la clase
 * `focus:` de abajo. `aria-[invalid=true]` vira el borde a `--color-warn`
 * cuando `Field` marca el control como inválido; no hace falta una prop de
 * error redundante aquí.
 *
 * `forwardRef` + spread de props nativas: no añade estado propio, así que
 * no necesita `"use client"` — el cliente que lo monte (login, newsletter,
 * reserva...) sí lo será.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      className={cn(
        'rounded-field border-line bg-surface min-h-11 w-full border px-[16px] py-[14px]',
        'text-fg text-body placeholder:text-fg-meta font-sans',
        'transition-[border-color,box-shadow] duration-300 ease-out outline-none',
        'focus:border-line-strong focus:shadow-[0_0_0_3px_rgb(var(--halo)_/_0.12)]',
        'aria-[invalid=true]:border-warn',
        className,
      )}
      {...rest}
    />
  );
});
