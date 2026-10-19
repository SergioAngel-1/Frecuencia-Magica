'use client';

import { getAudio } from '@/data/audios';
import { usePathname } from '@/i18n/navigation';
import { listeningAtmosphere } from '@/lib/atmosphere/listening';
import { placeFromPathname } from '@/lib/realm-from-pathname';
import { useIsPlayerSounding, usePlayerStore } from '@/stores/player-store';
import type { AtmosphereId } from '@/types/atmosphere';

/**
 * Tema que propone la pista abierta en el reproductor, o `null` si la escucha no
 * manda (silencio, sin tipo de pista o fuera de `LISTENING_PLACES`). Sólo es una
 * propuesta: `resolveAtmosphere` la descarta cuando hay una elección.
 *
 * Antes de hidratar el reproductor está vacío (`audioId: null`), así que el
 * servidor y el primer render del cliente coinciden. El selector devuelve el
 * tema final y no `elapsed`: sólo se re-renderiza al cambiar la ruta, la pista
 * o si suena.
 */
export function useListeningAtmosphere(): AtmosphereId | null {
  const place = placeFromPathname(usePathname());
  const sounding = useIsPlayerSounding();

  return usePlayerStore((state) => {
    const kind = state.audioId === null ? null : (getAudio(state.audioId)?.kind ?? null);

    return listeningAtmosphere(place, kind, sounding);
  });
}
