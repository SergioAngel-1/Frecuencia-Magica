import { cn } from '@/lib/cn';

interface SeekBarProps {
  /** Posición actual, en las mismas unidades que `max`. */
  value: number;
  max: number;
  onChange: (value: number) => void;
  /** Nombre accesible, ya traducido. */
  label: string;
  /** Lectura para lectores de pantalla, p. ej. «00:42 de 18:00». */
  valueText?: string;
  className?: string;
}

/**
 * Barra de posición: una línea fina con el tramo recorrido en oro y un punto
 * de luz que aparece al acercarse o enfocar.
 *
 * El `<input type="range">` nativo va encima, invisible, y aporta el
 * arrastre, el teclado y la semántica; lo que se ve son tres capas propias.
 * Estilar el control nativo pintaba su fondo en los 44px del hit target —un
 * bloque gris tras la pista— y cada motor lo resolvía a su manera.
 */
export function SeekBar({ value, max, onChange, label, valueText, className }: SeekBarProps) {
  const clamped = Math.min(Math.max(value, 0), max);
  const ratio = max > 0 ? clamped / max : 0;

  return (
    <div className={cn('group relative flex h-11 items-center', className)}>
      <div className="bg-fg/14 relative h-[3px] w-full overflow-hidden rounded-[3px]">
        <div
          className="bg-accent absolute inset-0 origin-left rounded-[3px]"
          style={{ transform: `scaleX(${ratio})` }}
        />
      </div>
      <span
        aria-hidden="true"
        className="bg-fg shadow-glow-gold absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full transition-transform duration-200 ease-out group-focus-within:scale-100 group-hover:scale-100"
        style={{ left: `${ratio * 100}%` }}
      />
      <input
        type="range"
        min={0}
        max={max}
        value={clamped}
        aria-label={label}
        aria-valuetext={valueText}
        onChange={(event) => onChange(Number(event.target.value))}
        className="peer absolute inset-0 size-full cursor-pointer touch-pan-y opacity-0"
      />
      <span
        aria-hidden="true"
        className="ring-accent pointer-events-none absolute inset-x-[-6px] inset-y-2 rounded-[8px] opacity-0 ring-2 peer-focus-visible:opacity-100"
      />
    </div>
  );
}
