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

/** Tipo de escucha: el eje del Resonario. Su orden y su explicación viven en `config/audio-kinds.ts`. */
export type AudioKind = 'melody' | 'nature' | 'frequency' | 'binaural' | 'guided';

/** `ready`: se puede reproducir o muestrear. `soon`: aún sin material; no tiene control de play. */
export type AudioAvailability = 'ready' | 'soon';

/**
 * Procedencia. `own` grabación propia; `licensed` con licencia comercial
 * documentada; `synthetic` tono generado por nosotros; `provisional` síntesis
 * de relleno (o material aún no entregado) que se sustituye antes de publicar.
 */
export type AudioLicense = 'own' | 'licensed' | 'synthetic' | 'provisional';

/** Capa de tono puro: una frecuencia. `gain` 0–1, por defecto 1. */
export type ToneLayer = { hz: number; gain?: number };

/** Capa binaural: un oscilador por oído; la diferencia de frecuencia es el pulso. */
export type BinauralLayer = { carrierHz: number; beatHz: number; gain?: number };

/** Textura de ruido filtrado (mar, lluvia). */
export type TextureLayer = { gain?: number };

/**
 * Receta de síntesis. Cada capa presente suena a la vez: una pista puede
 * combinar varias (p. ej. mar + binaural) sin dejar de ser una sola pista.
 */
export type SynthRecipe = {
  tone?: ToneLayer;
  binaural?: BinauralLayer;
  sea?: TextureLayer;
  rain?: TextureLayer;
};

/**
 * De dónde suena una pista: sintetizada con una receta, un archivo (con su
 * muestra opcional de 20–30 s) o ninguna todavía (`soon`).
 */
export type AudioSource =
  { type: 'synth'; recipe: SynthRecipe } | { type: 'file'; src: string; sampleSrc?: string } | null;

export type Audio = IntentAffine & {
  id: string;
  kind: AudioKind;
  titleKey: string;
  tagKey: string;
  /** Etiqueta de apoyo en las tarjetas. Nunca filtrar por ella: el filtro es `kind`. */
  tagId: AudioTag;
  /** Etiqueta `mm:ss` de la sesión que reproduce. `null` mientras no exista (`soon`). */
  duration: string | null;
  /** Frecuencia de un tono puro; `null` si la pista no es un tono (naturaleza, binaural, melodía, guiadas). */
  hz: number | null;
  band: string;
  /** Lleva voz guiada. */
  voice: boolean;
  availability: AudioAvailability;
  source: AudioSource;
  license: AudioLicense;
  /** Pide auriculares estéreo (binaurales). */
  headphones: boolean;
  /** Clave de la composición: qué suena. */
  compositionKey: string;
  /** Clave de la guía de escucha: postura y para qué momento sirve. */
  guideKey: string;
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
