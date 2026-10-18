/**
 * Estados de ánimo del check-in («¿Cómo llegas hoy?»). Son ids estables: el
 * diario los guarda así y el registro de llegadas los indexa por ellos. El orden
 * es el de la pantalla.
 */
export const MOOD_IDS = [
  'calm',
  'tiredness',
  'nostalgia',
  'sadness',
  'joy',
  'gratitude',
  'clarity',
  'breathe',
] as const;

export type MoodId = (typeof MOOD_IDS)[number];
