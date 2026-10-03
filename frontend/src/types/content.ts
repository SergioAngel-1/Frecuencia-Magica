/**
 * Modelo de contenido.
 *
 * Los textos NO viven aquí: cada entidad guarda una clave de traducción
 * (`titleKey`) y el texto real está en `messages/{es,en}.json`. Así los Server
 * Components renderizan sin lógica de idioma y no se duplica el mecanismo
 * de i18n.
 */

/**
 * Intención que guía Descúbrete. Cada respuesta del quiz suma a una o dos, y
 * cada ítem del catálogo declara las que acompaña (la primera es la principal):
 * así el resultado recomienda algo de cada realm, no sólo una frecuencia.
 */
export type Intent = 'calm' | 'grounding' | 'clarity' | 'rest' | 'bond' | 'renewal';

/** Ítem recomendable por intención, en orden de afinidad. */
export type IntentAffine = {
  intents: readonly Intent[];
};

/** Etiqueta estable de frecuencia, independiente del idioma. */
export type AudioTag = 'meditation' | 'frequency' | 'grounding' | 'rest' | 'ritual' | 'breath';

export type Audio = IntentAffine & {
  id: string;
  titleKey: string;
  tagKey: string;
  /** Por lo que filtra el Resonario. Nunca filtrar por el texto traducido. */
  tagId: AudioTag;
  /** Etiqueta `mm:ss`. */
  duration: string;
  hz: number;
  band: string;
};

export type Course = IntentAffine & {
  id: string;
  titleKey: string;
  levelKey: string;
  lessons: number;
  /** Etiqueta legible, p. ej. `"3.5h"`. */
  hours: string;
  band: string;
};

export type ExperienceMode = 'online' | 'inPerson';

export type Experience = IntentAffine & {
  id: string;
  titleKey: string;
  modeKey: string;
  mode: ExperienceMode;
  /** Etiqueta legible, p. ej. `"60 min"`. */
  dur: string;
  price: number;
  band: string;
};

export type Product = IntentAffine & {
  id: string;
  titleKey: string;
  catKey: string;
  price: number;
  band: string;
  /** Frecuencia que acompaña al producto en su ritual. */
  relatedAudioId: string;
};

export type QuestionOption = {
  key: string;
  /** Intención principal (2 puntos) y, opcional, secundaria (1 punto). */
  intents: readonly [Intent] | readonly [Intent, Intent];
};

export type Question = {
  id: string;
  promptKey: string;
  options: readonly QuestionOption[];
};
