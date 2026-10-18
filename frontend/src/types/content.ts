import type { EditorialMediaSlot } from '@/config/editorial-media';
import type catalog from '../../messages/es.json';

/**
 * Ids del catálogo, derivados de las claves del mensaje español: un id sin su
 * bloque de copy no compila, y las plantillas `` `audios.${id}.title` `` tipan
 * solas contra `src/types/messages.d.ts` sin cast.
 */
export type AudioId = keyof typeof catalog.resonario.audios;
export type CourseId = keyof typeof catalog.academy.courses;
export type ExperienceId = keyof typeof catalog.experiences.items;
export type ProductId = keyof typeof catalog.store.products;
export type QuestionId = keyof typeof catalog.discover.questions;

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
  id: AudioId;
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

/** Gratuito, o de pago con su precio. */
export type CourseAccess = { type: 'free' } | { type: 'paid'; price: number };

/** `selfPaced` a tu ritmo; `live` en vivo; `blended` mixta. */
export type CourseModality = 'selfPaced' | 'live' | 'blended';

export type Course = IntentAffine & {
  id: CourseId;
  titleKey: string;
  levelKey: string;
  lessons: number;
  /** Etiqueta legible, p. ej. `"3.5h"`. */
  hours: string;
  band: string;
  access: CourseAccess;
  modality: CourseModality;
  /** «Qué aprenderás»: claves de mensaje, una por punto. */
  learnKeys: readonly string[];
  /** «Qué incluye»: claves de mensaje, una por punto. */
  includesKeys: readonly string[];
  /**
   * Curso de demostración: lo real (rituales, esencias, gratuitos y de pago) lo
   * entrega Marisol. Lo lee el registro de pendientes.
   */
  provisional: boolean;
};

export type ExperienceMode = 'online' | 'inPerson';

export type Experience = IntentAffine & {
  id: ExperienceId;
  titleKey: string;
  modeKey: string;
  mode: ExperienceMode;
  /** Etiqueta legible, p. ej. `"60 min"`. */
  dur: string;
  price: number;
  band: string;
};

/** Vistas opcionales de la galería de un producto, además de su visual. */
export type ProductViewKind = 'label' | 'texture' | 'inUse';

/** Una vista de la galería: un slot editorial que ya existe (y su instancia). Sin slots nuevos (R12). */
export type ProductView = { slot: EditorialMediaSlot; instance?: string };

/** Galería de un producto: sólo las vistas que Marisol entregue; las demás caen al visual. */
export type ProductGallery = Partial<Record<ProductViewKind, ProductView>>;

export type Product = IntentAffine & {
  id: ProductId;
  titleKey: string;
  catKey: string;
  price: number;
  band: string;
  /** Frecuencia que acompaña al producto en su ritual. */
  relatedAudioId: AudioId;
  /**
   * Producto de demostración: nombre, precio y foto se sustituyen por los
   * reales de Marisol antes de publicar. Lo lee el registro de pendientes.
   */
  provisional: boolean;
  /** Clave del tamaño (p. ej. «30 ml»). Sin ella no se pinta: el dato lo confirma Marisol. */
  sizeKey?: string;
  /** Clave del contenido o ingredientes. Sin ella no se pinta. */
  contentsKey?: string;
  /** Vistas propias (etiqueta, textura, en uso). Sin ellas, sólo el visual del producto. */
  gallery?: ProductGallery;
};

export type QuestionOption = {
  key: string;
  /** Intención principal (2 puntos) y, opcional, secundaria (1 punto). */
  intents: readonly [Intent] | readonly [Intent, Intent];
};

export type Question = {
  id: QuestionId;
  promptKey: string;
  options: readonly QuestionOption[];
};
