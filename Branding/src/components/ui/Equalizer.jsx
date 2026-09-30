import { cn } from '../../lib/cn'

// El orden de los retardos está deliberadamente desordenado: evita que las barras
// suban en ola y las hace parecer sonido real.
const BARS = { sm: [16, 30, 22, 38, 24, 14], lg: [24, 48, 34, 62, 40, 22] }
const DELAYS = ['0s', '.2s', '.4s', '.1s', '.5s', '.3s']
const SCALE = {
  sm: { width: 3, gap: 'gap-[3px]', color: 'rgba(247,244,234,0.75)', opacity: 0.7 },
  lg: { width: 4, gap: 'gap-[5px]', color: 'rgba(247,244,234,0.85)', opacity: 0.75 },
}

/** Seis barras que laten con `fm-wave-pulse`. Decorativo: el estado real lo dice el play. */
export function Equalizer({ scale = 'sm', playing = true, className }) {
  const { width, gap, color, opacity } = SCALE[scale]

  return (
    <div aria-hidden="true" className={cn('flex items-end justify-center', gap, className)} style={{ opacity }}>
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
  )
}
