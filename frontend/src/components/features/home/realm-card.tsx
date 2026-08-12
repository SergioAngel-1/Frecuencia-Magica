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
          'group border-teal/35 focus-visible:ring-teal relative grid min-h-[360px] overflow-hidden rounded-[4px] border transition-transform duration-500 outline-none hover:-translate-y-1 hover:shadow-[0_0_42px_rgba(150,198,188,0.14)] focus-visible:ring-2 sm:min-h-[400px] lg:grid-cols-[1.15fr_0.85fr]',
          className,
        )}
        style={{ backgroundImage: band }}
      >
        <div className="relative z-[2] flex flex-col justify-end p-[clamp(28px,5vw,68px)]">
          <p className="text-teal font-sans text-[11px] tracking-[.3em] uppercase">{emotion}</p>
          <h3 className="text-ivory mt-3 max-w-[10ch] font-serif text-[clamp(42px,6vw,76px)] leading-[0.94] font-light">
            {title}
          </h3>
          <p className="text-ivory/84 mt-5 max-w-[42ch] text-[15px] leading-[1.75]">
            {description}
          </p>
          {actionLabel ? (
            <span className="border-teal/70 text-teal mt-7 inline-flex min-h-11 w-fit items-center border-b pb-1 font-sans text-[11px] tracking-[.18em] uppercase">
              {actionLabel}
              <span aria-hidden="true" className="ml-3 text-[18px] leading-none">
                →
              </span>
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
        'group border-glass-brd focus-visible:ring-gold relative flex min-h-[230px] flex-col justify-end overflow-hidden rounded-[4px] border p-[clamp(24px,3vw,38px)] transition-transform duration-500 outline-none hover:-translate-y-1 hover:shadow-[0_0_34px_rgba(216,185,120,0.12)] focus-visible:ring-2',
        store && 'border-gold/35 sm:row-span-2 sm:min-h-[300px]',
        className,
      )}
      style={{ backgroundImage: band }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_22%,rgba(10,18,32,0.82)_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[18px] right-[18px] opacity-75"
      >
        <RealmGlyph
          size={store ? 78 : 46}
          color={store ? 'var(--color-gold)' : 'var(--color-gold)'}
        />
      </div>
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
          <span className="rounded-pill border-gold/45 text-gold mb-4 inline-flex min-h-11 items-center border px-3 font-sans text-[11px] tracking-[.16em] uppercase">
            {actionLabel}
          </span>
        ) : null}
        <p className="text-ivory/72 font-sans text-[11px] tracking-[.22em] uppercase">{emotion}</p>
        <h3
          className={cn(
            'text-ivory mt-2 font-serif leading-[0.98] font-light',
            store ? 'text-[clamp(32px,4vw,52px)]' : 'text-[clamp(28px,3.2vw,42px)]',
          )}
        >
          {title}
        </h3>
        <p className={cn('text-ivory/78 mt-3 text-[15px] leading-[1.7]', !store && 'max-w-[34ch]')}>
          {description}
        </p>
      </div>
    </Link>
  );
}
