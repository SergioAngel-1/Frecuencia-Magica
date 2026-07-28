import type { CSSProperties } from 'react';

/**
 * Resplandor radial difuminado que respira. Envuelve discos, orbes y logos.
 * Decorativo: se posiciona con `inset` negativo dentro de un contenedor relativo.
 */
export function Halo({
  color,
  blur = 12,
  inset = '-10%',
  className,
  style,
}: {
  color: string;
  blur?: number;
  inset?: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        position: 'absolute',
        inset,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${color}, transparent 66%)`,
        filter: `blur(${blur}px)`,
        animation: 'fm-breathe 7s ease-in-out infinite',
        pointerEvents: 'none',
        ...style,
      }}
    />
  );
}
