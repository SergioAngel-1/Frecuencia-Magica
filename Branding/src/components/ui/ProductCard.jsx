import { cn } from '../../lib/cn'
import { Badge } from './Badge'
import { Button } from './Button'
import { GradientText } from './Display'
import { MediaSkeleton } from './MediaSkeleton'

/** Tarjeta de producto: materia arriba, título y precio en oro serif, acción separada. */
export function ProductCard({ slot, title, category, price, addLabel = 'Añadir', featuredLabel = 'Destacado', featured = false, className }) {
  return (
    <article
      className={cn(
        'group rounded-card-lg border-gold/20 bg-glass hover:border-gold/45 flex flex-col overflow-hidden border transition-colors',
        featured ? 'min-h-[520px]' : 'min-h-[390px]',
        className,
      )}
    >
      <div className={cn('relative shrink-0', featured ? 'h-[clamp(210px,26vw,340px)]' : 'h-[clamp(190px,22vw,260px)]')}>
        <MediaSkeleton slot={slot} label={title} aspect="16:9" className="h-full w-full" />
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(15,27,46,0.85)_100%)]" />
        {featured ? (
          <div className="absolute top-5 left-5 z-10">
            <Badge solid>{featuredLabel}</Badge>
          </div>
        ) : null}
      </div>

      <div className={cn('flex flex-col gap-2 p-5', featured && 'p-6')}>
        {featured ? null : <span className="text-fg-meta text-label tracking-label font-sans uppercase">{category}</span>}
        <h3 className={cn('text-ivory group-hover:text-gold font-serif leading-tight transition-colors', featured ? 'text-[clamp(24px,3vw,34px)]' : 'text-[20px]')}>
          {featured ? <GradientText>{title}</GradientText> : title}
        </h3>
      </div>

      <div className={cn('mt-auto flex items-center justify-between gap-4 p-5 pt-3', featured && 'px-6 pb-6')}>
        <span className="text-gold tracking-soft font-serif text-[21px]">{price}</span>
        <Button variant="accent" size="sm" tone="gold">{addLabel}</Button>
      </div>
    </article>
  )
}
