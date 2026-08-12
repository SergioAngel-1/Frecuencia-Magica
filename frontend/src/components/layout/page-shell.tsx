import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

/**
 * Anchos máximos reales del prototipo. Los nombres describen el uso, no el
 * número: así una vista pide `width="form"` sin tener que saber que son
 * 820px.
 */
export type ShellWidth = 'wide' | 'store' | 'default' | 'narrow' | 'form' | 'focus' | 'result';

const WIDTH_CLASSES: Record<ShellWidth, string> = {
  wide: 'max-w-[1280px]', // home, biblioteca
  store: 'max-w-[1240px]', // tienda
  default: 'max-w-[1200px]', // academia, experiencias, santuario
  narrow: 'max-w-[1080px]', // sobre Marisol, membresía
  form: 'max-w-[820px]', // checkout
  focus: 'max-w-[720px]', // reserva
  result: 'max-w-[680px]', // resultado de Descúbrete
};

/**
 * `realm` deja sitio al header fijo (130px arriba); `centered` es para las
 * vistas que se resuelven en el centro de la pantalla. En móvil ambos
 * reducen el padding lateral y el superior.
 */
export type ShellPadding = 'realm' | 'centered' | 'none';

const PADDING_CLASSES: Record<ShellPadding, string> = {
  realm: 'px-6 pt-[100px] pb-[70px] md:px-[8vw] md:pt-[130px] md:pb-[90px]',
  centered: 'px-6 pt-[100px] pb-[70px] md:px-6 md:pt-[120px] md:pb-[80px]',
  none: '',
};

export interface PageShellProps {
  children: ReactNode;
  width?: ShellWidth;
  padding?: ShellPadding;
  className?: string;
  fullBleed?: boolean;
  editorial?: boolean;
  reserveBottomUi?: boolean;
}

export type PageShellClassOptions = Omit<PageShellProps, 'children'>;

/**
 * Derives the shell classes without mounting a component. Full-bleed content
 * reserves the persistent mobile controls unless a caller explicitly opts out.
 */
export function getPageShellClasses({
  width = 'default',
  padding = 'realm',
  className,
  fullBleed = false,
  editorial = false,
  reserveBottomUi = fullBleed,
}: PageShellClassOptions = {}): string {
  return cn(
    'mx-auto w-full',
    WIDTH_CLASSES[width],
    PADDING_CLASSES[padding],
    fullBleed && 'fm-editorial-full-bleed',
    editorial && 'fm-editorial-shell',
    reserveBottomUi && 'fm-shell-reserve-bottom',
    className,
  );
}

/** Contenedor de contenido: fija el ancho y el aire de cada vista. */
export function PageShell({
  children,
  width = 'default',
  padding = 'realm',
  className,
  fullBleed = false,
  editorial = false,
  reserveBottomUi = fullBleed,
}: PageShellProps) {
  return (
    <div
      className={getPageShellClasses({
        width,
        padding,
        className,
        fullBleed,
        editorial,
        reserveBottomUi,
      })}
    >
      {children}
    </div>
  );
}
