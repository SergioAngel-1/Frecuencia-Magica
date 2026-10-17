import { cn } from '../../lib/cn'

/** Filtro/toggle: marfil tenue en reposo, oro cuando está activo. */
export function Pill({ children, active = false, disabled = false, className, ...rest }) {
  return (
    <button
      type="button"
      disabled={disabled}
      aria-pressed={active}
      className={cn(
        'rounded-pill text-meta tracking-ui inline-flex min-h-11 items-center justify-center border px-5 py-2 font-sans',
        'transition-[color,background-color,border-color] duration-300 ease-out active:scale-[0.98]',
        disabled && 'pointer-events-none opacity-45',
        active
          ? 'text-fg border-accent/55 bg-accent/16'
          : 'border-fg/14 bg-fg/4 text-fg-soft hover:border-fg/22 hover:bg-fg/8',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
}
