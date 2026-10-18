import type { CSSProperties, ReactNode } from 'react';

import { SIZES, ringsFor, type DiscSize } from '@/config/frequency-disc';
import { Halo } from '@/components/world/halo';
import { OrbitalRings } from '@/components/world/orbital-rings';
import { cn } from '@/lib/cn';
import { floatStyle } from '@/lib/motion/float';

import { Equalizer } from '../equalizer';

import { DiscAura } from './disc-aura';
import { DiscFace } from './disc-face';
import { DiscPlayBadge } from './disc-play-badge';

export type { DiscSize } from '@/config/frequency-disc';

/** Luz especular del disco, idéntica en todas las escalas. */
const SHEEN =
  'radial-gradient(70% 80% at 32% 22%, color-mix(in srgb, var(--color-fg) 24%, transparent), transparent 62%)';

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
 * En Resonario, el destacado es el sol (un disco `lg`) y cada pista de su tarjeta
 * es un disco `md`: no hay posiciones orbitales fijas.
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
            color={`rgb(var(--halo) / ${spec.halo.alpha})`}
            blur={spec.halo.blur}
            inset={spec.halo.inset}
          />
        ) : null}
        {spec.aura ? <DiscAura aura={spec.aura} band={band} active={active} /> : null}

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
          <OrbitalRings.Node angle={-90} radius={97} color="var(--color-accent)" size={5} />
        </OrbitalRings>

        {size === 'lg' ? (
          <OrbitalRings
            size={box}
            rings={[
              {
                r: 90,
                stroke: 'color-mix(in srgb, var(--color-accent-2) 40%, transparent)',
                width: 0.6,
                dash: '2 12',
              },
            ]}
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
            {/* Sólo los tonos tienen una cifra en Hz: el resto de discos es sólo su portada. */}
            <DiscFace hz={hz} numClass={spec.hz} unitClass={spec.unit} />
          </div>

          {showPlay && spec.play ? (
            <DiscPlayBadge size={spec.play} active={active} pausable={pausable} />
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
