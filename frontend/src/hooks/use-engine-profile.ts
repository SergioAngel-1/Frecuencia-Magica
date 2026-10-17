'use client';

import { PLACE_ATMOSPHERE } from '@/config/atmospheres';
import type { VisualMode } from '@/config/realms';
import { useAtmosphere } from '@/hooks/use-atmosphere';
import { useMounted } from '@/hooks/use-mounted';
import { usePathname } from '@/i18n/navigation';
import { engineProfile, type EngineProfile } from '@/lib/atmosphere/engine-profile';
import { placeFromPathname } from '@/lib/realm-from-pathname';

/**
 * Opacidades del engine para la atmósfera activa. Antes de montar usa la del
 * lugar (lo que el servidor ya pintó), y la elección manual sólo entra después:
 * así el primer render del cliente coincide con el marcado y no hay salto.
 */
export function useEngineProfile(visualMode: VisualMode): EngineProfile {
  const mounted = useMounted();
  const place = placeFromPathname(usePathname());
  const { atmosphereId } = useAtmosphere();

  return engineProfile(mounted ? atmosphereId : PLACE_ATMOSPHERE[place], visualMode);
}
