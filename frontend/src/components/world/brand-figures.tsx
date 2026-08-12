import type { CSSProperties } from 'react';

import type { VisualMode } from '@/config/realms';

const STAR_PATH = 'M12 0 L13.4 10.6 L24 12 L13.4 13.4 L12 24 L10.6 13.4 L0 12 L10.6 10.6 Z';
const MODE_OPACITY: Record<VisualMode, number> = {
  cosmic: 1,
  editorial: 0.7,
  quiet: 0.5,
};

/** Los cuatro destellos de cuatro puntas, con su posición, color y ritmo. */
type Sparkle = {
  style: CSSProperties;
  size: number;
  fill: string;
  duration: string;
  delay: string;
};

const SPARKLES: readonly Sparkle[] = [
  { style: { top: '14%', left: '11%' }, size: 26, fill: '#D8B978', duration: '6s', delay: '0s' },
  {
    style: { top: '26%', right: '16%' },
    size: 18,
    fill: '#B9B0D6',
    duration: '7.5s',
    delay: '.8s',
  },
  {
    style: { bottom: '20%', right: '24%' },
    size: 22,
    fill: '#96C6BC',
    duration: '8s',
    delay: '.4s',
  },
  {
    style: { bottom: '30%', left: '20%' },
    size: 15,
    fill: '#D8B978',
    duration: '6.8s',
    delay: '1.2s',
  },
];

/**
 * Figuras de marca: dos aros concéntricos de esquina y cuatro destellos de
 * cuatro puntas parpadeando desincronizados. Decorativas y sin interacción.
 */
export function BrandFigures({ visualMode = 'cosmic' }: { visualMode?: VisualMode }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[1] overflow-hidden"
      style={{ opacity: MODE_OPACITY[visualMode] }}
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
        <circle cx="100" cy="100" r="96" fill="none" stroke="rgba(216,185,120,0.10)" />
        <circle
          cx="100"
          cy="100"
          r="74"
          fill="none"
          stroke="rgba(150,198,188,0.09)"
          strokeDasharray="1 6"
        />
        <circle cx="100" cy="100" r="52" fill="none" stroke="rgba(185,176,214,0.08)" />
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
        <circle cx="100" cy="100" r="96" fill="none" stroke="rgba(216,185,120,0.10)" />
        <circle
          cx="100"
          cy="100"
          r="66"
          fill="none"
          stroke="rgba(150,198,188,0.09)"
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
          <path d={STAR_PATH} fill={sparkle.fill} />
        </svg>
      ))}
    </div>
  );
}
