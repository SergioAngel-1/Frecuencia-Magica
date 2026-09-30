import { cn } from '../../lib/cn'
import { Badge } from './Badge'
import { Button } from './Button'
import { Display } from './Display'
import { Kicker } from './Kicker'
import { MediaSkeleton } from './MediaSkeleton'
import { OrbitalRings } from './OrbitalRings'

/** Fila de experiencia: atmósfera del lugar con scrim izquierdo para el texto; fecha, duración y precio a la derecha. */
export function ExperienceRow({ slot, title, mode, modeLabel, dateLabel, date, durationLabel, duration, price, bookLabel, description, featured = false, className }) {
  if (featured) {
    return (
      <article className={cn('text-ivory rounded-card-lg relative isolate min-h-[clamp(430px,42vw,560px)] overflow-hidden', className)}>
        <div className="absolute inset-0">
          <MediaSkeleton slot={slot} label={title} aspect="16:8" tone="lav" className="h-full w-full" />
          <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,27,46,0.9),transparent_70%)]" />
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute top-[10%] right-[8%] z-[1] hidden md:block">
          <OrbitalRings size={300} spin={100} rings={[{ r: 150, stroke: 'rgba(185,176,214,0.2)' }, { r: 110, stroke: 'rgba(216,185,120,0.15)', dash: '1 8' }]} />
        </div>
        <div className="relative z-10 flex min-h-[clamp(430px,42vw,560px)] flex-col justify-end p-[clamp(28px,6vw,72px)]">
          <div className="flex max-w-[760px] flex-col">
            <Badge solid>{modeLabel}</Badge>
            <Kicker tone="teal" className="mt-4">{mode}</Kicker>
            <Display level="h3" size="feature" className="mt-2 max-w-[13ch]">{title}</Display>
            {description ? <p className="text-fg-body mt-5 max-w-[48ch] text-[16px] leading-[1.7]">{description}</p> : null}
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Button size="lg">{bookLabel} →</Button>
              <div className="text-fg-soft text-meta tracking-ui flex flex-wrap items-center gap-x-5 gap-y-2 font-sans">
                <span>{date}</span>
                <span>{duration}</span>
                <span className="text-gold font-serif text-[30px]">{price}</span>
              </div>
            </div>
          </div>
        </div>
      </article>
    )
  }

  return (
    <article className={cn('rounded-card-lg text-ivory relative isolate min-h-[clamp(320px,34vw,420px)] overflow-hidden', className)}>
      <div className="absolute inset-0">
        <MediaSkeleton slot={slot} label={title} aspect="16:9" tone="lav" className="h-full w-full" />
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,27,46,0.85),transparent_75%)]" />
      </div>
      <div className="relative z-10 grid min-h-[clamp(320px,34vw,420px)] items-end gap-8 px-[clamp(24px,6vw,72px)] py-[clamp(28px,5vw,60px)] lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-12">
        <div className="max-w-[600px]">
          <Badge>{modeLabel}</Badge>
          <h3 className="text-ivory mt-4 max-w-[14ch] font-serif text-[clamp(32px,4.5vw,58px)] leading-[0.94]">{title}</h3>
        </div>
        <div className="border-ivory/25 flex min-h-11 flex-wrap items-center gap-x-6 gap-y-3 border-t pt-5 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
          <div className="flex min-h-11 flex-col justify-center">
            <span className="text-fg-muted text-meta tracking-ui font-sans uppercase">{dateLabel}</span>
            <span className="text-ivory mt-1 font-serif text-[22px]">{date}</span>
          </div>
          <div className="flex min-h-11 flex-col justify-center">
            <span className="text-fg-muted text-meta tracking-ui font-sans uppercase">{durationLabel}</span>
            <span className="text-ivory mt-1 font-serif text-[26px]">{duration}</span>
          </div>
          <span className="text-gold font-serif text-[30px]">{price}</span>
          <Button variant="accent" size="lg">{bookLabel} →</Button>
        </div>
      </div>
    </article>
  )
}
