import { atmosphereForPathname } from '@/lib/atmosphere/destination';
import type { AtmosphereId } from '@/types/atmosphere';

/**
 * Tema con el que se pinta el cruce: el de la vista de destino si se conoce
 * (la persona lo verá al llegar) y, si no, el que ya está pintado. Función
 * pura: la elección vigente de tema entra por parámetro.
 */
export function portalThemeFor(
  destination: string | null,
  visible: AtmosphereId,
  choice: AtmosphereId | null,
): AtmosphereId {
  if (!destination) return visible;

  return atmosphereForPathname(destination, choice);
}
