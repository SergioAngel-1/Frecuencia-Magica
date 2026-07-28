import { forwardRef, type TextareaHTMLAttributes } from 'react';

import { cn } from '@/lib/cn';

export type TextareaVariant = 'default' | 'journal';

interface TextareaOwnProps {
  /**
   * `journal` cambia a serif 17px (el diario de "Mi santuario"); `default`
   * (formularios de contacto/reserva) se queda en sans 15px.
   */
  variant?: TextareaVariant;
}

export type TextareaProps = TextareaOwnProps & TextareaHTMLAttributes<HTMLTextAreaElement>;

const VARIANT_CLASSES: Record<TextareaVariant, string> = {
  default: 'font-sans text-[15px]',
  journal: 'font-serif text-[17px] leading-[1.6]',
};

/**
 * Igual que `Input` (glass, borde, radio, foco propio, `aria-invalid` →
 * `--color-warn`) pero para texto multilínea: `resize-none` siempre — el
 * tamaño lo decide el layout, no el usuario arrastrando la esquina.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { variant = 'default', className, ...rest },
  ref,
) {
  return (
    <textarea
      ref={ref}
      className={cn(
        'rounded-field border-glass-brd bg-glass w-full resize-none border px-[20px] py-[16px]',
        'text-ivory placeholder:text-[rgba(247,244,234,0.4)]',
        'transition-[border-color,box-shadow] duration-300 ease-out outline-none',
        'focus:border-[rgba(216,185,120,0.55)] focus:shadow-[0_0_0_3px_rgba(216,185,120,0.12)]',
        'aria-[invalid=true]:border-warn',
        VARIANT_CLASSES[variant],
        className,
      )}
      {...rest}
    />
  );
});
