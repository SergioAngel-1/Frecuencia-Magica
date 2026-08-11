import { Badge, GlassPanel, Button } from '@/components/ui';
import { OrbitalRings } from '@/components/world';
import { Link } from '@/i18n/navigation';
import { formatPrice } from '@/lib/format';
import { cn } from '@/lib/cn';
import type { Experience } from '@/types/content';

type ExperienceRowProps = {
  experience: Experience;
  title: string;
  mode: string;
  modeLabel: string;
  bookLabel: string;
  featured?: boolean;
  className?: string;
};

export function ExperienceRow({
  experience,
  title,
  mode,
  modeLabel,
  bookLabel,
  featured = false,
  className,
}: ExperienceRowProps) {
  if (featured) {
    return (
      <article
        className={cn(
          'relative flex min-h-[340px] overflow-hidden rounded-[26px] text-ivory',
          className,
        )}
        style={{
          border: '1px solid rgba(185,176,214,0.34)',
          backgroundImage: experience.band,
        }}
      >
        {/* Superposición oscura a la izquierda */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, rgba(15,27,46,0.85) 0%, transparent 42%)',
          }}
        />

        {/* Contenido */}
        <div className="relative z-[2] flex flex-1 flex-col justify-center px-[clamp(30px,4vw,50px)] py-[32px]">
          <Badge solid>{modeLabel}</Badge>
          <p className="font-sans text-[11px] uppercase tracking-[.3em] text-teal mt-3">
            {mode}
          </p>
          <h2 className="font-serif text-[clamp(32px,3.6vw,50px)] font-[300] leading-[1.05] mt-1">
            {title}
          </h2>
          <div className="mt-6 flex items-center gap-6">
            <Button variant="primary" size="lg" asChild>
              <Link href={{ pathname: '/experiencias/[experienceId]/reservar', params: { experienceId: experience.id } }}>
                {bookLabel} →
              </Link>
            </Button>
            <div className="font-sans text-[13px] tracking-[.08em] text-ivory/60">
              {experience.dur}
            </div>
            <div className="font-serif text-[30px] text-gold font-[300]">
              {formatPrice(experience.price)}
            </div>
          </div>
        </div>

        {/* Derecha — decoración */}
        <div
          aria-hidden="true"
          className="relative z-[1] hidden w-[280px] shrink-0 md:block"
        >
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(70% 120% at 60% 40%, rgba(247,244,234,0.12), transparent 60%)',
            }}
          />
          <div className="absolute right-[-40px] top-1/2 -translate-y-1/2">
            <OrbitalRings
              size={300}
              spin={100}
              rings={[
                { r: 150, stroke: 'rgba(185,176,214,0.2)' },
                { r: 110, stroke: 'rgba(216,185,120,0.15)', dash: '1 8' },
              ]}
            />
          </div>
        </div>
      </article>
    );
  }

  return (
    <GlassPanel radius={22} className={cn('overflow-hidden', className)}>
      <div className="flex flex-wrap md:flex-nowrap">
        {/* Banda */}
        <div
          className="relative min-h-[150px] w-full shrink-0 md:w-[220px]"
          style={{ backgroundImage: experience.band }}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(70% 100% at 30% 10%, rgba(247,244,234,0.18), transparent 60%)',
            }}
          />
          <div className="absolute left-3 top-3">
            <Badge>{modeLabel}</Badge>
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-1 flex-col justify-center px-6 py-5">
          <h3 className="font-serif text-[26px] font-[400] leading-[1.2] text-ivory">
            {title}
          </h3>
          <p className="font-sans text-[12.5px] tracking-[.06em] text-ivory/60 mt-1">
            {experience.dur}
          </p>
        </div>

        {/* Precio + CTA */}
        <div className="flex items-center gap-4 px-6 py-5 md:flex-col md:items-end md:justify-center">
          <span className="font-serif text-[26px] text-gold">
            {formatPrice(experience.price)}
          </span>
          <Button variant="accent" size="sm" asChild>
            <Link href={{ pathname: '/experiencias/[experienceId]/reservar', params: { experienceId: experience.id } }}>
              {bookLabel}
            </Link>
          </Button>
        </div>
      </div>
    </GlassPanel>
  );
}
