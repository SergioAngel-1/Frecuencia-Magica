import type { CSSProperties } from 'react';

import { Halo } from '@/components/world/halo';
import { OrbitalRings, type Ring } from '@/components/world/orbital-rings';
import { cn } from '@/lib/cn';

import { Equalizer, type EqualizerScale } from './equalizer';

export type DiscSize = 'sm' | 'md' | 'lg';

/** Luz especular del disco, idéntica en las tres escalas. */
const SHEEN = 'radial-gradient(70% 80% at 32% 22%, rgba(247,244,234,0.24), transparent 62%)';

type SizeSpec = {
  width: number;
  /** Distancia del borde del disco al borde del contenedor, en px. */
  inset: number;
  hz: string;
  unit: string;
  title: string;
  meta: string;
  spin: number;
  play: number | null;
  eq: EqualizerScale | null;
  halo: string | null;
  restGlow: string;
  activeGlow: string;
};

const SIZES: Record<DiscSize, SizeSpec> = {
  sm: {
    width: 150,
    inset: 9,
    hz: 'text-[26px]',
    unit: 'text-[8px] tracking-[.26em]',
    title: 'text-[16px]',
    meta: 'text-[10px]',
    spin: 70,
    play: null,
    eq: null,
    halo: null,
    restGlow: '0 0 20px rgba(15,27,46,0.5)',
    activeGlow: '0 0 40px rgba(216,185,120,0.4)',
  },
  md: {
    width: 190,
    inset: 12,
    hz: 'text-[34px]',
    unit: 'text-[10px] tracking-[.28em]',
    title: 'text-[22px]',
    meta: 'text-[12px]',
    spin: 60,
    play: 46,
    eq: 'sm',
    halo: '-10%',
    restGlow: '0 0 22px rgba(15,27,46,0.5)',
    activeGlow: '0 0 44px rgba(216,185,120,0.4)',
  },
  lg: {
    width: 380,
    inset: 22,
    hz: 'text-[clamp(44px,9vw,70px)]',
    unit: 'text-[12px] tracking-[.36em]',
    title: 'text-[clamp(24px,4vw,32px)]',
    meta: 'text-[13px]',
    spin: 110,
    play: 62,
    eq: 'lg',
    halo: '-12%',
    restGlow: '0 0 80px rgba(216,185,120,0.42), inset 0 0 40px rgba(15,27,46,0.4)',
    activeGlow: '0 0 90px rgba(216,185,120,0.5), inset 0 0 40px rgba(15,27,46,0.4)',
  },
};

/** Aros exteriores por escala. El destacado lleva dos capas contrarrotadas. */
function ringsFor(size: DiscSize, active: boolean): readonly Ring[] {
  const dim = active ? 0.6 : 0.22;

  if (size === 'lg') {
    return [
      { r: 98, stroke: `rgba(216,185,120,${active ? 0.75 : 0.55})`, width: 0.7 },
      { r: 86, stroke: 'rgba(185,176,214,0.35)', width: 0.6, dash: '1 7' },
    ];
  }

  return [
    {
      r: 97,
      stroke: active ? `rgba(216,185,120,${dim})` : 'rgba(247,244,234,0.22)',
      width: size === 'sm' ? 1.2 : 1,
      dash: size === 'sm' ? '1 8' : '1 7',
    },
  ];
}

interface FrequencyDiscProps {
  size?: DiscSize;
  hz: number;
  /** Gradiente de fondo del disco. */
  band: string;
  title?: string;
  /** Línea de meta bajo el título, ya compuesta y traducida. */
  meta?: string;
  /** Marca el disco como el que suena: aros y borde viran a oro. */
  active?: boolean;
  showPlay?: boolean;
  showEqualizer?: boolean;
  playing?: boolean;
  /** Ancho en px. Por defecto, el de la escala. */
  width?: number;
  /** Duración del flotado, p. ej. `'7s'`. Sin valor, el disco no flota. */
  floatDuration?: string;
  floatDelay?: string;
  /** Etiqueta accesible completa. Obligatoria si hay `onClick`. */
  ariaLabel?: string;
  onClick?: () => void;
  className?: string;
}

