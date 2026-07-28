import { Badge, GlassPanel } from '@/components/ui';
import { OrbitalRings } from '@/components/world/orbital-rings';
import { cn } from '@/lib/cn';
import type { Course } from '@/types/content';

type CourseCardProps = {
  course: Course;
  title: string;
  level: string;
  lessonsLabel: string;
  featured?: boolean;
  className?: string;
};

export function CourseCard({
  course,
  title,
  level,
  lessonsLabel,
  featured = false,
  className,
}: CourseCardProps) {
  if (featured) {
    return (
      <article
        className={cn(
          'relative flex min-h-[340px] overflow-hidden rounded-[26px] text-ivory',
          className,
        )}
        style={{
          border: '1px solid rgba(216,185,120,0.32)',
          background:
            'linear-gradient(120deg, rgba(216,185,120,0.12), rgba(15,27,46,0.4))',
        }}
      >
        {/* Lado izquierdo — banda */}
        <div
          className="relative hidden min-h-[300px] flex-1 md:block"
          style={{ backgroundImage: course.band }}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(70% 100% at 30% 10%, rgba(247,244,234,0.18), transparent 60%)',
            }}
          />
          <div className="absolute bottom-6 right-6">
            <OrbitalRings
              size={150}
              spin={90}
              rings={[
                { r: 75, stroke: 'rgba(216,185,120,0.3)' },
                { r: 55, stroke: 'rgba(150,198,188,0.2)', dash: '1 7' },
              ]}
            />
          </div>
          <div className="absolute left-4 top-4">
            <Badge solid>{level}</Badge>
          </div>
        </div>

        {/* Lado derecho — información */}
        <div className="flex flex-1 flex-col justify-center px-[clamp(24px,4vw,44px)] py-[32px]">
          <p className="font-sans text-[11px] uppercase tracking-[.3em] text-teal">{level}</p>
          <h3 className="font-serif text-[clamp(30px,3.4vw,46px)] font-[300] leading-[1.05]">
            {title}
          </h3>
          <p className="text-ivory/70 mt-[14px] max-w-[40ch] font-sans text-[14px] leading-[1.7]">
            {lessonsLabel}
          </p>
          <div className="mt-6 flex items-center gap-4">
            <span className="inline-flex items-center gap-2 rounded-[999px] border border-ivory/22 bg-ivory/8 px-5 py-2 font-serif text-[17px] tracking-[.04em] backdrop-blur-[6px]">
              ▶ {level}
            </span>
            <span className="font-sans text-[13px] tracking-[.08em] text-ivory/60">
              {lessonsLabel}
            </span>
          </div>
        </div>
      </article>
    );
  }

  return (
    <GlassPanel radius={22} className={cn('group overflow-hidden', className)}>
      <div
        className="relative h-[180px]"
        style={{ backgroundImage: course.band }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, transparent 30%, rgba(10,18,32,0.72))',
          }}
        />
        <div className="absolute left-3 top-3">
          <Badge>{level}</Badge>
        </div>
      </div>

      <div className="px-6 pb-[26px] pt-[22px]">
        <h3 className="font-serif text-[27px] font-[400] leading-[1.15] text-ivory">
          {title}
        </h3>
        <p className="text-ivory/60 mt-[6px] font-sans text-[12.5px] tracking-[.06em]">
          {lessonsLabel}
        </p>
      </div>
    </GlassPanel>
  );
}
