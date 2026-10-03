const NAMESPACE_PREFIX = 'store.';

/**
 * `Product.catKey` guarda la ruta completa del mensaje (p. ej.
 * `store.categories.aromas`), igual que `tagKey`/`levelKey`/`modeKey` en el
 * resto de entidades (`@/types/content`). Los componentes de la tienda ya
 * traducen con `useTranslations('store')`, así que hay que quitar ese
 * prefijo antes de llamar a `t()`: si no, la búsqueda queda duplicada
 * (`store.categories.store.categories.aromas`) y next-intl cae al key
 * crudo en vez de mostrar la etiqueta.
 *
 * El cast final es la misma mentira controlada a TypeScript que usa
 * `levelKey` en `academy/course-list.tsx`: en tiempo de ejecución el valor
 * es el nombre de categoría real, pero el tipo de mensajes tipados de
 * next-intl exige una de las claves literales conocidas.
 */
export function categoryKey(catKey: string): 'categories.aromas' {
  const relative = catKey.startsWith(NAMESPACE_PREFIX)
    ? catKey.slice(NAMESPACE_PREFIX.length)
    : catKey;

  return relative as 'categories.aromas';
}
