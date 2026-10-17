import { locales } from '@/i18n/routing';
import type { Place } from '@/types/atmosphere';
import type { RealmId } from '@/types/realm';

/**
 * Primer segmento de ruta → lugar, en ambos idiomas.
 *
 * Se compara contra el segmento crudo de la URL (`/resonarium`), nunca contra un
 * texto traducido: es lo que hace que derivar el lugar funcione igual en ES y EN.
 * El portal (`/`) no tiene segmento y es el valor por defecto. `story` es Sobre
 * Marisol: su realm es `home` (ver `realmFromPathname`).
 */
const SEGMENT_TO_PLACE: Record<string, Place> = {
  // Español (locale por defecto, sin prefijo)
  inicio: 'home',
  'sobre-marisol': 'story',
  acceso: 'auth',
  descubrete: 'descubrete',
  resonario: 'resonario',
  academia: 'academia',
  experiencias: 'experiencias',
  tienda: 'tienda',
  'mi-santuario': 'sanctuario',
  // Inglés
  home: 'home',
  'about-marisol': 'story',
  auth: 'auth',
  discover: 'descubrete',
  resonarium: 'resonario',
  academy: 'academia',
  experiences: 'experiencias',
  store: 'tienda',
  'my-sanctuary': 'sanctuario',
};

const LOCALE_SET = new Set<string>(locales);

/**
 * Deriva el lugar activo del `pathname`. Función pura, sin React.
 *
 * Descarta un primer segmento que sea un locale conocido (`/en/...`), toma el
 * siguiente y lo busca en el mapa. Sin segmento útil o segmento desconocido →
 * portal, que es el umbral y el destino de cualquier ruta huérfana.
 */
export function placeFromPathname(pathname: string): Place {
  const segments = pathname.split('/').filter(Boolean);
  const first = segments[0];

  if (first === undefined) return 'portal';

  const segment = LOCALE_SET.has(first) ? segments[1] : first;

  if (segment === undefined) return 'portal';

  return SEGMENT_TO_PLACE[segment] ?? 'portal';
}

/**
 * Deriva el realm activo del `pathname`. Sobre Marisol hereda el realm del home.
 */
export function realmFromPathname(pathname: string): RealmId {
  const place = placeFromPathname(pathname);

  return place === 'story' ? 'home' : place;
}
