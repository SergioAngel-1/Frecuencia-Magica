import type { CSSProperties, ReactNode } from 'react';

import { Halo } from '@/components/world/halo';
import { OrbitalRings, type Ring } from '@/components/world/orbital-rings';
import { cn } from '@/lib/cn';
import { floatStyle } from '@/lib/motion/float';

import { Equalizer, type EqualizerScale } from './equalizer';

export type DiscSize = 'xs' | 'sm' | 'md' | 'lg';

/** Luz especular del disco, idéntica en todas las escalas. */
const SHEEN =
  'radial-gradient(70% 80% at 32% 22%, color-mix(in srgb, var(--color-fg) 24%, transparent), transparent 62%)';

type SizeSpec = {
  width: number;
  /** Distancia del borde del disco al borde del contenedor, en px. */
  inset: number;
  hz: string;
  unit: string;
  title: string;
  /** `null`: la escala no tiene sitio para la línea de meta. */
  meta: string | null;
  spin: number;
  play: number | null;
  eq: EqualizerScale | null;
  /** Halo dorado: resplandor amplio y tenue alrededor del disco. */
  halo: { inset: string; blur: number; alpha: number } | null;
  /**
   * Aura: la propia banda del audio, difuminada y respirando detrás de la
   * esfera. Cada frecuencia irradia su color en vez de recortarse contra una
   * sombra oscura. En el destacado se suma al halo dorado: el color cerca,
   * el oro lejos.
   */
  aura: { inset: string; blur: number; rest: number; active: number } | null;
  restGlow: string;
  activeGlow: string;
};

const SIZES: Record<DiscSize, SizeSpec> = {
  xs: {
    width: 92,
    inset: 6,
    hz: 'text-[20px]',
    unit: 'text-label tracking-label',
    title: 'text-body',
    meta: null,
    spin: 70,
    play: null,
    eq: null,
    halo: null,
    aura: { inset: '-10%', blur: 12, rest: 0.6, active: 0.9 },
    restGlow: '0 0 18px rgba(216,185,120,0.14), inset 0 0 14px rgba(15,27,46,0.35)',
    activeGlow: '0 0 30px rgba(216,185,120,0.42), inset 0 0 14px rgba(15,27,46,0.35)',
  },
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
    halo: null,
    aura: { inset: '-12%', blur: 14, rest: 0.6, active: 0.9 },
    restGlow: '0 0 26px rgba(216,185,120,0.16), inset 0 0 20px rgba(15,27,46,0.35)',
    activeGlow: '0 0 44px rgba(216,185,120,0.45), inset 0 0 20px rgba(15,27,46,0.35)',
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
    // El ecualizador no cabe entre la cifra y el play a esta escala: el play
    // lo tapaba y sólo asomaba una barra. Sólo el disco `lg` lo lleva.
    eq: null,
    halo: { inset: '-10%', blur: 14, alpha: 0.22 },
    aura: null,
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
    halo: { inset: '-26%', blur: 34, alpha: 0.2 },
    aura: { inset: '-9%', blur: 34, rest: 0.75, active: 1 },
    restGlow: '0 0 46px rgba(216,185,120,0.26), inset 0 0 44px rgba(15,27,46,0.42)',
    activeGlow: '0 0 64px rgba(216,185,120,0.44), inset 0 0 44px rgba(15,27,46,0.42)',
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
      width: size === 'md' ? 1 : 1.2,
      dash: size === 'md' ? '1 7' : '1 8',
    },
  ];
}

