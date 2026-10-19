'use client';

import { useCallback } from 'react';

import { PLACE_ATMOSPHERE } from '@/config/atmospheres';
import type { ArrivalKey } from '@/config/arrivals';
import { useAtmosphere } from '@/hooks/use-atmosphere';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { usePathname } from '@/i18n/navigation';
import { planShift, type ShiftRequest, type ShiftSource } from '@/lib/atmosphere/shift';
import { placeFromPathname } from '@/lib/realm-from-pathname';
import {
  applyChoice,
  useAtmosphereShiftStore,
  type ShiftOrigin,
} from '@/stores/atmosphere-shift-store';
import { usePortalStore } from '@/stores/portal-store';
import type { AtmosphereId } from '@/types/atmosphere';

export type ShiftOptions = {
  source?: ShiftSource;
  /** El estado del ánimo que lo origina: se nombra en el cruce. */
  feeling?: ArrivalKey | null;
  /** De dónde nace la onda; sin valor, del centro. */
  origin?: ShiftOrigin | null;
  /** Se ejecuta cuando el tema queda aplicado; si la persona rechaza el cambio, nunca. */
  onApplied?: () => void;
};

/**
 * Cambiar de atmósfera, con su ceremonia. Toda escritura de la elección de tema pasa por aquí
 * (el selector, los estados del ánimo, el resultado de Descúbrete): la decisión de si se
 * confirma o se aplica sin más vive en `planShift`; este hook sólo la alimenta con el tema
 * visible, el lugar y los cruces en marcha, y ejecuta el plan.
 *
 * `choice: null` es «según cómo te sientes»: se borra la elección y cada lugar vuelve a proponer
 * el suyo.
 */
export function useAtmosphereShift() {
  const pathname = usePathname();
  const { atmosphereId } = useAtmosphere();
  const reduced = useReducedMotionSafe();
  const place = placeFromPathname(pathname);

  return useCallback(
    (
      choice: AtmosphereId | null,
      { source = 'manual', feeling = null, origin = null, onApplied }: ShiftOptions = {},
    ) => {
      const request: ShiftRequest = {
        choice,
        resolved: choice ?? PLACE_ATMOSPHERE[place],
        source,
        feeling,
        ...(onApplied ? { onApplied } : {}),
      };
      const busy =
        usePortalStore.getState().phase !== 'idle' ||
        useAtmosphereShiftStore.getState().phase !== 'idle';
      const plan = planShift(request, {
        current: atmosphereId,
        busy,
        atPortal: place === 'portal',
      });
      const shift = useAtmosphereShiftStore.getState();

      if (plan === 'apply') applyChoice(request);
      else if (plan === 'confirm') shift.ask(request, origin);
      else shift.cross(request, { mode: reduced ? 'quick' : 'full', origin });
    },
    [atmosphereId, place, reduced],
  );
}
