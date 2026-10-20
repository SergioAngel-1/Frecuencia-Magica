'use client';

import { useMounted } from '@/hooks/use-mounted';
import { activeMood } from '@/lib/arrival/selected-mood';
import { useAtmosphereStore } from '@/stores/atmosphere-store';
import type { MoodId } from '@/types/mood';

/**
 * La emoción que de verdad está activa (la que aplicó el store de tema), no la
 * última que se tocó en una vista. Antes de montar devuelve `null`: la elección
 * se rehidrata de `localStorage` y el servidor no la conoce.
 */
export function useActiveMood(): MoodId | null {
  const mounted = useMounted();
  const choice = useAtmosphereStore((state) => state.choice);
  const feeling = useAtmosphereStore((state) => state.feeling);

  return mounted ? activeMood(choice, feeling) : null;
}
