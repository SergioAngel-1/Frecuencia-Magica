import { cn } from '@/lib/cn';

interface StepProgressBaseProps {
  /** Índice (0-based) del paso actual. */
  current: number;
  /**
   * Nombre accesible describiendo el progreso, ya traducido y formateado
   * (p. ej. "Paso 2 de 5"). El texto vive en `messages/`, nunca aquí.
   */
  ariaLabel: string;
  className?: string;
}

interface StepProgressDashesProps extends StepProgressBaseProps {
  /** Los 5 guiones del quiz: sólo importa la cuenta, no hay etiquetas. */
  variant: 'dashes';
  /** Número total de segmentos. */
  steps: number;
}

interface StepProgressLabeledProps extends StepProgressBaseProps {
  /** Los 3 pasos de reserva, cada uno con su etiqueta visible. */
  variant: 'labeled';
  /** Etiquetas ya traducidas de cada paso, en orden. */
  steps: string[];
}

export type StepProgressProps = StepProgressDashesProps | StepProgressLabeledProps;

const DIM_BG = 'bg-[rgba(247,244,234,0.14)]';

/**
 * Indicador de progreso por pasos discretos. `variant="dashes"` dibuja los
 * segmentos ciegos del quiz (Descúbrete); `variant="labeled"` dibuja las
 * columnas con etiqueta del flujo de reserva (Experiencias). En ambos casos
 * el paso completado o actual se pinta en lavanda y el resto queda atenuado;
 * el grupo entero es un único control accesible (`role="group"` con
 * `aria-label`) y los segmentos individuales son decorativos.
 */
export function StepProgress(props: StepProgressProps) {
  const { current, ariaLabel, className } = props;

  if (props.variant === 'dashes') {
    const segments = Array.from({ length: props.steps }, (_, index) => index);

    return (
      <div
        role="group"
        aria-label={ariaLabel}
        className={cn('flex justify-center gap-2', className)}
      >
        {segments.map((index) => (
          <span
            key={index}
            aria-hidden="true"
            className={cn(
              'h-[3px] w-11 rounded-[2px] transition-colors duration-500',
              index <= current ? 'bg-lav' : DIM_BG,
            )}
          />
        ))}
      </div>
    );
  }

  return (
    <div role="group" aria-label={ariaLabel} className={cn('flex gap-3', className)}>
      {props.steps.map((label, index) => (
        <div key={label} className="flex-1 text-center">
          <div
            aria-hidden="true"
            className={cn(
              'mb-[10px] h-[3px] rounded-[2px] transition-colors duration-500',
              index <= current ? 'bg-lav' : DIM_BG,
            )}
          />
          <span
            className={cn(
              'font-sans text-[11px] tracking-[.14em] uppercase',
              index === current ? 'text-ivory' : 'text-ivory/55',
            )}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
