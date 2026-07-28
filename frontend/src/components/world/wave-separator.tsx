import type { CSSProperties } from 'react';

/**
 * Separador de frecuencia a ancho completo: dos líneas punteadas que fluyen
 * hacia una forma de onda central con su punto, segmento y rombo.
 *
 * Port literal de las líneas 418–425 del prototipo.
 */
export function WaveSeparator({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1000 60"
      preserveAspectRatio="xMidYMid meet"
      className={className}
      style={{ width: '100%', height: 46, overflow: 'visible', ...style }}
    >
      {/* Línea punteada lavanda que fluye hacia el centro. */}
      <line
        x1="0"
        y1="30"
        x2="372"
        y2="30"
        stroke="rgba(185,176,214,0.35)"
        strokeDasharray="1 7"
        style={{ animation: 'fm-wave-flow 3.2s linear infinite' }}
      />
      {/* Forma de onda en teal. */}
      <path
        d="M372 30 L394 30 L408 13 L423 47 L438 7 L453 45 L468 30 L500 30"
        fill="none"
        stroke="#96C6BC"
        strokeWidth="1.7"
      />
      {/* Punto dorado en el centro. */}
      <circle cx="500" cy="30" r="3.2" fill="#D8B978" />
      {/* Segmento teal. */}
      <line x1="500" y1="30" x2="566" y2="30" stroke="#96C6BC" strokeWidth="1.4" />
      {/* Rombo teal. */}
      <path d="M604 11 L623 30 L604 49 L585 30 Z" fill="rgba(150,198,188,0.08)" stroke="#96C6BC" />
      {/* Línea punteada dorada que fluye en sentido inverso. */}
      <line
        x1="628"
        y1="30"
        x2="1000"
        y2="30"
        stroke="rgba(216,185,120,0.35)"
        strokeDasharray="1 7"
        style={{ animation: 'fm-wave-flow 3.2s linear infinite reverse' }}
      />
    </svg>
  );
}
