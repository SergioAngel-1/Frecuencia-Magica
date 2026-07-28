/**
 * Formateo de precios y duraciones.
 *
 * Los precios del catálogo son enteros en dólares — no hay céntimos en el
 * modelo de datos, así que no se formatean decimales.
 */

/** `28` → `"$28"`. */
export function formatPrice(amount: number): string {
  return `$${amount}`;
}

/**
 * `1080` → `"18:00"`.
 *
 * Minutos y segundos se rellenan a dos dígitos: el catálogo contiene
 * `"09:10"` y `"07:30"`, y sin relleno la ida y vuelta con `parseDuration`
 * dejaría de ser exacta. Las duraciones de más de una hora se expresan en
 * minutos totales (`3720` → `"62:00"`), como en el prototipo.
 */
export function formatDuration(totalSeconds: number): string {
  const safeSeconds = Math.max(0, Math.round(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/** `"18:00"` → `1080`. Inverso exacto de {@link formatDuration}. */
export function parseDuration(label: string): number {
  const [minutes = '0', seconds = '0'] = label.split(':');

  return Number(minutes) * 60 + Number(seconds);
}
