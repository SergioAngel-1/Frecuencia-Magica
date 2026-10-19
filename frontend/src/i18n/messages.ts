import type es from '../../messages/es.json';

/** Forma del catálogo completo. El castellano es la referencia (paridad con el inglés la vigila un test). */
export type Messages = typeof es;

/** Nombre de un namespace de primer nivel del catálogo. */
export type Namespace = keyof Messages;

/**
 * Namespaces que consume la capa viva, montada una sola vez en el layout raíz:
 * header, nav, footer, reproductor, estados, atmósferas, portal, «hablar ahora».
 *
 * Van siempre al cliente para que esas piezas funcionen en cualquier ruta. Un
 * componente de esta capa que pida un namespace fuera de esta lista rompe la UI
 * en silencio (clave en bruto); por eso lo vigila `tests/i18n/route-namespaces.test.ts`.
 */
export const BASE_NAMESPACES = [
  'common',
  'header',
  'nav',
  'footer',
  'states',
  'atmospheres',
  'portal',
  'discover',
  'resonario',
  'player',
  'video',
  'store',
  'cart',
  'home',
  'talk',
] as const satisfies readonly Namespace[];

/**
 * Namespaces extra que necesita cada realm, encima de `BASE_NAMESPACES`.
 *
 * Un layout por carpeta de realm vuelve a proveer `BASE + ROUTE[realm]`: el
 * `NextIntlClientProvider` anidado reemplaza los mensajes, no los mezcla. Los
 * realms cuya lista queda vacía se sirven con la base del layout raíz.
 */
export const ROUTE_NAMESPACES = {
  portal: [],
  inicio: ['arrival', 'journal'],
  acceso: ['auth'],
  descubrete: ['academy', 'experiences', 'arrival'],
  resonario: [],
  academia: ['academy'],
  experiencias: ['experiences', 'booking'],
  tienda: [],
  'mi-santuario': ['sanctuary', 'journal'],
  'sobre-marisol': [],
  kit: [],
} as const satisfies Record<string, readonly Namespace[]>;

export type RouteRealm = keyof typeof ROUTE_NAMESPACES;

/**
 * Devuelve una copia del catálogo con sólo los namespaces pedidos.
 *
 * Se pasa a `NextIntlClientProvider` para no enviar al navegador lo que la
 * ruta no usa (el catálogo entero son ~41 kB). El `as` final es el único
 * puente necesario: un índice por unión de claves no se deja asignar poco a
 * poco, pero el resultado es, por construcción, un subconjunto válido.
 */
export function pickMessages(
  messages: Messages,
  namespaces: readonly Namespace[],
): Partial<Messages> {
  const picked: Record<string, unknown> = {};
  for (const namespace of namespaces) picked[namespace] = messages[namespace];
  return picked as Partial<Messages>;
}
