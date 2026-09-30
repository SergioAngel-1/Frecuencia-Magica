import { cn } from '../../lib/cn'
import { ArrowLink } from './ArrowLink'
import { Display } from './Display'
import { Kicker } from './Kicker'
import { OrbitalRings } from './OrbitalRings'

/** Glifo de realm: un círculo con un punto, el mismo gesto de geometría sagrada en miniatura. */
function Glyph({ size, color }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth="1">
      <circle cx="24" cy="24" r="20" />
      <circle cx="24" cy="24" r="11" strokeDasharray="1 4" />
      <circle cx="24" cy="24" r="2.4" fill={color} />
    </svg>
  )
}

/**
 * Tarjeta de realm. Tres jerarquías: `featured` (Academia, panel principal en teal),
 * `store` (Tienda, conversión destacada) y la secundaria. El `band` es un gradiente de
 * `bands.ts`, nunca una foto.
 */
export function RealmCard({ band, emotion, title, description, featured = false, store = false, actionLabel, className }) {
  if (featured) {
    return (
      <div
        className={cn(
          'group border-teal/35 rounded-card relative grid min-h-[360px] overflow-hidden border transition-transform duration-500 hover:-translate-y-1 hover:shadow-[0_0_42px_rgba(150,198,188,0.14)] lg:grid-cols-[1.15fr_0.85fr]',
          className,
        )}
        style={{ backgroundImage: band }}
      >
        <div className="relative z-[2] flex flex-col justify-end p-[clamp(28px,5vw,68px)]">
          <Kicker tone="teal">{emotion}</Kicker>
          <Display level="h3" size="feature" className="mt-3 max-w-[10ch]">{title}</Display>
          <p className="text-fg-body text-body mt-5 max-w-[42ch] leading-[1.75]">{description}</p>
          {actionLabel ? <ArrowLink tone="teal" className="mt-7">{actionLabel}</ArrowLink> : null}
        </div>
        <div aria-hidden="true" className="pointer-events-none relative z-[2] hidden min-h-[260px] lg:block">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,27,46,0.92),transparent_58%)]" />
          <div className="absolute top-1/2 right-[8%] -translate-y-1/2 opacity-80">
            <OrbitalRings size={330} spin={100} rings={[{ r: 164, stroke: 'rgba(247,244,234,0.1)' }, { r: 130, stroke: 'rgba(150,198,188,0.18)' }]} />
          </div>
          <div className="absolute top-1/2 right-[15%] -translate-y-1/2"><Glyph size={82} color="var(--color-teal)" /></div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'group border-glass-brd rounded-card relative flex min-h-[230px] flex-col justify-end overflow-hidden border p-[clamp(24px,3vw,38px)] transition-transform duration-500 hover:-translate-y-1 hover:shadow-[0_0_34px_rgba(216,185,120,0.12)]',
        store && 'border-gold/35 lg:min-h-[300px]',
        className,
      )}
      style={{ backgroundImage: band }}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_22%,rgba(10,18,32,0.82)_100%)]" />
      {store ? (
        <div aria-hidden="true" className="pointer-events-none absolute top-[-30px] right-[-30px] opacity-70">
          <OrbitalRings size={210} spin={100} rings={[{ r: 105, stroke: 'rgba(216,185,120,0.1)' }, { r: 84, stroke: 'rgba(150,198,188,0.1)' }]} />
        </div>
      ) : (
        <div aria-hidden="true" className="pointer-events-none absolute top-[18px] right-[18px] opacity-75">
          <Glyph size={46} color="var(--color-gold)" />
        </div>
      )}
      <div className="relative z-[2]">
        {store && actionLabel ? (
          <span className="rounded-pill border-gold/45 text-gold text-label tracking-label mb-4 inline-flex min-h-11 items-center border px-3 font-sans uppercase">
            {actionLabel}
          </span>
        ) : null}
        <p className="text-fg-soft text-label tracking-caps font-sans uppercase">{emotion}</p>
        <h3 className={cn('text-ivory mt-2 font-serif leading-[0.98] font-light', store ? 'text-[clamp(32px,4vw,52px)]' : 'text-[clamp(28px,3.2vw,42px)]')}>
          {title}
        </h3>
        <p className={cn('text-fg-soft text-body mt-3 leading-[1.7]', !store && 'max-w-[34ch]')}>{description}</p>
      </div>
    </div>
  )
}
