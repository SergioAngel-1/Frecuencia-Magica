import { ArrowGlyph, arrowLinkClasses, Kicker, Display } from '@/components/ui';
import { OrbitalRings, RealmGlyph } from '@/components/world';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/cn';

type RealmCardProps = {
  href: string;
  band: string;
  emotion: string;
  title: string;
  description: string;
  /** La Academia mantiene el panel principal de la jerarquía editorial. */
  featured?: boolean;
  /** Tienda conserva su tratamiento de conversión destacado. */
  store?: boolean;
  actionLabel?: string;
  className?: string;
};

export function RealmCard({
  href,
  band,
  emotion,
  title,
  description,
  featured = false,
  store = false,
  actionLabel,
  className,
}: RealmCardProps) {
  if (featured) {
    return (
      <Link
        href={href as '/biblioteca'}
        data-editorial-panel="featured"
        className={cn(
          'group border-teal/35 focus-visible:ring-teal rounded-card relative grid min-h-[360px] overflow-hidden border transition-transform duration-500 outline-none hover:-translate-y-1 hover:shadow-[0_0_42px_rgba(150,198,188,0.14)] focus-visible:ring-2 sm:min-h-[400px] lg:grid-cols-[1.15fr_0.85fr]',
          className,
        )}
        style={{ backgroundImage: band }}
      >
        <div className="relative z-[2] flex flex-col justify-end p-[clamp(28px,5vw,68px)]">
          <Kicker tone="teal">{emotion}</Kicker>
          <Display level="h3" size="feature" className="mt-3 max-w-[10ch]">
            {title}
          </Display>
          <p className="text-fg-body text-body mt-5 max-w-[42ch] leading-[1.75]">{description}</p>
          {actionLabel ? (
            <span className={arrowLinkClasses('teal', 'mt-7')}>
              {actionLabel}
              <ArrowGlyph />
            </span>
          ) : null}
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none relative z-[2] hidden min-h-[260px] lg:block"
        >
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,27,46,0.92),transparent_58%)]" />
          <div className="absolute top-1/2 right-[8%] -translate-y-1/2 opacity-80">
            <OrbitalRings
              size={330}
              spin={100}
              rings={[
                { r: 164, stroke: 'rgba(247,244,234,0.1)' },
                { r: 130, stroke: 'rgba(150,198,188,0.18)' },
              ]}
            />
          </div>
          <RealmGlyph
            size={82}
            color="var(--color-teal)"
            className="absolute top-1/2 right-[15%] -translate-y-1/2"
          />
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={href as '/biblioteca'}
      data-editorial-panel={store ? 'conversion' : 'secondary'}
      className={cn(
        'group border-glass-brd focus-visible:ring-gold rounded-card relative flex min-h-[230px] flex-col justify-end overflow-hidden border p-[clamp(24px,3vw,38px)] transition-transform duration-500 outline-none hover:-translate-y-1 hover:shadow-[0_0_34px_rgba(216,185,120,0.12)] focus-visible:ring-2',
        store && 'border-gold/35 lg:min-h-[300px]',
        className,
      )}
      style={{ backgroundImage: band }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_22%,rgba(10,18,32,0.82)_100%)]"
      />
      {/* Tienda ya lleva su pill de conversión arriba a la izquierda y aros
          orbitales arriba a la derecha: un glifo encima chocaría con la pill. */}
      {store ? null : (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-[18px] right-[18px] opacity-75"
        >
          <RealmGlyph size={46} color="var(--color-gold)" />
        </div>
      )}
      {store ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-[-30px] right-[-30px] opacity-70"
        >
          <OrbitalRings
            size={210}
            spin={100}
            rings={[
              { r: 105, stroke: 'rgba(216,185,120,0.1)' },
              { r: 84, stroke: 'rgba(150,198,188,0.1)' },
            ]}
          />
        </div>
      ) : null}

      <div className="relative z-[2]">
        {store && actionLabel ? (
          <span className="rounded-pill border-gold/45 text-gold text-label tracking-label mb-4 inline-flex min-h-11 items-center border px-3 font-sans uppercase">
            {actionLabel}
          </span>
        ) : null}
        <p className="text-fg-soft text-label tracking-caps font-sans uppercase">{emotion}</p>
        <h3
          className={cn(
            'text-ivory mt-2 font-serif leading-[0.98] font-light',
            store ? 'text-[clamp(32px,4vw,52px)]' : 'text-[clamp(28px,3.2vw,42px)]',
          )}
        >
          {title}
        </h3>
        <p className={cn('text-fg-soft text-body mt-3 leading-[1.7]', !store && 'max-w-[34ch]')}>
          {description}
        </p>
      </div>
    </Link>
  );
}