/**
 * Disco orbital de frecuencia — la pieza identitaria del producto.
 *
 * Cubre las tres escalas del prototipo con una sola implementación: pequeño
 * flotante (Biblioteca), medio en rejilla (Home) y destacado (Biblioteca).
 * En Biblioteca **no** se usa una rejilla de tarjetas: son discos.
 */
export function FrequencyDisc({
  size = 'md',
  hz,
  band,
  title,
  meta,
  active = false,
  showPlay = false,
  showEqualizer = false,
  playing = true,
  width,
  floatDuration,
  floatDelay,
  ariaLabel,
  onClick,
  className,
}: FrequencyDiscProps) {
  const spec = SIZES[size];
  const box = width ?? spec.width;

  const floatStyle: CSSProperties = floatDuration
    ? { animation: `fm-float ${floatDuration} ease-in-out infinite`, animationDelay: floatDelay }
    : {};

  const disc = (
    <>
      <div className="relative mx-auto aspect-square w-full" style={floatStyle}>
        {spec.halo ? <Halo color="rgba(216,185,120,0.22)" blur={14} inset={spec.halo} /> : null}

        {/* Los aros se dimensionan al 100% del contenedor, no a `box`: en
            pantallas estrechas el disco se clampa con `max-width` y unos aros
            fijos en píxeles se saldrían del círculo. */}
        <OrbitalRings
          size={box}
          rings={ringsFor(size, active)}
          spin={spec.spin}
          className="absolute inset-0"
          style={{ width: '100%', height: '100%', opacity: active ? 1 : 0.7 }}
        >
          <OrbitalRings.Node angle={-90} radius={97} color="var(--color-gold)" size={5} />
        </OrbitalRings>

        {size === 'lg' ? (
          <OrbitalRings
            size={box}
            rings={[{ r: 90, stroke: 'rgba(150,198,188,0.4)', width: 0.6, dash: '2 12' }]}
            spin={80}
            direction="ccw"
            className="absolute inset-0"
            style={{ width: '100%', height: '100%', opacity: 0.6 }}
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
            <Equalizer
              scale={spec.eq}
              playing={playing}
              className="absolute inset-x-0 bottom-[17%]"
            />
          ) : null}

          <div
            className={cn(
              'absolute inset-x-0 text-center',
              spec.play ? 'top-[36%] -translate-y-1/2' : 'top-1/2 -translate-y-1/2',
            )}
          >
            <span className={cn('text-ivory block font-serif leading-none', spec.hz)}>{hz}</span>
            <span className={cn('text-ivory/75 block font-sans uppercase', spec.unit)}>Hz</span>
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
              <svg
                width={spec.play * 0.32}
                height={spec.play * 0.32}
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-ivory translate-x-[6%]"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          ) : null}
        </div>
      </div>

      {title ? (
        <p className={cn('mt-[10px] font-serif leading-[1.08]', spec.title)}>{title}</p>
      ) : null}
      {meta ? (
        <p className={cn('text-ivory/60 mt-[2px] font-sans tracking-[.08em]', spec.meta)}>{meta}</p>
      ) : null}
    </>
  );

  // `mx-auto`: el frame tiene ancho explícito (`box`) y, como bloque, quedaba
  // alineado a la izquierda en contenedores más anchos — el disco se veía
  // descentrado respecto a badges/títulos centrados encima (p. ej. el badge
  // "Destacado" de Biblioteca). En celdas de grid o slots con maxWidth lo
  // centra igual sin alterar la constelación.
  const frame = cn('mx-auto block text-center', className);
  const style: CSSProperties = { width: box, maxWidth: '100%' };

  if (!onClick) {
    return (
      <div className={frame} style={style}>
        {disc}
      </div>
    );
  }

  return (
    <button
      type="button"
      data-magnetic
      aria-label={ariaLabel}
      onClick={onClick}
      className={cn(frame, 'text-ivory cursor-pointer')}
      style={style}
    >
      {disc}
    </button>
  );
}
