'use client';

import { themeCeremonyActive } from '@/lib/atmosphere/ceremony';
import { useAtmosphereShiftStore } from '@/stores/atmosphere-shift-store';
import { usePortalStore } from '@/stores/portal-store';

/** ¿Hay un velo de atmósfera o un cruce de portal cubriendo el cambio de tema? */
export function useThemeCeremony(): boolean {
  const portal = usePortalStore((state) => state.phase);
  const shift = useAtmosphereShiftStore((state) => state.phase);

  return themeCeremonyActive({ portal, shift });
}

/** La misma respuesta desde un callback o efecto, sin suscribirse a los stores. */
export function themeCeremonyActiveNow(): boolean {
  return themeCeremonyActive({
    portal: usePortalStore.getState().phase,
    shift: useAtmosphereShiftStore.getState().phase,
  });
}
