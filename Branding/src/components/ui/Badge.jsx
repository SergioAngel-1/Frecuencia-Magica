import { cn } from '../../lib/cn'

const TONES = { gold: 'text-accent', teal: 'text-accent-2', lav: 'text-accent-3' }

/** Píldora de 11px en mayúsculas. La sólida marca lo «Destacado» y mide lo que su texto. */
export function Badge({ children, tone = 'gold', solid = false, className }) {
  return (
    <span
      className={cn(
        'rounded-pill text-label tracking-caps inline-flex w-fit items-center self-start px-[14px] py-[6px] font-sans whitespace-nowrap uppercase',
        solid ? 'bg-accent/92 text-on-accent' : cn('border border-fg/16 bg-scrim/35', TONES[tone]),
        className,
      )}
    >
      {children}
    </span>
  )
}
