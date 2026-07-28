'use client';

import {
  cloneElement,
  isValidElement,
  type ButtonHTMLAttributes,
  type MouseEvent as ReactMouseEvent,
  type ReactElement,
  type ReactNode,
} from 'react';

import { cn } from '@/lib/cn';
import { Magnetic } from './magnetic';

export type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'glass' | 'accent';
export type ButtonSize = 'sm' | 'md' | 'lg';
/** Sólo tiene efecto sobre `variant="accent"`: vira el acento oro a teal o lavanda. */
export type ButtonTone = 'gold' | 'teal' | 'lav';

interface ButtonOwnProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  tone?: ButtonTone;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  /**
   * Aspecto normal más pulso de luz (`animate-fm-glow`) sobre la etiqueta;
   * pone `aria-busy` y bloquea el click, pero NO aplica la opacidad de
   * `disabled` — ver el comentario de `Button` para el detalle.
   */
  loading?: boolean;
  /**
   * Traslada el estilo y el comportamiento del botón a su único hijo (p. ej.
   * el `Link` de `@/i18n/navigation`) en vez de renderizar un `<button>`.
   * El hijo asume la semántica interactiva (enlace, teclado, foco).
   */
  asChild?: boolean;
  children: ReactNode;
}

export type ButtonProps = ButtonOwnProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | keyof ButtonOwnProps>;

/** Props mínimas que necesitamos leer/escribir al clonar el hijo de `asChild`. */
interface SlotProps {
  className?: string;
  children?: ReactNode;
  // Índice de firma: permite fusionar el resto de props (aria-*, onClick...)
  // sin que TypeScript rechace las claves por exceso de propiedades.
  [key: string]: unknown;
}

/**
 * Base común a las cinco variantes (paso 6 del brief 4.2): píldora completa,
 * serif con tracking amplio, altura mínima de hit target y transición de
 * .3s para los estados. El foco visible lo aporta ya la regla global
 * `:focus-visible` de `globals.css`; aquí no se toca `outline`.
 *
 * La transición enumera sólo color/fondo/borde/sombra/opacidad — nunca
 * `all`: `backdrop-filter` (variante `glass`) y propiedades de layout quedan
 * fuera a propósito. El transform lo anima el muelle de `Magnetic`.
 *
 * Los estados `disabled`/`loading` NO se resuelven con el pseudo-selector
 * `:disabled` (ver `stateClasses` más abajo): así el mismo cálculo sirve
 * tanto para el `<button>` nativo como para el hijo clonado de `asChild`,
 * que nunca puede matchear `:disabled`.
 */
const BASE =
  'relative inline-flex items-center justify-center rounded-pill font-serif tracking-[.05em] ' +
  'transition-[color,background-color,border-color,box-shadow,opacity] duration-300 ease-out active:scale-[0.98]';

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'min-h-11 px-[clamp(18px,3vw,26px)] py-[clamp(8px,1.2vw,11px)] text-[17px]',
  md: 'min-h-11 px-[clamp(26px,4vw,34px)] py-[clamp(12px,1.6vw,15px)] text-[clamp(18px,2vw,19px)]',
  lg: 'min-h-11 px-[clamp(32px,5vw,46px)] py-[clamp(16px,2vw,18px)] text-[clamp(19px,2.4vw,22px)]',
};

/** Variantes que no dependen de `tone` (todas salvo `accent`). */
const VARIANT_CLASSES: Record<Exclude<ButtonVariant, 'accent'>, string> = {
  primary:
    'bg-[rgba(247,244,234,0.95)] text-[#12213a] font-medium shadow-[0_10px_40px_rgba(216,185,120,0.22)] ' +
    'hover:bg-[rgba(247,244,234,1)] hover:shadow-[0_14px_48px_rgba(216,185,120,0.34)]',
  outline:
    'bg-transparent border border-[rgba(247,244,234,0.22)] text-ivory ' +
    'hover:bg-[rgba(247,244,234,0.06)] hover:border-[rgba(247,244,234,0.34)]',
  glass:
    'bg-glass border border-[rgba(247,244,234,0.22)] text-ivory backdrop-blur-[8px] ' +
    'hover:bg-[rgba(247,244,234,0.09)] hover:border-[rgba(247,244,234,0.34)]',
  ghost:
    'bg-transparent text-[rgba(247,244,234,0.6)] font-sans text-[13px] tracking-[.12em] ' +
    'hover:text-[rgba(247,244,234,0.85)]',
};

