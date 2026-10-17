import { cn } from '../../lib/cn'

const BASE =
  'relative inline-flex min-h-11 items-center justify-center rounded-pill border border-transparent font-serif tracking-soft ' +
  'transition-[color,background-color,border-color,box-shadow,opacity] duration-300 ease-out active:scale-[0.98]'

/** Un solo tamaño: el compacto del acceso. La jerarquía la dan las variantes. */
const SIZE = 'px-[22px] py-[9px] text-[17px]'

const VARIANTS = {
  primary:
    'bg-fg/95 text-on-accent font-medium shadow-[0_10px_40px_rgb(var(--halo)_/_0.22)] hover:bg-fg hover:shadow-[0_14px_48px_rgb(var(--halo)_/_0.34)]',
  outline: 'bg-transparent border border-fg/22 text-fg hover:bg-fg/6 hover:border-fg/34',
  glass:
    'bg-surface border border-fg/22 text-fg backdrop-blur-[8px] hover:bg-fg/9 hover:border-fg/34',
  ghost: 'bg-transparent text-fg-muted font-sans text-meta tracking-ui hover:text-fg-body',
}

const TONES = {
  gold: 'bg-accent/12 border-accent/55 hover:bg-accent/20 hover:shadow-glow-gold',
  teal: 'bg-accent-2/14 border-accent-2/50 hover:bg-accent-2/22 hover:shadow-glow-teal',
  lav: 'bg-accent-3/14 border-accent-3/50 hover:bg-accent-3/22 hover:shadow-glow-lav',
}

// Un primario apagado como relleno al 45% se lee como una píldora gris sólida.
const PRIMARY_DISABLED = 'bg-fg/14 border border-fg/20 text-fg-muted shadow-none'

/**
 * Cinco variantes (`primary`, `outline`, `glass`, `ghost`, `accent`). Con `href`
 * renderiza un enlace; `loading` mantiene el aspecto y bloquea el click.
 */
export function Button({
  variant = 'primary',
  tone = 'gold',
  loading = false,
  disabled = false,
  href,
  iconRight,
  className,
  children,
  ...rest
}) {
  const classes = cn(
    BASE,
    SIZE,
    variant === 'accent' ? cn('border text-fg', TONES[tone]) : VARIANTS[variant],
    (loading || disabled) && 'pointer-events-none',
    disabled && (variant === 'primary' ? PRIMARY_DISABLED : 'opacity-45'),
    className,
  )
  const content = (
    <span className="inline-flex items-center gap-2">
      <span className={cn(loading && 'animate-fm-glow')}>{children}</span>
      {iconRight ? <span aria-hidden="true">{iconRight}</span> : null}
    </span>
  )

  if (href) {
    return (
      <a href={href} className={classes} aria-disabled={disabled || undefined} {...rest}>
        {content}
      </a>
    )
  }

  return (
    <button type="button" className={classes} disabled={disabled} aria-busy={loading} {...rest}>
      {content}
    </button>
  )
}
