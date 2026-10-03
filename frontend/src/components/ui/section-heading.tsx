import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Kicker, type KickerTone } from './kicker';
import { Display } from './display';

export type SectionHeadingAlign = 'start' | 'center';

interface SectionHeadingProps {
  /** Texto del kicker (ya traducido). */
  kicker: ReactNode;
  /** Texto del título (ya traducido); se renderiza como `Display size="sm"`. */
  title: ReactNode;
  /** Acción a la derecha, típicamente un enlace "Ver todo →". Se ignora si `align="center"`. */
  action?: ReactNode;
  /** Por defecto `start` (fila kicker+título / acción a la derecha). */
  align?: SectionHeadingAlign;
  /** Color del kicker; por defecto el `gold` de `Kicker`. */
  kickerTone?: KickerTone;
  className?: string;
}

/**
 * Cabecera de sección: kicker + título a la izquierda, acción opcional a la
 * derecha (prototipo líneas 299–305: `align-items:flex-end`,
 * `justify-content:space-between`, gap 20px, margin-bottom 36px).
 *
 * Con `align="center"` apila y centra kicker + título, como la cabecera de
 * la sección de realms (líneas 365–366). Ese patrón del prototipo no lleva
 * acción, así que `action` se ignora en esta variante.
 */
export function SectionHeading({
  kicker,
  title,
  action,
  align = 'start',
  kickerTone,
  className,
}: SectionHeadingProps) {
  if (align === 'center') {
    return (
      <div className={cn('mb-11 flex flex-col items-center gap-2 text-center', className)}>
        <Kicker tone={kickerTone} spacing="widest">
          {kicker}
        </Kicker>
        <Display size="sm">{title}</Display>
      </div>
    );
  }

  return (
    <div className={cn('mb-9 flex items-end justify-between gap-5', className)}>
      <div>
        <Kicker tone={kickerTone} spacing="widest" className="mb-2">
          {kicker}
        </Kicker>
        <Display size="sm">{title}</Display>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
