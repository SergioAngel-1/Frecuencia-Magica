import { cn } from '../../lib/cn'
import { zebraVariant } from '../../../../frontend/src/lib/editorial/zebra.ts'

const ASPECTS = {
  viewport: 'min-h-[60svh]',
  '16:9': 'aspect-[16/9]',
  '16:8': 'aspect-[16/8]',
  '3:4': 'aspect-[3/4]',
  '1:1': 'aspect-square',
}
const TONES = { gold: 'border-gold/35', teal: 'border-teal/35', lav: 'border-lav/35', ivory: 'border-ivory/25' }

/**
 * Zebra editorial: la ausencia deliberada de fotografía. Nunca una caja gris ni una imagen
 * falsa. Ángulo y fase salen del id del slot (`zebraVariant`, el mismo de la web), no del azar.
 */
export function MediaSkeleton({ slot, label, aspect = '16:9', tone = 'gold', animated = true, className }) {
  const variant = zebraVariant(slot)

  return (
    <div className={cn('bg-void relative isolate overflow-hidden', ASPECTS[aspect], className)} data-media-slot={slot}>
      <span className="sr-only">{label}</span>
      <div
        aria-hidden="true"
        className={cn('fm-editorial-zebra pointer-events-none absolute -inset-x-[12%] inset-y-0', animated && 'fm-editorial-zebra-sweep')}
        style={{ '--fm-zebra-angle': `${variant.angle}deg`, animationDelay: `${variant.delay}s` }}
      />
      <div aria-hidden="true" className="border-gold/25 pointer-events-none absolute inset-[12%] rounded-[38%] border opacity-70" />
      <div
        aria-hidden="true"
        className={cn('pointer-events-none absolute inset-[20%] rotate-12 rounded-full border opacity-60', TONES[tone], animated && 'animate-fm-float-s')}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_100%_at_30%_10%,rgba(247,244,234,0.07),transparent_60%)]"
      />
    </div>
  )
}
