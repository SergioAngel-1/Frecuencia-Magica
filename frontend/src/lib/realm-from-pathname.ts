import { locales } from '@/i18n/routing';
import type { RealmId } from '@/types/realm';

/**
 * Primer segmento de ruta → realm, en ambos idiomas.
 *
 * Se compara contra el segmento crudo de la URL (`/library`), nunca contra un
 * texto traducido: es lo que hace que derivar el realm funcione igual en ES y EN.
 * El portal (`/`) no tiene segmento y es el valor por defecto.
 */
const SEGMENT_TO_REALM: Record<string, RealmId> = {
  // Español (locale por defecto, sin prefijo)
  inicio: 'home',
  acceso: 'auth',
  descubrete: 'descubrete',
  biblioteca: 'biblioteca',
  academia: 'academia',
  experiencias: 'experiencias',
  tienda: 'tienda',
  'mi-santuario': 'sanctuario',
  // Inglés
  home: 'home',
  auth: 'auth',
  discover: 'descubrete',
  library: 'biblioteca',
  academy: 'academia',
  experiences: 'experiencias',
  store: 'tienda',
  'my-sanctuary': 'sanctuario',
};

const LOCALE_SET = new Set<string>(locales);

/**
 * Deriva el realm activo del `pathname`. Función pura, sin React.
 *
 * Descarta un primer segmento que sea un locale conocido (`/en/...`), toma el
 * siguiente y lo busca en el mapa. Sin segmento útil o segmento desconocido →
 * portal, que es el umbral y el destino de cualquier ruta huérfana.
 */
export function realmFromPathname(pathname: string): RealmId {
  const segments = pathname.split('/').filter(Boolean);
  const first = segments[0];

  if (first === undefined) return 'portal';

  const realmSegment = LOCALE_SET.has(first) ? segments[1] : first;

  if (realmSegment === undefined) return 'portal';

  return SEGMENT_TO_REALM[realmSegment] ?? 'portal';
}
