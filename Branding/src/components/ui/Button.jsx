import { cn } from '../../lib/cn'

const BASE =
  'relative inline-flex min-h-11 items-center justify-center rounded-pill font-serif tracking-soft ' +
  'transition-[color,background-color,border-color,box-shadow,opacity] duration-300 ease-out active:scale-[0.98]'

const SIZES = {
  sm: 'px-[22px] py-[9px] text-[17px]',
  md: 'px-[32px] py-[13px] text-[19px]',
  lg: 'px-[42px] py-[17px] text-[21px]',
}

const VARIANTS = {
  primary:
    'bg-ivory/95 text-ink font-medium shadow-[0_10px_40px_rgba(216,185,120,0.22)] hover:bg-ivory hover:shadow-[0_14px_48px_rgba(216,185,120,0.34)]',
  outline: 'bg-transparent border border-ivory/22 text-ivory hover:bg-ivory/6 hover:border-ivory/34',
  glass:
    'bg-glass border border-ivory/22 text-ivory backdrop-blur-[8px] hover:bg-ivory/9 hover:border-ivory/34',
  ghost: 'bg-transparent text-fg-muted font-sans text-meta tracking-ui hover:text-fg-body',
}

const TONES = {
  gold: 'bg-gold/12 border-gold/55 hover:bg-gold/20 hover:shadow-glow-gold',
  teal: 'bg-teal/14 border-teal/50 hover:bg-teal/22 hover:shadow-glow-teal',
  lav: 'bg-lav/14 border-lav/50 hover:bg-lav/22 hover:shadow-glow-lav',
}

// Un primario apagado como relleno al 45% se lee como una píldora gris sólida.
const PRIMARY_DISABLED = 'bg-ivory/14 border border-ivory/20 text-fg-muted shadow-none'

/**
 * Cinco variantes (`primary`, `outline`, `glass`, `ghost`, `accent`). Con `href`
 * renderiza un enlace; `loading` mantiene el aspecto y bloquea el click.
 */
export function Button({
  variant = 'primary',
  size = 'md',
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
    SIZES[size],
    variant === 'accent' ? cn('border text-ivory', TONES[tone]) : VARIANTS[variant],
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
