'use client';

import { useTranslations } from 'next-intl';

import { usePathname } from '@/i18n/navigation';
import { ATMOSPHERES } from '@/config/atmospheres';
import { useAtmosphere } from '@/hooks/use-atmosphere';
import { useMounted } from '@/hooks/use-mounted';
import { resolveAtmosphere } from '@/lib/atmosphere/resolve';
import { atmospherePainting, scrimToneFor } from '@/lib/atmosphere/painting';
import { placeFromPathname } from '@/lib/realm-from-pathname';
import type { EditorialMedia, EditorialScrimTone } from '@/types/editorial-media';

export type AtmospherePaintingState = {
  /** Paisaje de la atmósfera activa; `null` en la noche. */
  painting: EditorialMedia | null;
  scrimTone: EditorialScrimTone;
};

/**
 * Paisaje de la atmósfera efectiva para una vista de escucha. Antes de montar
 * no conoce la elección manual (vive en `sessionStorage`) y devuelve la del
 * sitio: así el servidor y la hidratación pintan lo mismo.
 */
export function useAtmospherePainting(): AtmospherePaintingState {
  const pathname = usePathname();
  const mounted = useMounted();
  const t = useTranslations('atmospheres');
  const { atmosphereId } = useAtmosphere();
  const id = mounted ? atmosphereId : resolveAtmosphere(placeFromPathname(pathname), null);
  const painting = atmospherePainting(
    id,
    id === 'night' ? '' : t(`${id}.photoAlt` as 'dusk.photoAlt'),
  );

  return {
    painting,
    scrimTone: scrimToneFor(ATMOSPHERES[id].scheme),
  };
}
