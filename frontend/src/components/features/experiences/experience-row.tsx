import { ButtonLink } from '@/components/layout';
import { Badge, EditorialImage, Kicker, Display } from '@/components/ui';
import { OrbitalRings } from '@/components/world';
import type { DateOption } from '@/lib/booking/dates';
import { formatPrice } from '@/lib/format';
import { cn } from '@/lib/cn';
import type { EditorialMedia } from '@/types/editorial-media';
import type { Experience } from '@/types/content';

type ExperienceRowProps = {
  experience: Experience;
  title: string;
  mode: string;
  modeLabel: string;
  date: DateOption;
  dateLabel: string;
  durationLabel: string;
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
    <ButtonLink
      variant={variant}
      size="lg"
      href={{
        pathname: '/experiencias/[experienceId]/reservar',
        params: { experienceId: experience.id },
      }}
    >
      {bookLabel} →
    </ButtonLink>
  );
}

export function ExperienceRow({
  experience,
  title,
  mode,
  modeLabel,
  date,
  dateLabel,
  durationLabel,
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
          'text-ivory relative isolate min-h-[clamp(430px,42vw,620px)] overflow-hidden',
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
        <div className="fm-container relative z-10 flex min-h-[clamp(430px,42vw,620px)] flex-col justify-end py-[clamp(30px,7vw,84px)]">
          <div className="flex max-w-[760px] flex-col">
            <Badge solid>{modeLabel}</Badge>
            <Kicker tone="teal" className="mt-4">
              {mode}
            </Kicker>
            <Display level="h2" size="feature" className="mt-2 max-w-[13ch]">
              {title}
            </Display>
            {description ? (
              <p className="text-fg-body mt-5 max-w-[48ch] text-[16px] leading-[1.7]">
                {description}
              </p>
            ) : null}
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-4">
              <BookingLink bookLabel={bookLabel} experience={experience} variant="primary" />
              <div className="text-fg-soft text-meta tracking-ui flex flex-wrap items-center gap-x-5 gap-y-2 font-sans">
                <time dateTime={date.iso}>
                  <span className="sr-only">{dateLabel}: </span>
                  {date.dow} {date.day} {date.month}
                </time>
                <span>{experience.dur}</span>
                <span className="text-gold font-serif text-[30px]">
                  {formatPrice(experience.price)}
                </span>
              </div>
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
      <div className="relative z-10 grid min-h-[clamp(320px,34vw,470px)] items-end gap-8 px-[clamp(24px,6vw,72px)] py-[clamp(28px,5vw,60px)] lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-12">
        <div className="max-w-[600px]">
          <Badge>{modeLabel}</Badge>
          <h3 className="text-ivory mt-4 max-w-[14ch] font-serif text-[clamp(32px,4.5vw,58px)] leading-[0.94]">
            {title}
          </h3>
        </div>
        <div className="border-ivory/25 flex min-h-11 flex-wrap items-center gap-x-6 gap-y-3 border-t pt-5 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
          <div className="flex min-h-11 flex-col justify-center">
            <span className="text-fg-muted text-meta tracking-ui font-sans uppercase">
              {dateLabel}
            </span>
            <time dateTime={date.iso} className="text-ivory mt-1 font-serif text-[22px]">
              {date.dow} {date.day} {date.month}
            </time>
          </div>
          <div className="flex min-h-11 flex-col justify-center">
            <span className="text-fg-muted text-meta tracking-ui font-sans uppercase">
              {durationLabel}
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
