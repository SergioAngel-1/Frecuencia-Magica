import { getMessages } from 'next-intl/server';

import { BASE_NAMESPACES, pickMessages, ROUTE_NAMESPACES, type RouteRealm } from './messages';

/**
 * Mensajes que un realm re-provee a sus páginas: la base de la capa viva más lo
 * propio de la ruta. El provider anidado reemplaza el catálogo del layout raíz.
 */
export async function routeMessages(realm: RouteRealm) {
  return pickMessages(await getMessages(), [...BASE_NAMESPACES, ...ROUTE_NAMESPACES[realm]]);
}
