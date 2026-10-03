import { cn } from '../../lib/cn'

const TONES = { gold: 'text-gold', teal: 'text-teal', lav: 'text-lav' }

/** Píldora de 11px en mayúsculas. La sólida marca lo «Destacado» y mide lo que su texto. */
export function Badge({ children, tone = 'gold', solid = false, className }) {
  return (
    <span
      className={cn(
        'rounded-pill text-label tracking-caps inline-flex w-fit items-center self-start px-[14px] py-[6px] font-sans whitespace-nowrap uppercase',
        solid ? 'bg-gold/92 text-ink' : cn('border border-ivory/16 bg-void/35', TONES[tone]),
        className,
      )}
    >
      {children}
    </span>
  )
}
