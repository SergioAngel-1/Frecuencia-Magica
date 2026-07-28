import { cn } from '@/lib/cn';

export type OrbTone = 'lav' | 'gold' | 'teal';

/** Núcleo del orbe: luz que nace descentrada, como una esfera iluminada de lado. */
const CORE: Record<OrbTone, string> = {
  lav: 'radial-gradient(circle at 42% 38%, rgba(247,244,234,0.9), rgba(185,176,214,0.55) 44%, transparent 72%)',
  gold: 'radial-gradient(circle at 42% 38%, rgba(247,244,234,0.9), rgba(216,185,120,0.55) 44%, transparent 72%)',
  teal: 'radial-gradient(circle at 42% 38%, rgba(247,244,234,0.9), rgba(150,198,188,0.55) 44%, transparent 72%)',
};

const GLOW: Record<OrbTone, string> = {
  lav: '0 0 80px 22px rgba(185,176,214,0.3)',
  gold: '0 0 80px 22px rgba(216,185,120,0.3)',
  teal: '0 0 80px 22px rgba(150,198,188,0.3)',
};

interface LoadingOrbProps {
  size?: number;
  tone?: OrbTone;
  /** Texto bajo el orbe. Ya traducido. */
  label?: string;
  /**
   * `false` deja el orbe quieto y sin `role="status"`: se usa como remate de
   * una confirmación (pedido realizado, reserva hecha), no como espera.
   */
  loading?: boolean;
  className?: string;
}

/**
 * Orbe que respira mientras el sistema trabaja.
 *
 * Es el reemplazo del spinner en las esperas con narrativa —la sintonización
 * de Descúbrete, sobre todo— y el remate de las confirmaciones cuando
 * `loading` es `false`.
 */
export function LoadingOrb({
  size = 130,
  tone = 'lav',
  label,
  loading = true,
  className,
}: LoadingOrbProps) {
  return (
    <div
      className={cn('flex flex-col items-center text-center', className)}
      {...(loading ? { role: 'status' } : {})}
    >
      <div
        className="relative animate-[fm-breathe_3s_ease-in-out_infinite]"
        style={{ width: size, height: size }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-full"
          style={{ background: CORE[tone], boxShadow: GLOW[tone] }}
        />
        {loading ? (
          <svg
            aria-hidden="true"
            viewBox="0 0 130 130"
            className="absolute inset-0 animate-[fm-spin_8s_linear_infinite]"
            style={{ width: size, height: size }}
          >
            <circle
              cx="65"
              cy="65"
              r="58"
              fill="none"
              stroke="rgba(216,185,120,0.4)"
              strokeWidth="0.7"
              strokeDasharray="3 7"
            />
          </svg>
        ) : null}
      </div>

      {label ? (
        <p className="text-ivory/80 mt-[26px] font-serif text-[clamp(19px,2.4vw,24px)] italic">
          {label}
        </p>
      ) : null}
    </div>
  );
}
