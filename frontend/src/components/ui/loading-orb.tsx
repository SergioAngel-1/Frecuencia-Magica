import { Halo } from '@/components/world/halo';
import { Isotype } from '@/components/world/isotype';
import { OrbitalRings } from '@/components/world/orbital-rings';
import { cn } from '@/lib/cn';

export type OrbTone = 'lav' | 'gold' | 'teal';

/** Acento del orbe como token de tema, para componer sus luces a distinta opacidad. */
const TONE_COLOR: Record<OrbTone, string> = {
  lav: 'var(--color-accent-3)',
  gold: 'var(--color-accent)',
  teal: 'var(--color-accent-2)',
};

/** El acento del orbe a una opacidad dada. */
const tint = (color: string, alpha: number) =>
  `color-mix(in srgb, ${color} ${Math.round(alpha * 100)}%, transparent)`;

/** Núcleo del remate: luz que nace descentrada, como una esfera iluminada de lado. */
const core = (color: string) =>
  `radial-gradient(circle at 42% 38%, ${tint('var(--color-fg)', 0.92)}, ${tint(color, 0.6)} 44%, transparent 72%)`;

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
 * La espera del sistema: una frecuencia sintonizándose.
 *
 * Mientras carga es un pequeño sistema orbital, el mismo lenguaje del disco
 * de frecuencia y del portal: el isotipo girando en el centro, una onda que
 * sale de él, un aro con un nodo que lo recorre y un segundo aro punteado que
 * gira al revés. El progreso lo dice el nodo en órbita, no un spinner. Sólo se
 * animan `transform` y `opacity`; con movimiento reducido queda la figura
 * quieta, que sigue leyéndose.
 *
 * Con `loading={false}` es sólo el orbe encendido: el remate de una
 * confirmación.
 */
export function LoadingOrb({
  size = 130,
  tone = 'lav',
  label,
  loading = true,
  className,
}: LoadingOrbProps) {
  const color = TONE_COLOR[tone];

  return (
    <div
      className={cn('flex flex-col items-center text-center', className)}
      {...(loading ? { role: 'status' } : {})}
    >
      <div className="relative" style={{ width: size, height: size }}>
        <Halo color={tint(color, 0.3)} blur={16} inset={loading ? '-14%' : '-22%'} />

        {loading ? (
          <>
            <span
              aria-hidden="true"
              className="animate-fm-ring border-fg/35 absolute inset-[31%] rounded-full border"
            />
            <OrbitalRings
              size={size}
              spin={7}
              rings={[{ r: 62, stroke: tint(color, 0.42), width: 0.8 }]}
              className="absolute inset-0"
              style={{ width: '100%', height: '100%' }}
            >
              <OrbitalRings.Node angle={-90} radius={62} color="var(--color-fg)" size={6} />
            </OrbitalRings>
            <OrbitalRings
              size={size}
              spin={11}
              direction="ccw"
              rings={[{ r: 62, stroke: tint(TONE_COLOR.gold, 0.4), width: 0.9, dash: '2 9' }]}
              className="absolute inset-[14%]"
              style={{ width: '72%', height: '72%' }}
            >
              <OrbitalRings.Node angle={140} radius={62} color="var(--color-accent)" size={5} />
            </OrbitalRings>
          </>
        ) : null}

        {loading ? (
          // El centro del sistema es el isotipo, girando: la marca sintonizándose.
          <Isotype className="absolute inset-[13%]" />
        ) : (
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-full"
            style={{
              background: core(color),
              boxShadow: `0 0 ${Math.round(size * 0.6)}px ${Math.round(size * 0.16)}px ${tint(color, 0.3)}`,
            }}
          />
        )}
      </div>

      {label ? (
        <p className="text-fg-body mt-[26px] font-serif text-[clamp(19px,2.4vw,24px)] italic">
          {label}
        </p>
      ) : null}
    </div>
  );
}
