import type { ComponentProps, ReactNode } from 'react';

import { cn } from '@/lib/cn';

type CollapseProps = Omit<ComponentProps<'div'>, 'children'> & {
  /** Abierto: el contenido se ve. Cerrado: se pliega y queda inerte. */
  open: boolean;
  /** Si es `false`, sólo se pliega la fila (sin fundido de opacidad). */
  fade?: boolean;
  children: ReactNode;
};

/**
 * Panel plegable sin animar altura: la fila de rejilla pasa de `0fr` a `1fr`
 * y, si `fade`, el contenido se funde con `opacity`.
 *
 * Cerrado queda `inert` y `aria-hidden`: ni foco ni lectura. El movimiento
 * reducido lo resuelve el kill global de `tokens.css` (`prefers-reduced-motion`),
 * así que no hay una rama propia aquí. `className` se fusiona al final: sirve
 * para ajustar el ritmo o el margen del panel sin duplicar la primitiva.
 */
export function Collapse({ open, fade = true, className, children, ...rest }: CollapseProps) {
  return (
    <div
      {...rest}
      aria-hidden={!open}
      inert={!open}
      className={cn(
        'grid duration-[350ms] ease-[cubic-bezier(.2,.85,.25,1)]',
        fade ? 'transition-[grid-template-rows,opacity]' : 'transition-[grid-template-rows]',
        open
          ? fade
            ? 'grid-rows-[1fr] opacity-100'
            : 'grid-rows-[1fr]'
          : fade
            ? 'grid-rows-[0fr] opacity-0'
            : 'grid-rows-[0fr]',
        className,
      )}
    >
      <div className="min-h-0 overflow-hidden">{children}</div>
    </div>
  );
}
