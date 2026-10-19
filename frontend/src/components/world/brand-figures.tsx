import type { CSSProperties } from 'react';

import type { VisualMode } from '@/config/realms';
import { useEngineProfile } from '@/hooks/use-engine-profile';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { fadeDuration } from '@/lib/atmosphere/engine-profile';

/** Los aros son los tres acentos del tema a poca opacidad: en la noche, oro, teal y lavanda de siempre. */
const RING_GOLD = 'color-mix(in srgb, var(--color-accent) 10%, transparent)';
const RING_TEAL = 'color-mix(in srgb, var(--color-accent-2) 9%, transparent)';
const RING_LAV = 'color-mix(in srgb, var(--color-accent-3) 8%, transparent)';

const STAR_PATH = 'M12 0 L13.4 10.6 L24 12 L13.4 13.4 L12 24 L10.6 13.4 L0 12 L10.6 10.6 Z';

/** Los cuatro destellos de cuatro puntas, con su posición, color y ritmo. */
type Sparkle = {
  style: CSSProperties;
  size: number;
  fill: string;
  duration: string;
  delay: string;
};

const SPARKLES: readonly Sparkle[] = [
  {
    style: { top: '14%', left: '11%' },
    size: 26,
    fill: 'var(--color-accent)',
    duration: '6s',
    delay: '0s',
  },
  {
    style: { top: '26%', right: '16%' },
    size: 18,
    fill: 'var(--color-accent-3)',
    duration: '7.5s',
    delay: '.8s',
  },
  {
    style: { bottom: '20%', right: '24%' },
    size: 22,
    fill: 'var(--color-accent-2)',
    duration: '8s',
    delay: '.4s',
  },
  {
    style: { bottom: '30%', left: '20%' },
    size: 15,
    fill: 'var(--color-accent)',
    duration: '6.8s',
    delay: '1.2s',
  },
];

/**
 * Figuras de marca: dos aros concéntricos de esquina y cuatro destellos de
 * cuatro puntas parpadeando desincronizados. Decorativas y sin interacción.
 */
export function BrandFigures({ visualMode = 'cosmic' }: { visualMode?: VisualMode }) {
  const { figures } = useEngineProfile(visualMode);
  const reduced = useReducedMotionSafe();
  const fade = fadeDuration(reduced);

  return (
    <div
      aria-hidden="true"
      className="z-atmosphere pointer-events-none fixed inset-0 overflow-hidden"
      style={{ opacity: figures, transition: `opacity ${fade}s ease-in-out` }}
    >
      {/* Aro superior derecho */}
      <svg
        viewBox="0 0 200 200"
        className="absolute"
        style={{
          top: '-16vw',
          right: '-14vw',
          width: '46vw',
          height: '46vw',
          animation: 'fm-ring-pulse 16s ease-in-out infinite',
        }}
      >
        <circle cx="100" cy="100" r="96" fill="none" style={{ stroke: RING_GOLD }} />
        <circle
          cx="100"
          cy="100"
          r="74"
          fill="none"
          style={{ stroke: RING_TEAL }}
          strokeDasharray="1 6"
        />
        <circle cx="100" cy="100" r="52" fill="none" style={{ stroke: RING_LAV }} />
      </svg>

      {/* Aro inferior izquierdo */}
      <svg
        viewBox="0 0 200 200"
        className="absolute"
        style={{
          bottom: '-20vw',
          left: '-16vw',
          width: '52vw',
          height: '52vw',
          animation: 'fm-spin 200s linear infinite',
        }}
      >
        <circle cx="100" cy="100" r="96" fill="none" style={{ stroke: RING_GOLD }} />
        <circle
          cx="100"
          cy="100"
          r="66"
          fill="none"
          style={{ stroke: RING_TEAL }}
          strokeDasharray="1 8"
        />
      </svg>

      {SPARKLES.map((sparkle, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className="absolute"
          style={{
            ...sparkle.style,
            width: sparkle.size,
            height: sparkle.size,
            animation: `fm-sparkle ${sparkle.duration} ease-in-out infinite`,
            animationDelay: sparkle.delay,
          }}
        >
          <path d={STAR_PATH} style={{ fill: sparkle.fill }} />
        </svg>
      ))}
    </div>
  );
}
