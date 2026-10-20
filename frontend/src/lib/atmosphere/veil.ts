/** Origen de la onda del velo, en fracción del viewport (0–1). */
export type VeilOrigin = { x: number; y: number } | null;

export type VeilViewport = { width: number; height: number };

/** La onda mide 100vmax de diámetro: su radio base es 50vmax. */
const WAVE_RADIUS_RATIO = 0.5;
/**
 * Más allá de la esquina más lejana: el aro del borde (`.fm-shift-wave::after`) arranca en el
 * 92 % del radio, así que 1 / 0.92 lo deja fuera de la pantalla al terminar (con un pelín más).
 */
const WAVE_SAFETY = 1.1;

/**
 * Escala final de la onda del velo: la que lleva su radio base (50vmax) hasta la esquina más
 * lejana desde el origen. Con la escala 3 fija, cualquier viewport quedaba cubierto mucho antes
 * de terminar la animación y el resto de `cover` era pantalla llena y vacía; ajustarla al
 * viewport real reparte la cobertura a lo largo de todo `cover`.
 */
export function shiftWaveScale(origin: VeilOrigin, viewport: VeilViewport): number {
  const width = Math.max(1, viewport.width);
  const height = Math.max(1, viewport.height);
  const x = Math.min(1, Math.max(0, origin?.x ?? 0.5)) * width;
  const y = Math.min(1, Math.max(0, origin?.y ?? 0.5)) * height;
  const baseRadius = WAVE_RADIUS_RATIO * Math.max(width, height);

  const farthest = Math.max(
    Math.hypot(x, y),
    Math.hypot(width - x, y),
    Math.hypot(x, height - y),
    Math.hypot(width - x, height - y),
  );

  return (farthest / baseRadius) * WAVE_SAFETY;
}
