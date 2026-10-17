import { MOOD_IDS, type MoodId } from '@/types/mood';

/**
 * Versión del formato guardado del diario. La 0 (sin `version`) guardaba el
 * ánimo como índice de cinco estados; la 1 lo guarda como id estable.
 */
export const JOURNAL_STORE_VERSION = 1;

/** Orden en que la v0 numeraba sus estados. No se cambia: es el de lo ya guardado. */
const LEGACY_MOOD_IDS: readonly MoodId[] = ['calm', 'joy', 'nostalgia', 'tiredness', 'gratitude'];

export type StoredEntry = {
  id: string;
  /** `null` si el estado guardado no se reconoce: la entrada se ve con una etiqueta neutra. */
  mood: MoodId | null;
  text: string;
  createdAt: string;
};

export type StoredJournal = {
  entries: StoredEntry[];
  draft: { mood: MoodId | null; text: string };
};

const EMPTY_DRAFT: StoredJournal['draft'] = { mood: null, text: '' };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isMoodId(value: unknown): value is MoodId {
  return typeof value === 'string' && (MOOD_IDS as readonly string[]).includes(value);
}

/**
 * Ánimo guardado → id. En la v0 es un índice; cualquier otra cosa (fuera de
 * rango, negativo, decimal, no numérico o un id desconocido) queda en `null`.
 * Nunca lanza: lo que no entiende se muestra con etiqueta neutra.
 */
export function moodFromStored(value: unknown, fromVersion: number): MoodId | null {
  if (fromVersion < 1) {
    if (typeof value !== 'number' || !Number.isInteger(value)) return null;
    return LEGACY_MOOD_IDS[value] ?? null;
  }

  return isMoodId(value) ? value : null;
}

function toEntry(value: unknown, fromVersion: number): StoredEntry | null {
  if (!isRecord(value)) return null;
  const { id, mood, text, createdAt } = value;
  if (typeof id !== 'string' || typeof text !== 'string' || typeof createdAt !== 'string') {
    return null;
  }

  return { id, mood: moodFromStored(mood, fromVersion), text, createdAt };
}

/**
 * Migra lo guardado del diario a la versión actual. Función pura: lo que llega
 * del almacenamiento puede venir corrupto, así que todo se valida. Las entradas
 * válidas sobreviven siempre; una entrada sin id, texto o fecha se descarta.
 */
export function migrateJournal(persisted: unknown, fromVersion: number): StoredJournal {
  const source = isRecord(persisted) ? persisted : {};
  const entries = Array.isArray(source.entries)
    ? source.entries.flatMap((entry) => {
        const migrated = toEntry(entry, fromVersion);
        return migrated ? [migrated] : [];
      })
    : [];

  const draft = isRecord(source.draft)
    ? {
        mood: moodFromStored(source.draft.mood, fromVersion),
        text: typeof source.draft.text === 'string' ? source.draft.text : '',
      }
    : { ...EMPTY_DRAFT };

  return { entries, draft };
}
