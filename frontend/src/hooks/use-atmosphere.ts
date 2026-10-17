'use client';

import { ATMOSPHERES } from '@/config/atmospheres';
import { usePathname } from '@/i18n/navigation';
import { resolveAtmosphere } from '@/lib/atmosphere/resolve';
import { placeFromPathname } from '@/lib/realm-from-pathname';
import { useAtmosphereStore } from '@/stores/atmosphere-store';
import type { AtmosphereId, AtmosphereScheme } from '@/types/atmosphere';

export type ActiveAtmosphere = {
  atmosphereId: AtmosphereId;
  scheme: AtmosphereScheme;
};

/**
 * Atmósfera efectiva: la del sitio en el que está la persona, o su elección
 * manual si el sitio es de escucha. La decisión vive en `resolveAtmosphere`; el
 * hook sólo la alimenta con la ruta y el store.
 */
export function useAtmosphere(): ActiveAtmosphere {
  const pathname = usePathname();
  const manual = useAtmosphereStore((state) => state.manual);
  const atmosphereId = resolveAtmosphere(placeFromPathname(pathname), manual);

  return { atmosphereId, scheme: ATMOSPHERES[atmosphereId].scheme };
}
