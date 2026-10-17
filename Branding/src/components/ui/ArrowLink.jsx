import { cn } from '../../lib/cn'

const TONES = {
  gold: 'border-accent/70 text-accent focus-visible:ring-accent',
  teal: 'border-accent-2/70 text-accent-2 focus-visible:ring-accent-2',
  lav: 'border-accent-3/70 text-accent-3 focus-visible:ring-accent-3',
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