interface FrequencyDiscProps {
  size?: DiscSize;
  /** Hz del tono; `null` si la pista no es un tono y el disco no lleva cifra. */
  hz: number | null;
  /** Gradiente de fondo del disco. */
  band: string;
  /**
   * Portada del audio, pintada dentro de la esfera bajo la luz especular. La
   * foto vive en el disco: nunca en un marco propio a su alrededor.
   */
  cover?: ReactNode;
  title?: string;
  /** Línea de meta bajo el título, ya compuesta y traducida. */
  meta?: string;
  /** Marca el disco como el que suena: aros y borde viran a oro. */
  active?: boolean;
  showPlay?: boolean;
  showEqualizer?: boolean;
  /**
   * El audio suena de verdad: mueve el ecualizador y, en el disco activo,
   * cambia el play por la pausa. Un disco activo con `playing={false}` está
   * en pausa.
   */
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
 * Cubre todas las escalas con una sola implementación: mínimo (sugerencias
 * dentro de una tarjeta), pequeño flotante (Resonario, Home), medio en rejilla
 * y destacado (Resonario).
 * En Resonario **no** se usa una rejilla de tarjetas: son discos.
 */
export function FrequencyDisc({
  size = 'md',
  hz,
  band,
  cover,
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
  // El disco que suena ofrece la pausa; cualquier otro, el play.
  const pausable = active && playing;

  const float: CSSProperties = floatDuration
    ? floatStyle({ depth: 'deep', duration: floatDuration, delay: floatDelay ?? '0s' })
    : {};

  const disc = (
    <>
      <div className="relative mx-auto aspect-square w-full" style={float}>
        {spec.halo ? (
          <Halo
            color={`rgba(216,185,120,${spec.halo.alpha})`}
            blur={spec.halo.blur}
            inset={spec.halo.inset}
          />
        ) : null}
        {spec.aura ? (
          // La opacidad va en el envoltorio: `fm-breathe` anima la suya propia.
          <div
            aria-hidden="true"
            className="pointer-events-none absolute transition-opacity duration-500"
            style={{ inset: spec.aura.inset, opacity: active ? spec.aura.active : spec.aura.rest }}
          >
            <div
              className="animate-fm-breathe size-full rounded-full"
              style={{ backgroundImage: band, filter: `blur(${spec.aura.blur}px)` }}
            />
          </div>
        ) : null}

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
            borderColor: active ? 'rgb(var(--halo) / 0.6)' : 'var(--color-line)',
            boxShadow: active ? spec.activeGlow : spec.restGlow,
            transition: 'box-shadow .4s, border-color .4s',
          }}
        >
          {cover ? <div className="absolute inset-0">{cover}</div> : null}
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
            {/* Marfil fijo sobre la cara. En claro, la cifra va sobre una píldora de tinta
                (`.fm-disc-face` en globals.css); en la noche no hay píldora. */}
            {/* Sólo los tonos tienen una cifra en Hz: el resto de discos es sólo su portada. */}
            {hz !== null ? (
              <span className="fm-disc-face inline-flex flex-col items-center">
                <span
                  className={cn('fm-disc-num text-on-media block font-serif leading-none', spec.hz)}
                >
                  {hz}
                </span>
                <span
                  className={cn(
                    'fm-disc-unit text-on-media/80 block font-sans uppercase',
                    spec.unit,
                  )}
                >
                  Hz
                </span>
              </span>
            ) : null}
          </div>

          {showPlay && spec.play ? (
            <span
              aria-hidden="true"
              className="absolute bottom-[12%] left-1/2 flex -translate-x-1/2 items-center justify-center rounded-full border backdrop-blur-[4px]"
              style={{
                width: spec.play,
                height: spec.play,
                borderColor: active
                  ? 'rgb(var(--halo) / 0.7)'
                  : 'color-mix(in srgb, var(--color-fg) 70%, transparent)',
                background: active ? 'rgb(var(--halo) / 0.14)' : 'rgb(var(--scrim) / 0.35)',
              }}
            >
              <svg
                width={spec.play * 0.32}
                height={spec.play * 0.32}
                viewBox="0 0 24 24"
                fill="currentColor"
                // El triángulo se centra ópticamente; las barras de pausa ya lo están.
                className={cn('text-fg', !pausable && 'translate-x-[6%]')}
              >
                {pausable ? (
                  <>
                    <rect x="6.5" y="5" width="3.5" height="14" rx="1" />
                    <rect x="14" y="5" width="3.5" height="14" rx="1" />
                  </>
                ) : (
                  <path d="M8 5v14l11-7z" />
                )}
              </svg>
            </span>
          ) : null}
        </div>
      </div>

      {title ? (
        <p className={cn('mt-[10px] font-serif leading-[1.08]', spec.title)}>{title}</p>
      ) : null}
      {meta && spec.meta ? (
        <p className={cn('text-fg-muted tracking-ui mt-[2px] font-sans', spec.meta)}>{meta}</p>
      ) : null}
    </>
  );

  // `mx-auto`: el frame tiene ancho explícito (`box`) y, como bloque, quedaba
  // alineado a la izquierda en contenedores más anchos — el disco se veía
  // descentrado respecto a badges/títulos centrados encima (p. ej. el badge
  // "Destacado" de Resonario). En celdas de grid o slots con maxWidth lo
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
      className={cn(frame, 'text-fg cursor-pointer')}
      style={style}
    >
      {disc}
    </button>
  );
}
