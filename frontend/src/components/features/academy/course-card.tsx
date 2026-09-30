import { Badge, EditorialImage, GlassPanel, Display } from '@/components/ui';
import { cn } from '@/lib/cn';
import type { EditorialMedia } from '@/types/editorial-media';
import type { Course } from '@/types/content';

type CourseCardProps = {
  course: Course;
  title: string;
  level: string;
  lessonsLabel: string;
  media: EditorialMedia;
  description?: string;
  cta?: string;
  featured?: boolean;
  className?: string;
};

export function CourseCard({
  course,
  title,
  level,
  lessonsLabel,
  media,
  description,
  cta,
  featured = false,
  className,
}: CourseCardProps) {
  if (featured) {
    return (
      <article
        className={cn(
          'rounded-card-lg text-ivory relative isolate min-h-[clamp(420px,42vw,600px)] overflow-hidden',
          className,
        )}
        data-course-id={course.id}
        data-editorial-media="academy.featured-course"
      >
        <div className="absolute inset-0">
          <EditorialImage
            aspect="16:8"
            className="h-full"
            media={media}
            overlay="bottom"
            scrim="left"
          />
        </div>
        <div className="relative z-10 flex min-h-[clamp(420px,42vw,600px)] max-w-[720px] flex-col justify-end px-[clamp(24px,6vw,76px)] py-[clamp(30px,6vw,76px)]">
          <Badge solid>{level}</Badge>
          <Display level="h2" size="feature" className="mt-5 max-w-[12ch]">
            {title}
          </Display>
          {description ? (
            <p className="text-fg-body mt-5 max-w-[48ch] text-[16px] leading-[1.7]">
              {description}
            </p>
          ) : null}
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
            <span className="border-gold/55 text-gold text-label tracking-caps min-h-11 border-b py-3 font-sans uppercase">
              {cta}
            </span>
            <span className="text-fg-soft text-meta tracking-ui font-sans uppercase">
              {lessonsLabel}
            </span>
          </div>
        </div>
      </article>
    );
  }

  return (
    <GlassPanel
      as="article"
      radius={22}
      className={cn('group hover:border-gold/45 overflow-hidden transition-colors', className)}
      data-course-id={course.id}
      data-editorial-media="academy-course-cover"
    >
      <div className="relative aspect-square">
        <EditorialImage
          aspect="1:1"
          className="h-full"
          media={media}
          overlay="bottom"
          scrim="bottom"
        />
        <div className="absolute top-4 left-4 z-10">
          <Badge>{level}</Badge>
        </div>
      </div>

      <div className="px-6 pt-5 pb-7">
        <h3 className="text-ivory font-serif text-[clamp(26px,3vw,34px)] leading-[1.05]">
          {title}
        </h3>
        <p className="text-fg-muted text-meta tracking-soft mt-3 font-sans">{lessonsLabel}</p>
      </div>
    </GlassPanel>
  );
}
