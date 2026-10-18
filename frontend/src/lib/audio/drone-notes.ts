import { ATMOSPHERES, PLACE_ATMOSPHERE } from '@/config/atmospheres';
import { REALMS } from '@/config/realms';
import type { AtmosphereId } from '@/types/atmosphere';
import type { RealmId } from '@/types/realm';

export const DEFAULT_NOTE = 110;

const NOTE_BY_REALM = new Map<RealmId, number>(REALMS.map((realm) => [realm.id, realm.baseNote]));

/** Nota base del drone para un realm. Un realm desconocido cae en 110 Hz. */
export function baseNoteForRealm(realmId: RealmId): number {
  return NOTE_BY_REALM.get(realmId) ?? DEFAULT_NOTE;
}

/**
 * Nota del drone para el tema efectivo de un realm. Si el tema es el que el realm
 * sugiere, manda la nota del realm, la de siempre; si la persona eligió otro,
 * suena la nota de ese tema.
 */
export function baseNoteFor(atmosphereId: AtmosphereId, realmId: RealmId): number {
  if (atmosphereId === PLACE_ATMOSPHERE[realmId]) return baseNoteForRealm(realmId);

  return ATMOSPHERES[atmosphereId].droneNote;
}

/**
 * Las tres voces del acorde a partir de la nota base:
 * fundamental, la misma desafinada `×1.005` (batido lento) y su quinta (`×1.5`).
 */
export function voiceFrequencies(baseNote: number): [number, number, number] {
  return [baseNote, baseNote * 1.005, baseNote * 1.5];
}
