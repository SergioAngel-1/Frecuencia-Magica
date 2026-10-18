import type catalog from '../../messages/es.json';

type Catalog = typeof catalog;

/**
 * Claves de un valor del catálogo, con puntos (`courses.c1.title`). Los arrays
 * (las opciones del quiz) se indexan como `${number}`.
 */
type NestedKeys<Value> = Value extends string
  ? never
  : Value extends readonly unknown[]
    ? `${number}`
    : {
        [Key in keyof Value & string]: NestedKeys<Value[Key]> extends never
          ? Key
          : `${Key}.${NestedKeys<Value[Key]>}`;
      }[keyof Value & string];

/** Clave relativa al namespace, tal como la espera `useTranslations(namespace)`. */
export type RelativeKey<Namespace extends keyof Catalog> = NestedKeys<Catalog[Namespace]>;

/** Los seis destinos de la constelación: las claves de `nav.realms` (y `nav.emotions`). */
export type NavRealmId = keyof typeof catalog.nav.realms;

/**
 * Clave relativa de un namespace a partir de una cadena construida en tiempo de
 * ejecución: una clave completa (`academy.levels.foundations`), un índice de
 * lección o una clave de datos de longitud variable.
 *
 * Es el único punto donde se le miente a TypeScript. Los datos guardan claves
 * como `string` y `useTranslations` exige una clave literal conocida; el valor
 * real siempre existe (lo vigilan los tests de i18n y de datos). Si la cadena
 * llega con el prefijo `namespace.`, se quita —como hacían los `replace` sueltos.
 */
export function messageKey<Namespace extends keyof Catalog>(
  namespace: Namespace,
  key: string,
): RelativeKey<Namespace> {
  const prefix = `${namespace}.`;
  const relative = key.startsWith(prefix) ? key.slice(prefix.length) : key;

  return relative as RelativeKey<Namespace>;
}
