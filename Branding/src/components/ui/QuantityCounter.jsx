import { cn } from '../../lib/cn'

const STEP = 'rounded-pill border-glass-brd bg-glass text-ivory hover:border-gold/40 flex size-11 items-center justify-center border font-serif text-[22px] transition-colors duration-300'

/** − / cantidad / + con hit targets de 44px; en 1 el menos retira la línea. */
export function QuantityCounter({ value, onChange, onRemove, className }) {
  return (
    <div className={cn('inline-flex items-center gap-3', className)}>
      <button type="button" aria-label={value <= 1 ? 'Quitar' : 'Menos'} className={STEP} onClick={() => (value <= 1 ? onRemove?.() : onChange(value - 1))}>
        −
      </button>
      <span aria-live="polite" className="text-ivory min-w-6 text-center font-serif text-[22px]">
        {value}
      </span>
      <button type="button" aria-label="Más" className={STEP} onClick={() => onChange(value + 1)}>
        +
      </button>
    </div>
  )
}
