import { cn } from '../../lib/cn'

const TONES = { gold: 'text-gold', teal: 'text-teal', lav: 'text-lav', muted: 'text-fg-meta' }
const SPACING = { tight: 'tracking-label', wide: 'tracking-kicker', widest: 'tracking-eyebrow' }

/** Eyebrow de 11px en mayúsculas. Tracking: `tight` .14em, `wide` .3em, `widest` .4em. */
export function Kicker({ children, tone = 'gold', spacing = 'wide', as: Tag = 'p', className }) {
  return <Tag className={cn('text-label font-sans uppercase', TONES[tone], SPACING[spacing], className)}>{children}</Tag>
}
