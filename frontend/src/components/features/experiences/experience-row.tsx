import { Badge, Button, EditorialImage } from '@/components/ui';
import { OrbitalRings } from '@/components/world';
import { Link } from '@/i18n/navigation';
import { formatPrice } from '@/lib/format';
import { cn } from '@/lib/cn';
import type { EditorialMedia } from '@/types/editorial-media';
import type { Experience } from '@/types/content';

type ExperienceRowProps = {
  experience: Experience;
  title: string;
  mode: string;
  modeLabel: string;
  bookLabel: string;
  media: EditorialMedia;
  description?: string;
  featured?: boolean;
  className?: string;
};

function BookingLink({
  bookLabel,
  experience,
  variant,
}: Pick<ExperienceRowProps, 'bookLabel' | 'experience'> & {
  variant: 'primary' | 'accent';
}) {
  return (
    <Button variant={variant} size="lg" asChild>
      <Link
        href={{
          pathname: '/experiencias/[experienceId]/reservar',
          params: { experienceId: experience.id },
        }}
      >
        {bookLabel} →
      </Link>
    </Button>
  );
}

export function ExperienceRow({
  experience,
  title,
  mode,
  modeLabel,
  bookLabel,
  media,
  description,
  featured = false,
  className,
}: ExperienceRowProps) {
  if (featured) {
    return (
      <article
        className={cn(
          'rounded-card-lg text-ivory relative isolate min-h-[clamp(430px,42vw,620px)] overflow-hidden',
          className,
        )}
        data-editorial-media="experiences.featured"
        data-experience-id={experience.id}
      >
        <div className="absolute inset-0">
          <EditorialImage
            aspect="16:8"
            className="h-full"
            focalPoint={media.position}
            media={media}
            overlay="left"
            scrim="left"
          />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-[10%] right-[8%] z-[1] hidden md:block"
          data-editorial-geometry="true"
        >
          <OrbitalRings
            size={300}
            spin={100}
            rings={[
              { r: 150, stroke: 'rgba(185,176,214,0.2)' },
              { r: 110, stroke: 'rgba(216,185,120,0.15)', dash: '1 8' },
            ]}
          />
        </div>
        <div className="relative z-10 flex min-h-[clamp(430px,42vw,620px)] max-w-[760px] flex-col justify-end px-[clamp(24px,7vw,84px)] py-[clamp(30px,7vw,84px)]">
          <Badge solid>{modeLabel}</Badge>
          <p className="text-teal mt-4 font-sans text-[11px] tracking-[.3em] uppercase">{mode}</p>
          <h2 className="text-ivory mt-2 max-w-[13ch] font-serif text-[clamp(38px,6vw,78px)] leading-[0.92]">
            {title}
          </h2>
          {description ? (
            <p className="text-ivory/82 mt-5 max-w-[48ch] text-[16px] leading-[1.7]">
              {description}
            </p>
          ) : null}
          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-4">
            <BookingLink bookLabel={bookLabel} experience={experience} variant="primary" />
            <div className="text-ivory/72 flex flex-wrap items-center gap-x-5 gap-y-2 font-sans text-[13px] tracking-[.08em]">
              <span>{experience.dur}</span>
              <span className="text-gold font-serif text-[30px]">
                {formatPrice(experience.price)}
              </span>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      className={cn(
        'rounded-card-lg text-ivory relative isolate min-h-[clamp(320px,34vw,470px)] overflow-hidden',
        className,
      )}
      data-editorial-media="experiences-visual"
      data-experience-id={experience.id}
    >
      <div className="absolute inset-0">
        <EditorialImage
          aspect="16:9"
          className="h-full"
          focalPoint={media.position}
          media={media}
          overlay="left"
          scrim="left"
        />
      </div>
      <div className="relative z-10 grid min-h-[clamp(320px,34vw,470px)] items-end gap-8 px-[clamp(24px,6vw,72px)] py-[clamp(28px,5vw,60px)] md:grid-cols-[minmax(0,1fr)_minmax(180px,0.35fr)] md:items-center md:gap-12">
        <div className="max-w-[600px]">
          <Badge>{modeLabel}</Badge>
          <p className="text-teal mt-4 font-sans text-[11px] tracking-[.3em] uppercase">{mode}</p>
          <h3 className="text-ivory mt-2 max-w-[14ch] font-serif text-[clamp(32px,4.5vw,58px)] leading-[0.94]">
            {title}
          </h3>
        </div>
        <div className="border-ivory/25 flex min-h-11 flex-wrap items-center gap-x-5 gap-y-3 border-t pt-5 md:border-t-0 md:border-l md:pt-0 md:pl-8">
          <div className="flex min-h-11 flex-col justify-center">
            <span className="text-ivory/62 font-sans text-[12px] tracking-[.08em] uppercase">
              {mode}
            </span>
            <span className="text-ivory mt-1 font-serif text-[26px]">{experience.dur}</span>
          </div>
          <span className="text-gold font-serif text-[30px]">{formatPrice(experience.price)}</span>
          <BookingLink bookLabel={bookLabel} experience={experience} variant="accent" />
        </div>
      </div>
    </article>
  );
}
