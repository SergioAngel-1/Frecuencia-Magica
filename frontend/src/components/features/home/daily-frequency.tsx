'use client';

import { usePlayerStore } from '@/stores/player-store';
import { cn } from '@/lib/cn';

type DailyFrequencyProps = {
  hz: number;
  band: string;
  audioId: string;
  kicker: string;
  title: string;
  description: string;
  meta: string;
  cta: string;
};

export function DailyFrequency({
  hz,
  band,
  audioId,
  kicker,
  title,
  description,
  meta,
  cta,
}: DailyFrequencyProps) {
  const open = usePlayerStore((s) => s.open);
  const activeId = usePlayerStore((s) => s.audioId);
  const isActive = activeId === audioId;

  return (
    <button
      type="button"
      onClick={() => open(audioId)}
      className={cn(
        'group relative w-full overflow-hidden rounded-[26px] border p-[clamp(26px,3.4vw,44px)] text-left transition-shadow duration-300',
        isActive
          ? 'border-[rgba(216,185,120,0.55)] shadow-[0_0_60px_rgba(216,185,120,0.2)]'
          : 'border-[rgba(216,185,120,0.34)]',
      )}
      style={{
        background:
          'linear-gradient(120deg, rgba(216,185,120,0.14), rgba(15,27,46,0.35) 60%, rgba(150,198,188,0.12))',
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(50% 120% at 88% 0%, rgba(216,185,120,0.2), transparent 60%)',
        }}
      />
      <div className="relative grid grid-cols-[auto_1fr_auto] items-center gap-[clamp(24px,4vw,52px)] max-md:grid-cols-1 max-md:text-center">
        {/* Columna 1 — disco de frecuencia */}
        <div
          className="animate-fm-float relative mx-auto aspect-square w-[clamp(130px,15vw,180px)] rounded-full"
          style={{ animationDuration: '8s' }}
        >
          <div
            aria-hidden="true"
            className="absolute -inset-[10%] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(216,185,120,0.22), transparent 66%)',
              filter: 'blur(12px)',
              animation: 'fm-breathe 7s ease-in-out infinite',
            }}
          />
          <svg
            aria-hidden="true"
            viewBox="-100 -100 200 200"
            className="absolute inset-0 size-full"
            style={{ animation: 'fm-spin 90s linear infinite' }}
          >
            <circle r="98" fill="none" stroke="rgba(216,185,120,0.35)" strokeWidth={0.7} />
            <circle r="82" fill="none" stroke="rgba(150,198,188,0.3)" strokeWidth={0.6} strokeDasharray="1 7" />
          </svg>
          <div
            className="absolute overflow-hidden rounded-full border"
            style={{
              inset: 12,
              backgroundImage: band,
              borderColor: 'rgba(216,185,120,0.55)',
              boxShadow: '0 0 50px rgba(216,185,120,0.35)',
            }}
          >
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(70% 80% at 32% 22%, rgba(247,244,234,0.24), transparent 62%)',
              }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-serif text-[clamp(30px,3.4vw,44px)] leading-none text-ivory">
                {hz}
              </span>
              <span className="text-ivory/75 font-sans text-[10px] uppercase tracking-[.28em]">
                Hz
              </span>
            </div>
          </div>
        </div>

        {/* Columna 2 — texto */}
        <div>
          <p className="font-sans text-[11px] uppercase tracking-[.14em] text-gold">{kicker}</p>
          <h3 className="mt-1 font-serif font-light text-[clamp(28px,3.4vw,44px)] leading-[1.05] text-ivory">
            {title}
          </h3>
          <p className="text-ivory/74 mt-[10px] max-w-[46ch] text-[15px] leading-[1.75]">
            {description}
          </p>
          <p className="text-ivory/55 mt-[8px] font-sans text-[13px]">{meta}</p>
        </div>

        {/* Columna 3 — botón de play */}
        <div className="flex flex-col items-center gap-2 max-md:mt-4 max-md:flex-row max-md:justify-center">
          <span
            className="flex size-[74px] items-center justify-center rounded-full border backdrop-blur-[4px] transition-[background,box-shadow] duration-300 group-hover:shadow-[0_0_30px_rgba(216,185,120,0.4)]"
            style={{
              borderColor: 'rgba(216,185,120,0.6)',
              background: 'rgba(216,185,120,0.14)',
              animation: 'fm-breathe 6s ease-in-out infinite',
            }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-ivory translate-x-[6%]"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
          <span className="font-sans text-[11px] uppercase tracking-[.14em] text-gold">
            {cta}
          </span>
        </div>
      </div>
    </button>
  );
}
