import { parseDuration } from '@/lib/format';
import type { Audio, AudioSource } from '@/types/content';

/** La pista tal como la reproduce el motor: una fuente y su duración de sesión. */
export type EngineTrack = {
  id: string;
  source: NonNullable<AudioSource>;
  durationSeconds: number;
};

/** La pista del catálogo como pista del motor; `null` si aún no es reproducible. */
export function toEngineTrack(audio: Audio): EngineTrack | null {
  if (audio.availability !== 'ready' || audio.source === null || audio.duration === null) {
    return null;
  }

  return {
    id: audio.id,
    source: audio.source,
    durationSeconds: parseDuration(audio.duration),
  };
}
