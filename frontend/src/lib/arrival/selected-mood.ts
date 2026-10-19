import type { ArrivalKey } from '@/config/arrivals';
import { MOOD_IDS, type MoodId } from '@/types/mood';

/** `mood:<id>` → `<id>`; cualquier otra entrada (una intención) no es un estado. */
export function selectedMood(key: ArrivalKey | null): MoodId | null {
  if (!key?.startsWith('mood:')) return null;
  const id = key.slice('mood:'.length);

  return (MOOD_IDS as readonly string[]).includes(id) ? (id as MoodId) : null;
}
