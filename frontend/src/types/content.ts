/**
 * Modelo de contenido.
 *
 * Los textos NO viven aquí: cada entidad guarda una clave de traducción
 * (`titleKey`) y el texto real está en `messages/{es,en}.json`. Así los Server
 * Components renderizan sin lógica de idioma y no se duplica el mecanismo
 * de i18n.
 */

/** Etiqueta estable de frecuencia, independiente del idioma. */
export type AudioTag = 'meditation' | 'frequency' | 'grounding' | 'rest' | 'ritual' | 'breath';

export type Audio = {
  id: string;
  titleKey: string;
  tagKey: string;
  /** Por lo que filtra la Biblioteca. Nunca filtrar por el texto traducido. */
  tagId: AudioTag;
  /** Etiqueta `mm:ss`. */
  duration: string;
  hz: number;
  band: string;
};

export type Course = {
  id: string;
  titleKey: string;
  levelKey: string;
  lessons: number;
  /** Etiqueta legible, p. ej. `"3.5h"`. */
  hours: string;
  band: string;
};

export type ExperienceMode = 'online' | 'inPerson';

export type Experience = {
  id: string;
  titleKey: string;
  modeKey: string;
  mode: ExperienceMode;
  /** Etiqueta legible, p. ej. `"60 min"`. */
  dur: string;
  price: number;
  band: string;
};

export type Product = {
  id: string;
  titleKey: string;
  catKey: string;
  price: number;
  band: string;
  /** Frecuencia que acompaña al producto en su ritual. */
  relatedAudioId: string;
};

export type Question = {
  id: string;
  promptKey: string;
  optionKeys: string[];
};
