import type { ReactNode } from 'react';

import { OrbitalRings, RealmGlyph } from '@/components/world';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/cn';

type RealmCardProps = {
  href: string;
  band: string;
  emotion: string;
  title: string;
  description: string;
  /** La card de Academia es la única con variante `featured`. */
  featured?: boolean;
  /** Tienda es la única con variante `store`: destacada, ocupa 2 filas. */
  store?: boolean;
  children?: ReactNode;
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
  children,
  className,
}: RealmCardProps) {
  if (featured) {
    return (
      <  Link
        href={href as '/biblioteca'}
        className={cn(
          'group relative grid min-h-[340px] overflow-hidden rounded-[26px] border border-[rgba(150,198,188,0.34)] transition-shadow duration-400 hover:shadow-[0_0_40px_rgba(150,198,188,0.12)]',
          'lg:grid-cols-[1.25fr_1fr]',
          className,
        )}
        style={{ backgroundImage: band }}
      >
        <div className="relative z-[2] flex flex-col justify-center p-[clamp(30px,4vw,52px)]">
          <p className="font-sans text-[11px] uppercase tracking-[.14em] text-teal">{emotion}</p>
          <h3 className="mt-2 font-serif font-light text-[clamp(38px,4.6vw,62px)] leading-[1] text-ivory">
            {title}
          </h3>
          <p className="text-ivory/82 mt-[14px] mb-[26px] max-w-[42ch] text-[15px] leading-[1.7]">
            {description}
          </p>
          {children}
        </div>
        <div
          aria-hidden="true"
          className="relative z-[2]"
          style={{
            background:
              'linear-gradient(90deg, rgba(15,27,46,0.9) 0%, transparent 40%)',
          }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-[30px] top-1/2 -translate-y-1/2"
          >
            <OrbitalRings
              size={300}
              spin={100}
              rings={[
                { r: 150, stroke: 'rgba(247,244,234,0.08)' },
                { r: 120, stroke: 'rgba(150,198,188,0.12)' },
              ]}
            />
          </div>
          <div className="absolute right-[10%] top-1/2 -translate-y-1/2">
            <RealmGlyph size={72} color="var(--color-teal)" />
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={href as '/biblioteca'}
      className={cn(
        'group relative min-h-[210px] overflow-hidden rounded-[22px] border border-glass-brd p-[28px] transition-shadow duration-400 hover:shadow-[0_0_30px_rgba(216,185,120,0.1)]',
        store && 'border-[rgba(216,185,120,0.32)] sm:row-span-2',
        className,
      )}
      style={{ backgroundImage: band }}
    >
      {/* Degradado inferior */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: 'linear-gradient(180deg, transparent 30%, rgba(10,18,32,0.72))' }}
      />

      {/* Glifo */}
      <RealmGlyph
        size={store ? 72 : 40}
        color={store ? 'var(--color-gold)' : 'var(--color-gold)'}
        className="absolute right-[16px] top-[16px]"
      />

      {/* Luz radial para destacada */}
      {store ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(70% 45% at 75% 20%, rgba(216,185,120,0.22), transparent 60%)',
          }}
        />
      ) : null}

      {/* Aros orbitales para tienda */}
      {store ? (
        <div aria-hidden="true" className="pointer-events-none absolute right-[-20px] top-[-20px]">
          <OrbitalRings
            size={200}
            spin={100}
            rings={[
              { r: 100, stroke: 'rgba(216,185,120,0.08)' },
              { r: 80, stroke: 'rgba(150,198,188,0.08)' },
            ]}
          />
        </div>
      ) : null}

      {/* Contenido */}
      <div className="relative z-[2] flex h-full flex-col justify-end">
        <p className="font-sans text-[11px] uppercase tracking-[.14em] text-[rgba(247,244,234,0.7)]">
          {emotion}
        </p>
        <h3
          className={cn(
            'font-serif font-light leading-[1.05] text-ivory',
            store ? 'mt-[6px] text-[clamp(30px,3vw,42px)]' : 'mt-[4px] text-[29px]',
          )}
        >
          {title}
        </h3>
        <p
          className={cn(
            'text-ivory/72 mt-[8px] leading-[1.7]',
            store ? 'text-[15px]' : 'max-w-[34ch] text-[13.5px]',
          )}
        >
          {description}
        </p>

        {store ? (
          <div className="mt-[16px]">{children}</div>
        ) : null}
      </div>
    </Link>
  );
}
