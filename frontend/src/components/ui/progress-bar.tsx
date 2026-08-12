import { cn } from '@/lib/cn';

export type ProgressBarHeight = 4 | 5;

interface ProgressBarProps {
  /** Progreso actual. Se recorta al rango 0–100. */
  value: number;
  /** Alto de la pista en px. Por defecto `4`. */
  height?: ProgressBarHeight;
  /** Nombre accesible del indicador, ya traducido (p. ej. "Progreso de la reproducción"). */
  ariaLabel: string;
  className?: string;
}

const HEIGHT_CLASSES: Record<ProgressBarHeight, string> = {
  4: 'h-[4px]',
  5: 'h-[5px]',
};

/**
 * Barra de progreso lineal: pista translúcida (`rgba(247,244,234,0.14)`) con
 * relleno en degradado teal→oro cuyo avance se expresa con `transform: scaleX`
 * desde el borde izquierdo. Así el cambio discreto de valor no anima una
 * propiedad de layout y respeta el presupuesto de movimiento del proyecto.
 */
export function ProgressBar({ value, height = 4, ariaLabel, className }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={ariaLabel}
      className={cn(
        'w-full overflow-hidden rounded-[3px] bg-[rgba(247,244,234,0.14)]',
        HEIGHT_CLASSES[height],
        className,
      )}
    >
      <div
        className="h-full origin-left rounded-[3px] bg-[linear-gradient(90deg,var(--color-teal),var(--color-gold))] transition-transform duration-500 ease-out"
        style={{ transform: `scaleX(${clamped / 100})` }}
      />
    </div>
  );
}
