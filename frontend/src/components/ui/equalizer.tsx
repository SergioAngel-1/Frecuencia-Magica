import { cn } from '@/lib/cn';

export type EqualizerScale = 'sm' | 'lg';

/**
 * Alturas y retardos exactos del prototipo. El orden de los retardos
 * (`0, .2, .4, .1, .5, .3`) está deliberadamente desordenado: es lo que
 * evita que las barras suban en ola y las hace parecer sonido real.
 */
const BARS: Record<EqualizerScale, readonly number[]> = {
  sm: [16, 30, 22, 38, 24, 14],
  lg: [24, 48, 34, 62, 40, 22],
};

const DELAYS = ['0s', '.2s', '.4s', '.1s', '.5s', '.3s'] as const;

const SCALE = {
  sm: { width: 3, gap: 'gap-[3px]', color: 'rgba(247,244,234,0.75)', opacity: 0.7 },
  lg: { width: 4, gap: 'gap-[5px]', color: 'rgba(247,244,234,0.85)', opacity: 0.75 },
} as const;

interface EqualizerProps {
  scale?: EqualizerScale;
  /** `false` congela las barras en su altura base en lugar de ocultarlas. */
  playing?: boolean;
  className?: string;
}

/**
 * Seis barras que laten con `fm-wave-pulse`. Decorativo: el estado real de
 * reproducción lo comunica el botón de play y el texto del reproductor, no
 * esta animación.
 */
export function Equalizer({ scale = 'sm', playing = true, className }: EqualizerProps) {
  const { width, gap, color, opacity } = SCALE[scale];

  return (
    <div
      aria-hidden="true"
      className={cn('flex items-end justify-center', gap, className)}
      style={{ opacity }}
    >
      {BARS[scale].map((height, i) => (
        <span
          key={i}
          className="rounded-[2px]"
          style={{
            width,
            height,
            background: color,
            transformOrigin: 'bottom',
            animation: 'fm-wave-pulse 1.6s ease-in-out infinite',
            animationDelay: DELAYS[i],
            animationPlayState: playing ? 'running' : 'paused',
          }}
        />
      ))}
    </div>
  );
}
