import { cn } from '../../lib/cn'
import { Equalizer } from './Equalizer'
import { OrbitalRings } from './OrbitalRings'

/** Luz especular del disco, idéntica en las tres escalas. */
const SHEEN = 'radial-gradient(70% 80% at 32% 22%, rgba(247,244,234,0.24), transparent 62%)'

const SIZES = {
  sm: {
    width: 150,
    inset: 9,
    hz: 'text-[26px]',
    unit: 'text-label tracking-kicker',
    title: 'text-[16px]',
    meta: 'text-label',
    spin: 70,
    play: null,
    eq: null,
    restGlow: '0 0 20px rgba(15,27,46,0.5)',
    activeGlow: '0 0 40px rgba(216,185,120,0.4)',
  },
  md: {
    width: 190,
    inset: 12,
    hz: 'text-[34px]',
    unit: 'text-label tracking-kicker',
    title: 'text-[22px]',
    meta: 'text-meta',
    spin: 60,
    play: 46,
    eq: null,
    restGlow: '0 0 22px rgba(15,27,46,0.5)',
    activeGlow: '0 0 44px rgba(216,185,120,0.4)',
  },
  lg: {
    width: 380,
    inset: 22,
    hz: 'text-[clamp(44px,9vw,70px)]',
    unit: 'text-meta tracking-eyebrow',
    title: 'text-[clamp(24px,4vw,32px)]',
    meta: 'text-meta',
    spin: 110,
    play: 62,
    eq: 'lg',
    restGlow: '0 0 80px rgba(216,185,120,0.42), inset 0 0 40px rgba(15,27,46,0.4)',
    activeGlow: '0 0 90px rgba(216,185,120,0.5), inset 0 0 40px rgba(15,27,46,0.4)',
  },
}

function ringsFor(size, active) {
  if (size === 'lg') {
    return [
      { r: 98, stroke: `rgba(216,185,120,${active ? 0.75 : 0.55})`, width: 0.7 },
      { r: 86, stroke: 'rgba(185,176,214,0.35)', width: 0.6, dash: '1 7' },
    ]
  }

  return [
    {
      r: 97,
      stroke: active ? 'rgba(216,185,120,0.6)' : 'rgba(247,244,234,0.22)',
      width: size === 'sm' ? 1.2 : 1,
      dash: size === 'sm' ? '1 8' : '1 7',
    },
  ]
}

/**
 * Disco orbital de frecuencia — la pieza identitaria del producto. Tres escalas
 * (`sm` flotante, `md` de rejilla, `lg` destacado). En Biblioteca no hay rejilla de
 * tarjetas: son discos.
 */
export function FrequencyDisc({ size = 'md', hz, band, title, meta, active = false, showPlay = false, showEqualizer = false, playing = true, width, className }) {
  const spec = SIZES[size]
  const box = width ?? spec.width

  return (
    <div className={cn('mx-auto w-full', className)} style={{ maxWidth: box }}>
      <div className="relative mx-auto aspect-square w-full">
        <OrbitalRings
          size={box}
          rings={ringsFor(size, active)}
          spin={spec.spin}
          nodes={[{ angle: -90, radius: 97, color: 'var(--color-gold)', size: 5 }]}
          className="absolute inset-0 h-full w-full"
        />
        {size === 'lg' ? (
          <OrbitalRings
            size={box}
            rings={[{ r: 90, stroke: 'rgba(150,198,188,0.4)', width: 0.6, dash: '2 12' }]}
            spin={80}
            reverse
            className="absolute inset-0 h-full w-full opacity-60"
          />
        ) : null}

        <div
          className="absolute overflow-hidden rounded-full border"
          style={{
            inset: spec.inset,
            backgroundImage: band,
            borderColor: active ? 'rgba(216,185,120,0.6)' : 'var(--color-glass-brd)',
            boxShadow: active ? spec.activeGlow : spec.restGlow,
            transition: 'box-shadow .4s, border-color .4s',
          }}
        >
          <div aria-hidden="true" className="absolute inset-0" style={{ backgroundImage: SHEEN }} />
          {showEqualizer && spec.eq ? (
            <Equalizer scale={spec.eq} playing={playing} className="absolute inset-x-0 bottom-[17%]" />
          ) : null}
          <div className={cn('absolute inset-x-0 text-center', spec.play ? 'top-[36%] -translate-y-1/2' : 'top-1/2 -translate-y-1/2')}>
            <span className={cn('text-ivory block font-serif leading-none', spec.hz)}>{hz}</span>
            <span className={cn('text-fg-body block font-sans uppercase', spec.unit)}>Hz</span>
          </div>
          {showPlay && spec.play ? (
            <span
              aria-hidden="true"
              className="absolute bottom-[12%] left-1/2 flex -translate-x-1/2 items-center justify-center rounded-full border backdrop-blur-[4px]"
              style={{
                width: spec.play,
                height: spec.play,
                borderColor: active ? 'rgba(216,185,120,0.7)' : 'rgba(247,244,234,0.7)',
                background: active ? 'rgba(216,185,120,0.14)' : 'rgba(15,27,46,0.35)',
              }}
            >
              <svg width={spec.play * 0.32} height={spec.play * 0.32} viewBox="0 0 24 24" fill="currentColor" className="text-ivory translate-x-[6%]">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          ) : null}
        </div>
      </div>

      {title ? <p className={cn('mt-[10px] text-center font-serif leading-[1.08]', spec.title)}>{title}</p> : null}
      {meta ? <p className={cn('text-fg-muted tracking-ui mt-[2px] text-center font-sans', spec.meta)}>{meta}</p> : null}
    </div>
  )
}
