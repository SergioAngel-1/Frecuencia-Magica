import { cn } from '@/lib/cn';

export type StatTone = 'gold' | 'teal' | 'lav' | 'ivory';
export type StatSize = 'hero' | 'sanctuary';

interface StatProps {
  /** Cifra ya formateada (p. ej. "12", "432 Hz"). */
  value: string;
  /** Etiqueta ya traducida bajo la cifra. */
  label: string;
  /** Acento de color de la cifra. Por defecto `gold`. */
  tone?: StatTone;
  /** Escala: `hero` (34px, stats del hero) o `sanctuary` (40px, tarjetas de Mi Santuario). Por defecto `hero`. */
  size?: StatSize;
  className?: string;
}

const TONE_CLASSES: Record<StatTone, string> = {
  gold: 'text-gold',
  teal: 'text-teal',
  lav: 'text-lav',
  ivory: 'text-ivory',
};

const SIZE_CLASSES: Record<StatSize, { value: string; label: string }> = {
  hero: { value: 'mb-[4px] text-[34px]', label: 'text-[11px] tracking-[.14em]' },
  sanctuary: { value: 'mb-[6px] text-[40px]', label: 'text-[12px] tracking-[.1em]' },
};

/**
 * Cifra estadística: número grande en Cormorant con su etiqueta debajo. Se
 * usa tanto en las stats del hero (Home) como en las tarjetas de Mi
 * Santuario — `size` cubre esa diferencia de escala, el resto del
 * tratamiento (envoltura en tarjeta de cristal, layout en grid) vive en el
 * componente que lo consume, no aquí.
 */
export function Stat({ value, label, tone = 'gold', size = 'hero', className }: StatProps) {
  const sizeClasses = SIZE_CLASSES[size];

  return (
    <div className={className}>
      <p
        className={cn('font-serif leading-none font-light', sizeClasses.value, TONE_CLASSES[tone])}
      >
        {value}
      </p>
      <p className={cn('font-sans text-[rgba(247,244,234,0.55)] uppercase', sizeClasses.label)}>
        {label}
      </p>
    </div>
  );
}
