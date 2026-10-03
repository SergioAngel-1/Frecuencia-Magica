import { cn } from '../../lib/cn'

const RADII = { 16: 'rounded-[16px]', 18: 'rounded-[18px]', 20: 'rounded-[20px]', 22: 'rounded-card', 26: 'rounded-card-lg' }

/** Cristal astral: la superficie de todas las tarjetas. `glow` añade el halo dorado. */
export function GlassPanel({ as: Tag = 'div', radius = 22, glow = false, className, children, ...rest }) {
  return (
    <Tag className={cn('fm-surface relative', RADII[radius], glow && 'shadow-glow-card', className)} {...rest}>
      {children}
    </Tag>
  )
}
