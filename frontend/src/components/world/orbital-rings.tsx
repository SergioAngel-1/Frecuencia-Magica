import type { CSSProperties, ReactNode } from 'react';

/** Un aro concéntrico. `r` en unidades del propio sistema (no píxeles). */
export type Ring = {
  r: number;
  stroke: string;
  width?: number;
  dash?: string;
};

type OrbitalRingsProps = {
  /** Lado renderizado en píxeles. */
  size: number;
  rings: readonly Ring[];
  /** Duración de una vuelta, en segundos. */
  spin: number;
  /** Sentido de giro. */
  direction?: 'cw' | 'ccw';
  className?: string;
  style?: CSSProperties;
  /** Nodos y decoración extra, en el mismo espacio centrado en el origen. */
  children?: ReactNode;
};

type NodeProps = {
  /** Ángulo en grados, medido desde el eje X. */
  angle: number;
  /** Radio de la órbita, en unidades del sistema. */
  radius: number;
  color: string;
  /** Diámetro del nodo, en unidades del sistema. */
  size?: number;
};

/** Punto orbital sobre un aro. */
function OrbitalNode({ angle, radius, color, size = 6 }: NodeProps) {
  const rad = (angle * Math.PI) / 180;
  return (
    <circle
      cx={radius * Math.cos(rad)}
      cy={radius * Math.sin(rad)}
      r={size / 2}
      fill={color}
      style={{ filter: `drop-shadow(0 0 4px ${color})` }}
    />
  );
}

/**
 * Aros concéntricos que giran. El `viewBox` se ajusta al radio mayor y se
 * centra en el origen, de modo que cualquier escala del prototipo (aros del
 * portal, del hero, de los discos o de las cards) se exprese sólo con props.
 *
 * El giro se aplica al propio SVG con `fm-spin`/`fm-spin-r`.
 */
export function OrbitalRings({
  size,
  rings,
  spin,
  direction = 'cw',
  className,
  style,
  children,
}: OrbitalRingsProps) {
  const maxStroke = Math.max(...rings.map((ring) => ring.width ?? 1));
  const maxR = Math.max(...rings.map((ring) => ring.r)) + maxStroke;
  const vb = maxR * 2;

  return (
    <svg
      aria-hidden="true"
      viewBox={`${-maxR} ${-maxR} ${vb} ${vb}`}
      className={className}
      style={{
        width: size,
        height: size,
        animation: `${direction === 'cw' ? 'fm-spin' : 'fm-spin-r'} ${spin}s linear infinite`,
        ...style,
      }}
    >
      {rings.map((ring, i) => (
        <circle
          key={i}
          cx="0"
          cy="0"
          r={ring.r}
          fill="none"
          stroke={ring.stroke}
          strokeWidth={ring.width ?? 1}
          strokeDasharray={ring.dash}
        />
      ))}
      {children}
    </svg>
  );
}

OrbitalRings.Node = OrbitalNode;
