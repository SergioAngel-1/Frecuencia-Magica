import { cn } from '../../lib/cn'

/** Casilla con ✓ (único carácter decorativo permitido) y foco dorado. */
export function Checkbox({ label, className, ...rest }) {
  return (
    <label className={cn('text-body text-fg-body flex min-h-11 cursor-pointer items-center gap-3 font-sans', className)}>
      <input
        type="checkbox"
        className="peer border-glass-brd bg-glass checked:border-gold/60 checked:bg-gold/20 size-5 shrink-0 cursor-pointer appearance-none rounded-[6px] border transition-colors duration-300 disabled:opacity-45"
        {...rest}
      />
      <span className="text-gold pointer-events-none -ml-[32px] w-5 text-center text-[13px] opacity-0 peer-checked:opacity-100" aria-hidden="true">
        ✓
      </span>
      <span>{label}</span>
    </label>
  )
}
