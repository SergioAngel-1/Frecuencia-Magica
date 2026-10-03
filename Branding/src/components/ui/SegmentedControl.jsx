import { cn } from '../../lib/cn'

/** Conmutador de dos o tres opciones (acceso: Entrar / Crear cuenta). */
export function SegmentedControl({ options, value, onChange, ariaLabel }) {
  return (
    <div role="radiogroup" aria-label={ariaLabel} className="rounded-pill border-glass-brd bg-glass flex max-w-[340px] gap-[6px] border p-[5px] backdrop-blur-[10px]">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={value === option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            'rounded-pill tracking-soft min-h-11 flex-1 py-[11px] font-serif text-[18px] transition-colors duration-300',
            value === option.value ? 'text-ivory bg-gold/16' : 'text-fg-meta bg-transparent hover:text-fg-body',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
