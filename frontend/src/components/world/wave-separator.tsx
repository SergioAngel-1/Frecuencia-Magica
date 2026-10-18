import type { CSSProperties } from 'react';

/**
 * Separador de frecuencia a ancho completo: dos líneas punteadas que fluyen
 * hacia una forma de onda central con su punto, segmento y rombo.
 *
 * Port literal de las líneas 418–425 del prototipo.
 *
 * El flujo anima `stroke-dashoffset`, que el compositor no sabe mover: cada
 * frame pasa por estilo y pintura en el hilo principal. `content-visibility`
 * lo deja en suspenso mientras el separador está fuera de pantalla, que es
 * casi siempre (vive al final de una sección).
 */
export function WaveSeparator({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 46px', ...style }}
    >
      <svg
        viewBox="0 0 1000 60"
        preserveAspectRatio="xMidYMid meet"
        style={{ display: 'block', width: '100%', height: 46 }}
      >
        {/* Línea punteada lavanda que fluye hacia el centro. */}
        <line
          x1="0"
          y1="30"
          x2="372"
          y2="30"
          strokeDasharray="1 7"
          style={{
            animation: 'fm-wave-flow 3.2s linear infinite',
            stroke: 'color-mix(in srgb, var(--color-accent-3) 35%, transparent)',
          }}
        />
        {/* Forma de onda en teal. */}
        <path
          d="M372 30 L394 30 L408 13 L423 47 L438 7 L453 45 L468 30 L500 30"
          fill="none"
          strokeWidth="1.7"
          style={{ stroke: 'var(--color-accent-2)' }}
        />
        {/* Punto dorado en el centro. */}
        <circle cx="500" cy="30" r="3.2" style={{ fill: 'var(--color-accent)' }} />
        {/* Segmento teal. */}
        <line
          x1="500"
          y1="30"
          x2="566"
          y2="30"
          strokeWidth="1.4"
          style={{ stroke: 'var(--color-accent-2)' }}
        />
        {/* Rombo teal. */}
        <path
          d="M604 11 L623 30 L604 49 L585 30 Z"
          style={{
            fill: 'color-mix(in srgb, var(--color-accent-2) 8%, transparent)',
            stroke: 'var(--color-accent-2)',
          }}
        />
        {/* Línea punteada dorada que fluye en sentido inverso. */}
        <line
          x1="628"
          y1="30"
          x2="1000"
          y2="30"
          strokeDasharray="1 7"
          style={{
            animation: 'fm-wave-flow 3.2s linear infinite reverse',
            stroke: 'rgb(var(--halo) / 0.35)',
          }}
        />
      </svg>
    </div>
  );
}
