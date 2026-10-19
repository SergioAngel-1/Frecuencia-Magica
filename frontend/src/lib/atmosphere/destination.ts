import { resolveAtmosphere } from '@/lib/atmosphere/resolve';
import { placeFromPathname } from '@/lib/realm-from-pathname';
import type { AtmosphereId } from '@/types/atmosphere';

/**
 * Tema que tendrá una vista de llegada. Función pura: durante la espera el
 * `pathname` sigue siendo el de origen, así que el loader resuelve el tema con
 * la ruta de destino y la elección vigente, no con la que está pintada.
 */
export function atmosphereForPathname(pathname: string, choice: AtmosphereId | null): AtmosphereId {
  return resolveAtmosphere(placeFromPathname(pathname), choice);
}
