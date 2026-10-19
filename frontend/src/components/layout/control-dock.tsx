import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

/**
 * Cápsula de controles del header: varios controles en una sola superficie de vidrio, separados por
 * filetes finos. Sustituye a las píldoras y discos sueltos de antes, que sumaban cinco superficies
 * de tamaños distintos. Todas las cápsulas miden lo mismo (46 px con su borde) para que el header
 * lea como una sola fila.
 *
 * El contenedor es un `group` con nombre accesible: un lector de pantalla anuncia «Preferencias» y
 * recorre sus controles. Atraviesa el puntero que el header ignora (`pointer-events-none`).
 */
export function ControlDock({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        'rounded-pill pointer-events-auto relative isolate flex h-[46px] items-center px-0.5',
        className,
      )}
    >
      {/* El vidrio va en su propia capa: un `backdrop-filter` en la cápsula haría de ella el
          bloque contenedor de los paneles `fixed` que abre (el selector de tema, en móvil). */}
      <span
        aria-hidden="true"
        className="fm-surface rounded-pill pointer-events-none absolute inset-0 -z-10"
      />
      {children}
    </div>
  );
}

/** Filete entre dos controles de una cápsula. Decorativo. */
export function DockDivider({ className }: { className?: string }) {
  return <span aria-hidden="true" className={cn('bg-line h-5 w-px flex-none', className)} />;
}

type DockSegmentOptions = {
  /** Estado activo de un conmutador, o la página actual de un enlace. */
  active?: boolean;
  /** El control principal de la cápsula: lleva su disco de realce en reposo. */
  primary?: boolean;
  className?: string;
};

/**
 * Clases de un control dentro de una `ControlDock`: 44 px de alto (suelo táctil), sin superficie
 * propia, con un disco de realce inscrito (`before:`) que aparece al pasar o enfocar. El disco va
 * detrás del contenido (`-z-10` dentro de un `isolate`), así que el texto y el icono no cambian de
 * capa. Sólo anima el color de fondo y del texto.
 */
export function dockSegmentClasses({
  active = false,
  primary = false,
  className,
}: DockSegmentOptions = {}) {
  return cn(
    'group relative isolate inline-flex h-11 min-w-11 flex-none items-center justify-center gap-2 px-2.5',
    'text-meta tracking-ui font-sans whitespace-nowrap',
    'before:absolute before:inset-[3px] before:-z-10 before:rounded-full before:transition-colors before:duration-300',
    'transition-colors duration-300 ease-out',
    active
      ? 'text-accent before:bg-accent/16'
      : 'text-fg-soft hover:text-fg hover:before:bg-fg/8 focus-visible:before:bg-fg/8',
    primary && !active && 'text-fg before:bg-fg/8 hover:before:bg-fg/14',
    className,
  );
}