/** `accent` vira de color según `tone`; el oro es el valor por defecto. */
const ACCENT_TONE_CLASSES: Record<ButtonTone, string> = {
  gold: 'bg-[rgba(216,185,120,0.12)] border-[rgba(216,185,120,0.55)] hover:bg-[rgba(216,185,120,0.2)] hover:shadow-[0_0_24px_rgba(216,185,120,0.25)]',
  teal: 'bg-[rgba(150,198,188,0.14)] border-[rgba(150,198,188,0.5)] hover:bg-[rgba(150,198,188,0.22)] hover:shadow-[0_0_24px_rgba(150,198,188,0.25)]',
  lav: 'bg-[rgba(185,176,214,0.14)] border-[rgba(185,176,214,0.5)] hover:bg-[rgba(185,176,214,0.22)] hover:shadow-[0_0_24px_rgba(185,176,214,0.25)]',
};

/**
 * Botón con cinco variantes de marca (`primary/outline/ghost/glass/accent`),
 * magnetismo integrado y los seis estados que exige el PRD Parte 2 (default,
 * hover, focus, pressed, loading, disabled).
 *
 * El contenido va siempre envuelto en `Magnetic` salvo que `disabled` sea
 * verdadero (paso 6 del brief).
 *
 * `disabled` y `loading` son estados independientes, no un único apagado:
 * - `disabled` aplica la opacidad reducida (.45) y anula los eventos de
 *   puntero, vía clases explícitas — nunca vía `:disabled` — para que el
 *   mismo cálculo funcione también en el hijo clonado de `asChild`.
 * - `loading` mantiene el aspecto normal (más el pulso `animate-fm-glow`
 *   sobre la etiqueta) y pone `aria-busy`. Bloquea el click — tanto por
 *   puntero como por teclado — mediante `handleClick` y anula los eventos
 *   de puntero de paso (silencia el magnetismo), pero sin la opacidad de
 *   `disabled`.
 */
export function Button({
  variant = 'primary',
  size = 'md',
  tone = 'gold',
  iconLeft,
  iconRight,
  loading = false,
  disabled = false,
  asChild = false,
  className,
  children,
  type = 'button',
  onClick,
  ...rest
}: ButtonProps) {
  const variantClasses = variant === 'accent' ? cn('border', ACCENT_TONE_CLASSES[tone], 'text-ivory') : VARIANT_CLASSES[variant];
  // Estado explícito, no pseudo-clase: `disabled` trae opacidad + anula
  // puntero; `loading` sólo anula puntero (el click además se bloquea en
  // `handleClick`, que también cubre la activación por teclado).
  const stateClasses = cn(loading && !disabled && 'pointer-events-none', disabled && 'pointer-events-none opacity-45');
  const classes = cn(BASE, SIZE_CLASSES[size], variantClasses, stateClasses, className);

  const handleClick = (event: ReactMouseEvent<HTMLButtonElement>): void => {
    if (disabled || loading) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  const buildContent = (label: ReactNode) => (
    <span className="inline-flex items-center gap-2">
      {iconLeft ? (
        <span aria-hidden="true" className="inline-flex shrink-0 items-center">
          {iconLeft}
        </span>
      ) : null}
      <span className={cn(loading && 'animate-fm-glow')}>{label}</span>
      {iconRight ? (
        <span aria-hidden="true" className="inline-flex shrink-0 items-center">
          {iconRight}
        </span>
      ) : null}
    </span>
  );

  if (asChild) {
    if (!isValidElement(children)) return null;

    const child = children as ReactElement<SlotProps>;

    return cloneElement(child, {
      ...rest,
      onClick: handleClick,
      className: cn(classes, child.props.className),
      'aria-busy': loading,
      // El hijo clonado (p. ej. un `Link`) no puede matchear `:disabled` ni
      // recibir el atributo nativo: se anuncia vía `aria-disabled` y se
      // corta la interacción con las clases explícitas de `stateClasses`.
      'aria-disabled': disabled ? true : undefined,
      children: disabled ? buildContent(child.props.children) : <Magnetic>{buildContent(child.props.children)}</Magnetic>,
    });
  }

  return (
    <button type={type} disabled={disabled} aria-busy={loading} onClick={handleClick} className={classes} {...rest}>
      {disabled ? buildContent(children) : <Magnetic>{buildContent(children)}</Magnetic>}
    </button>
  );
}
