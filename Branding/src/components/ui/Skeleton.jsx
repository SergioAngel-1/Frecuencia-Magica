import { cn } from '../../lib/cn'

const SHIMMER = 'linear-gradient(90deg, rgba(247,244,234,0.04), rgba(247,244,234,0.10), rgba(247,244,234,0.04))'
const VARIANTS = { text: 'h-[1em] rounded-[4px]', disc: 'aspect-square rounded-full', card: 'rounded-card', band: 'rounded-card' }

/** Silueta de carga con barrido de luz. Nunca un spinner como carga principal. */
export function Skeleton({ variant = 'text', className, style }) {
  return (
    <div
      aria-hidden="true"
      className={cn('animate-fm-shimmer w-full', VARIANTS[variant], className)}
      style={{ backgroundImage: SHIMMER, backgroundSize: '200% 100%', ...style }}
    />
  )
}

/** Silueta de una tarjeta de producto: imagen, título y acción. */
export function SkeletonCard({ className }) {
  return (
    <div aria-busy="true" className={cn('fm-surface rounded-card-lg flex flex-col gap-3 overflow-hidden p-4', className)}>
      <Skeleton variant="band" className="aspect-square" />
      <Skeleton className="h-3 w-1/3" />
      <Skeleton className="h-5 w-3/4" />
      <div className="mt-2 flex items-center justify-between">
        <Skeleton className="h-5 w-14" />
        <Skeleton className="h-11 w-24 rounded-pill" />
      </div>
    </div>
  )
}
