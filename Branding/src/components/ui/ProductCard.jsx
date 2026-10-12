import { cn } from '../../lib/cn'
import { Badge } from './Badge'
import { Button } from './Button'
import { GradientText } from './Display'
import { MediaSkeleton } from './MediaSkeleton'

/** Tarjeta de producto: materia a 1:1 arriba (en columnas y a todo el alto si es la destacada), título y precio en oro serif, acción separada. */
export function ProductCard({ slot, title, category, price, addLabel = 'Añadir', featuredLabel = 'Destacado', featured = false, className }) {
  return (
    <article
      className={cn(
        'group rounded-card-lg border-gold/20 bg-glass hover:border-gold/45 relative flex flex-col overflow-hidden border transition-colors',
        featured && 'md:flex-row',
        className,
      )}
    >
      {/* Materia a 1:1, sin velo: el texto va debajo. En el destacado, desde
          `md`, la imagen cubre la columna entera, de arriba abajo de la ficha. */}
      <div className={cn('relative shrink-0', featured && 'md:w-1/2 md:self-stretch')}>
        <div className={cn('relative aspect-square w-full', featured && 'md:absolute md:inset-0 md:aspect-auto')}>
          <MediaSkeleton slot={slot} label={title} aspect="1:1" className="h-full w-full" />
        </div>
        {featured ? (
          <div className="absolute top-5 left-5 z-10">
            <Badge solid>{featuredLabel}</Badge>
          </div>
        ) : null}
      </div>

      <div className={cn('flex flex-1 flex-col', featured && 'md:w-1/2 md:justify-center')}>
        <div className={cn('flex flex-col gap-2 p-5', featured && 'p-6')}>
          {featured ? null : <span className="text-fg-meta text-label tracking-label font-sans uppercase">{category}</span>}
          <h3 className={cn('text-ivory group-hover:text-gold font-serif leading-tight transition-colors', featured ? 'text-[clamp(24px,3vw,34px)]' : 'text-[20px]')}>
            {featured ? <GradientText>{title}</GradientText> : title}
          </h3>
        </div>

        <div className={cn('mt-auto flex items-center justify-between gap-4 p-5 pt-3', featured && 'px-6 pb-6')}>
          <span className="text-gold tracking-soft font-serif text-[21px]">{price}</span>
          <Button variant="accent" tone="gold">{addLabel}</Button>
        </div>
      </div>
    </article>
  )
}
