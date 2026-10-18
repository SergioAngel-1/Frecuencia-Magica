import {
  ArrowGlyph,
  arrowLinkClasses,
  Display,
  EditorialImage,
  Float,
  Kicker,
} from '@/components/ui';
import { OrbitalRings, RealmGlyph } from '@/components/world';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/cn';
import { editorialVisual } from '@/lib/editorial/visual';
import type { EditorialMedia } from '@/types/editorial-media';

type RealmCardProps = {
  href: string;
  band: string;
  /**
   * El héroe de la vista interna del realm, recortado a la tarjeta: la puerta
   * se ve como lo que hay detrás. Sin foto publicada queda la banda.
   */
  media: EditorialMedia;
  /** Posición en el bento: desfasa el flotado para que las tarjetas no suban a la vez. */
  order?: number;
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
  media,
  order = 0,
  emotion,
  title,
  description,
  featured = false,
  store = false,
  actionLabel,
  className,
}: RealmCardProps) {
  // Sobre la foto no va geometría: los aros y el glifo son la materia de la
  // banda, lo que la tarjeta pinta mientras su realm no tiene imagen.
  const geometry = editorialVisual(media) !== 'photo';
  const cover = (
    <div aria-hidden="true" className="absolute inset-0">
      <EditorialImage
        className="h-full"
        focalPoint={media.position}
        media={media}
        overlay={false}
        scrim={featured ? 'left' : false}
      />
    </div>
  );

  if (featured) {
    return (
      <Float order={order} className={className}>
        <Link
          href={href as '/resonario'}
          data-editorial-panel="featured"
          className={cn(
            'group border-accent-2/35 focus-visible:ring-accent-2 rounded-card relative grid h-full min-h-[360px] overflow-hidden border transition-transform duration-500 outline-none hover:-translate-y-1 hover:shadow-[0_0_42px_color-mix(in_srgb,var(--color-accent-2)_14%,transparent)] focus-visible:ring-2 sm:min-h-[400px] lg:grid-cols-[1.15fr_0.85fr]',
          )}
          style={{ backgroundImage: band }}
        >
          {cover}
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

          {geometry ? (
            <div
              aria-hidden="true"
              className="pointer-events-none relative z-[2] hidden min-h-[260px] lg:block"
            >
              <div className="absolute top-1/2 right-[8%] -translate-y-1/2 opacity-80">
                <OrbitalRings
                  size={330}
                  spin={100}
                  rings={[
                    { r: 164, stroke: 'color-mix(in srgb, var(--color-fg) 10%, transparent)' },
                    {
                      r: 130,
                      stroke: 'color-mix(in srgb, var(--color-accent-2) 18%, transparent)',
                    },
                  ]}
                />
              </div>
              <RealmGlyph
                size={82}
                color="var(--color-accent-2)"
                className="absolute top-1/2 right-[15%] -translate-y-1/2"
              />
            </div>
          ) : null}
        </Link>
      </Float>
    );
  }

  return (
    <Float order={order} className={className}>
      <Link
        href={href as '/resonario'}
        data-editorial-panel={store ? 'conversion' : 'secondary'}
        className={cn(
          'group border-line focus-visible:ring-accent rounded-card relative flex h-full min-h-[230px] flex-col justify-end overflow-hidden border p-[clamp(24px,3vw,38px)] transition-transform duration-500 outline-none hover:-translate-y-1 hover:shadow-[0_0_34px_rgb(var(--halo)_/_0.12)] focus-visible:ring-2',
          store && 'border-accent/35 lg:min-h-[300px]',
        )}
        style={{ backgroundImage: band }}
      >
        {cover}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_22%,rgb(var(--scrim-deep)/0.82)_100%)]"
        />
        {/* Tienda ya lleva su pill de conversión arriba a la izquierda y aros
          orbitales arriba a la derecha: un glifo encima chocaría con la pill. */}
        {store || !geometry ? null : (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-[18px] right-[18px] opacity-75"
          >
            <RealmGlyph size={46} color="var(--color-accent)" />
          </div>
        )}
        {store && geometry ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-[-30px] right-[-30px] opacity-70"
          >
            <OrbitalRings
              size={210}
              spin={100}
              rings={[
                { r: 105, stroke: 'rgb(var(--halo) / 0.1)' },
                { r: 84, stroke: 'color-mix(in srgb, var(--color-accent-2) 10%, transparent)' },
              ]}
            />
          </div>
        ) : null}

        <div className="relative z-[2]">
          {store && actionLabel ? (
            <span className="rounded-pill border-accent/45 text-accent text-label tracking-label mb-4 inline-flex min-h-11 items-center border px-3 font-sans uppercase">
              {actionLabel}
            </span>
          ) : null}
          <p className="text-fg-soft text-label tracking-caps font-sans uppercase">{emotion}</p>
          <h3
            className={cn(
              'text-fg mt-2 font-serif leading-[0.98] font-light',
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
    </Float>
  );
}
