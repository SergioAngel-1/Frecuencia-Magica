import type { PortalMode } from '@/config/motion';

/**
 * Reposo del cruce del portal.
 *
 * La coreografía completa sólo se reproduce la primera vez o cuando hace
 * tiempo que no se cruza; los cruces recientes abren el mismo iris a un
 * ritmo más ágil. El timestamp vive en `localStorage`, que
 * sirve igual para visitantes anónimos y para cuentas locales (no hay
 * backend: el almacén es el mismo).
 */

/** Clave de `localStorage` con el timestamp (ms) del último cruce. */
export const PORTAL_LAST_CROSS_KEY = 'fm.lastPortalCross';

/** Ventana de reposo: la coreografía vuelve tras este tiempo sin cruzar. */
export const PORTAL_COOLDOWN_MS = 24 * 60 * 60 * 1000;

/**
 * ¿Toca coreografía completa? `true` la primera vez (sin cruce previo) o
 * cuando el último cruce supera la ventana de reposo. Función pura: recibe
 * el timestamp y el reloj por parámetro para poder testearla.
 */
export function shouldPlayPortalChoreography(
  lastCross: number | null,
  now: number,
  cooldownMs: number = PORTAL_COOLDOWN_MS,
): boolean {
  if (lastCross === null) return true;

  return now - lastCross >= cooldownMs;
}

/** Timestamp del último cruce, o `null` si nunca cruzó o no hay storage. */
export function readLastPortalCross(): number | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(PORTAL_LAST_CROSS_KEY);
    if (raw === null) return null;

    const value = Number(raw);
    return Number.isFinite(value) ? value : null;
  } catch {
    // Sin storage (modo privado, políticas): se trata como primera vez.
    return null;
  }
}

/** Registra el cruce actual. */
export function markPortalCrossed(now: number = Date.now()): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(PORTAL_LAST_CROSS_KEY, String(now));
  } catch {
    // Sin storage: la coreografía se mostrará siempre; no es un error.
  }
}

/**
 * Coreografía de un cruce. El iris cubre la pantalla siempre; sólo cambia su
 * ritmo según sea la primera vez o un cruce reciente. El movimiento reducido
 * lo sustituye por el fundido.
 */
export function portalModeFor(reducedMotion: boolean, fullChoreography: boolean): PortalMode {
  if (reducedMotion) return 'quick';
  return fullChoreography ? 'full' : 'brief';
}
