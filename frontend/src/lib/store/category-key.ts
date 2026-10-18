import { messageKey, type RelativeKey } from '@/i18n/keys';

/**
 * `Product.catKey` guarda la ruta completa del mensaje (p. ej.
 * `store.categories.aromas`), igual que `tagKey`/`levelKey`/`modeKey` en el
 * resto de entidades (`@/types/content`). Los componentes de la tienda ya
 * traducen con `useTranslations('store')`, así que hay que quitar ese prefijo
 * antes de llamar a `t()`: si no, la búsqueda queda duplicada
 * (`store.categories.store.categories.aromas`) y next-intl cae al key crudo en
 * vez de mostrar la etiqueta.
 *
 * Delega en `messageKey`, el único punto que convierte una cadena de datos en
 * una clave de mensaje tipada.
 */
export function categoryKey(catKey: string): RelativeKey<'store'> {
  return messageKey('store', catKey);
}
