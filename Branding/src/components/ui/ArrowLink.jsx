import { cn } from '../../lib/cn'

const TONES = {
  gold: 'border-gold/70 text-gold focus-visible:ring-gold',
  teal: 'border-teal/70 text-teal focus-visible:ring-teal',
  lav: 'border-lav/70 text-lav focus-visible:ring-lav',
}

/** Enlace editorial con flecha: subrayado fino del acento, mayúsculas, 44px. */
export function ArrowLink({ tone = 'gold', href = '#', className, children, ...rest }) {
  return (
    <a
      href={href}
      className={cn(
        'text-label tracking-caps inline-flex min-h-11 w-fit items-center border-b pb-1 font-sans uppercase outline-none focus-visible:ring-2',
        TONES[tone],
        className,
      )}
      {...rest}
    >
      {children}
      <span aria-hidden="true" className="ml-3 text-[18px] leading-none">
        →
      </span>
    </a>
  )
}
