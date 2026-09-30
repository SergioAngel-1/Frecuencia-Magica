import { cn } from '../../lib/cn'
import { Badge } from './Badge'
import { Display } from './Display'
import { GlassPanel } from './GlassPanel'
import { MediaSkeleton } from './MediaSkeleton'

/** Curso de la Academia: `featured` es una banda a todo el ancho; la estándar, una tarjeta cuadrada. */
export function CourseCard({ slot, title, level, lessonsLabel, description, cta, featured = false, className }) {
  if (featured) {
    return (
      <article className={cn('rounded-card-lg text-ivory relative isolate min-h-[clamp(380px,42vw,520px)] overflow-hidden', className)}>
        <div className="absolute inset-0">
          <MediaSkeleton slot={slot} label={title} aspect="16:8" tone="teal" className="h-full w-full" />
          <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,27,46,0.9),transparent_70%)]" />
        </div>
        <div className="relative z-10 flex min-h-[clamp(380px,42vw,520px)] max-w-[720px] flex-col justify-end px-[clamp(24px,6vw,76px)] py-[clamp(30px,6vw,76px)]">
          <Badge solid>{level}</Badge>
          <Display level="h3" size="feature" className="mt-5 max-w-[12ch]">{title}</Display>
          {description ? <p className="text-fg-body mt-5 max-w-[48ch] text-[16px] leading-[1.7]">{description}</p> : null}
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
            <span className="border-gold/55 text-gold text-label tracking-caps min-h-11 border-b py-3 font-sans uppercase">{cta}</span>
            <span className="text-fg-soft text-meta tracking-ui font-sans uppercase">{lessonsLabel}</span>
          </div>
        </div>
      </article>
    )
  }

  return (
    <GlassPanel as="article" radius={22} className={cn('group hover:border-gold/45 overflow-hidden transition-colors', className)}>
      <div className="relative aspect-square">
        <MediaSkeleton slot={slot} label={title} aspect="1:1" tone="teal" className="h-full w-full" />
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(15,27,46,0.85)_100%)]" />
        <div className="absolute top-4 left-4 z-10"><Badge>{level}</Badge></div>
      </div>
      <div className="px-6 pt-5 pb-7">
        <h3 className="text-ivory font-serif text-[clamp(26px,3vw,34px)] leading-[1.05]">{title}</h3>
        <p className="text-fg-muted text-meta tracking-soft mt-3 font-sans">{lessonsLabel}</p>
      </div>
    </GlassPanel>
  )
}
