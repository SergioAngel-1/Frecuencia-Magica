import type { Audio } from '@/types/content';

/**
 * Frecuencias afines a una dada: primero las que comparten más intenciones
 * con ella; a igualdad, el orden del catálogo. Nunca incluye la propia.
 */
export function suggestAudios(audios: readonly Audio[], currentId: string, count: number): Audio[] {
  const current = audios.find((audio) => audio.id === currentId);
  const intents = new Set(current?.intents ?? []);
  const affinity = (audio: Audio) => audio.intents.filter((intent) => intents.has(intent)).length;

  return audios
    .filter((audio) => audio.id !== currentId)
    .map((audio, index) => ({ audio, index, score: affinity(audio) }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, Math.max(0, count))
    .map((entry) => entry.audio);
}
