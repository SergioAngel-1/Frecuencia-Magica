import type { AtmosphereId, Place } from '@/types/atmosphere';
import type { AudioKind } from '@/types/content';

/**
 * Cada tipo de escucha tiene su luz: la naturaleza arraiga, la melodía se
 * despide con el sol, la voz guiada abre el día, lo binaural recoge y la
 * frecuencia pura es el cielo cósmico. Sólo se aplica en Automático y donde la
 * escucha manda; una elección de la persona siempre gana.
 */
export const LISTENING_ATMOSPHERE: Record<AudioKind, AtmosphereId> = {
  nature: 'forest',
  melody: 'dusk',
  guided: 'dawn',
  binaural: 'moon',
  frequency: 'night',
};

/** Lugares donde el tema sigue a la pista que suena mientras no haya elección. */
export const LISTENING_PLACES: readonly Place[] = ['resonario'];
