import type { ArrivalKey } from '@/config/arrivals';
import { activeFeeling } from '@/lib/atmosphere/shift';
import type { AtmosphereId } from '@/types/atmosphere';
import { MOOD_IDS, type MoodId } from '@/types/mood';

/** `mood:<id>` → `<id>`; cualquier otra entrada (una intención) no es un estado. */
export function selectedMood(key: ArrivalKey | null): MoodId | null {
  if (!key?.startsWith('mood:')) return null;
  const id = key.slice('mood:'.length);

  return (MOOD_IDS as readonly string[]).includes(id) ? (id as MoodId) : null;
}

/**
 * La emoción activa: la que guarda la elección de tema mientras ese tema siga
 * siendo el que la emoción propone. Es la única lectura que comparten las
 * píldoras: en automático, con una tarjeta de tema o tras «otra opción» no hay
 * emoción marcada, aunque quede una guardada de antes.
 */
export function activeMood(choice: AtmosphereId | null, feeling: ArrivalKey | null): MoodId | null {
  return selectedMood(activeFeeling(choice, feeling));
}
