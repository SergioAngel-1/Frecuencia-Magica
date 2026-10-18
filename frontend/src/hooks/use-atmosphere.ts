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
 * Tema efectivo: la elección de la persona, o el que sugiere el lugar en el que
 * está. La decisión vive en `resolveAtmosphere`; el hook sólo la alimenta con la
 * ruta y el store.
 *
 * Ojo con la hidratación: `choice` se rehidrata de `localStorage` de forma
 * síncrona en el cliente, así que en el primer render del cliente ya puede tener
 * valor y el servidor no lo tiene. Un consumidor cuyo marcado depende de él debe
 * esperar al montaje (`useMounted`) antes de usar el resultado; el provider no
 * pinta nada que dependa de él y por eso no lo necesita.
 */
export function useAtmosphere(): ActiveAtmosphere {
  const pathname = usePathname();
  const choice = useAtmosphereStore((state) => state.choice);
  const atmosphereId = resolveAtmosphere(placeFromPathname(pathname), choice);

  return { atmosphereId, scheme: ATMOSPHERES[atmosphereId].scheme };
}
