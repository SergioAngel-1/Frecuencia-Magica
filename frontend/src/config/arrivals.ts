import type { AtmosphereId } from '@/types/atmosphere';
import type { AudioKind, Intent } from '@/types/content';

import type { MoodId } from '@/types/mood';

/** Una entrada del check-in (un estado del diario) o de Descúbrete (una intención). */
export type ArrivalKey = `mood:${MoodId}` | `intent:${Intent}`;

/** Clave de la frase que explica la entrada, dentro del espacio `arrival`. */
export type ArrivalExplanationKey = `moods.${MoodId}.explanation` | `intents.${Intent}.explanation`;

export type ArrivalEntry = {
  atmosphere: AtmosphereId;
  /**
   * Tipos de escucha en orden de preferencia (spec §5.3). Un tipo sin pistas
   * reproducibles se salta; la práctica de respiración no es un tipo.
   */
  kinds: readonly AudioKind[];
  explanationKey: ArrivalExplanationKey;
  /** La entrada abre una práctica además de (o en lugar de) una pista. */
  practice?: 'breathing';
};

/**
 * Registro único de llegadas (spec §5.3, editable aquí). Alimenta el check-in
 * del diario, el bloque de la Home y el resultado de Descúbrete.
 */
export const ARRIVALS: Record<ArrivalKey, ArrivalEntry> = {
  'mood:calm': {
    atmosphere: 'dawn',
    kinds: ['nature', 'melody', 'frequency'],
    explanationKey: 'moods.calm.explanation',
  },
  'mood:tiredness': {
    atmosphere: 'dusk',
    kinds: ['nature', 'melody', 'guided', 'frequency'],
    explanationKey: 'moods.tiredness.explanation',
  },
  'mood:nostalgia': {
    atmosphere: 'dusk',
    kinds: ['melody', 'nature', 'guided'],
    explanationKey: 'moods.nostalgia.explanation',
  },
  'mood:sadness': {
    atmosphere: 'dusk',
    kinds: ['melody', 'nature', 'guided'],
    explanationKey: 'moods.sadness.explanation',
  },
  'mood:joy': {
    atmosphere: 'dawn',
    kinds: ['melody', 'nature'],
    explanationKey: 'moods.joy.explanation',
  },
  'mood:gratitude': {
    atmosphere: 'dawn',
    kinds: ['melody', 'nature'],
    explanationKey: 'moods.gratitude.explanation',
  },
  'mood:clarity': {
    atmosphere: 'dawn',
    kinds: ['melody', 'nature', 'binaural'],
    explanationKey: 'moods.clarity.explanation',
  },
  'mood:breathe': {
    atmosphere: 'dawn',
    kinds: ['nature', 'melody'],
    explanationKey: 'moods.breathe.explanation',
    practice: 'breathing',
  },
  'intent:calm': {
    atmosphere: 'dawn',
    kinds: ['nature', 'melody', 'frequency'],
    explanationKey: 'intents.calm.explanation',
  },
  'intent:grounding': {
    atmosphere: 'forest',
    kinds: ['nature', 'melody', 'frequency'],
    explanationKey: 'intents.grounding.explanation',
  },
  'intent:clarity': {
    atmosphere: 'dawn',
    kinds: ['melody', 'nature', 'binaural'],
    explanationKey: 'intents.clarity.explanation',
  },
  'intent:rest': {
    atmosphere: 'dusk',
    kinds: ['nature', 'melody', 'guided', 'frequency'],
    explanationKey: 'intents.rest.explanation',
  },
  'intent:bond': {
    atmosphere: 'dawn',
    kinds: ['melody', 'nature'],
    explanationKey: 'intents.bond.explanation',
  },
  'intent:renewal': {
    atmosphere: 'forest',
    kinds: ['nature', 'melody', 'frequency'],
    explanationKey: 'intents.renewal.explanation',
  },
};

/**
 * Intención que cada estado del diario busca en las pistas (decisión propia:
 * la tabla §5.3 habla de sonidos, no de intenciones). Dentro de cada tipo, la
 * pista que la lleva en `Audio.intents` va primero.
 */
export const MOOD_INTENT: Record<MoodId, Intent> = {
  calm: 'calm',
  tiredness: 'rest',
  nostalgia: 'bond',
  sadness: 'bond',
  joy: 'bond',
  gratitude: 'bond',
  clarity: 'clarity',
  breathe: 'calm',
};

/**
 * Pistas que acompañan mejor una atmósfera mientras no hay material propio. En
 * bosque, la lluvia (n2) antes que el mar: el bosque real aún no existe.
 */
export const ATMOSPHERE_SOUNDS: Partial<Record<AtmosphereId, readonly string[]>> = {
  forest: ['n2'],
};

/** Entrada neutra: lo que llega sin reconocer cae aquí (calma). */
export const ARRIVAL_FALLBACK: ArrivalKey = 'mood:calm';

/**
 * Atmósferas que se ofrecen como «otra opción». `moon` sólo aparece de noche
 * (lo decide `respondToArrival` por la hora).
 */
export const ARRIVAL_ATMOSPHERES: readonly AtmosphereId[] = ['dusk', 'dawn', 'forest', 'moon'];

/**
 * Clave de `localStorage` de la última llegada elegida. Sólo guarda *qué* estado
 * o intención se eligió: el tema y el sonido viven en sus propios stores.
 */
export const ARRIVAL_STORAGE_KEY = 'fm.arrival';

/** Versión del formato guardado (`persist({ version })`). */
export const ARRIVAL_STORE_VERSION = 1;
