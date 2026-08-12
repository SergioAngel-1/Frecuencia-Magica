import type { Realm, RealmId } from '@/types/realm';

const GOLD = '#D8B978';
const TEAL = '#96C6BC';
const LAV = '#B9B0D6';

export type VisualMode = 'cosmic' | 'editorial' | 'quiet';
export type PhotoTreatment = 'none' | 'warm' | 'teal' | 'lav' | 'soft';
export type EditorialRealm = Realm & {
  visualMode: VisualMode;
  photoTreatment: PhotoTreatment;
};

/**
 * Los nueve realms con su identidad sensorial.
 *
 * `accent` recolorea las partículas y una de las nebulosas del fondo.
 * `baseNote` re-afina el drone ambiental al entrar: el deslizamiento entre
 * notas es lo que hace que cambiar de realm se sienta como cambiar de lugar.
 * `visualMode` decide cuánto respira el motor del mundo sobre el contenido.
 * `photoTreatment` mantiene el tratamiento fotográfico dentro de la paleta.
 */
export const REALMS: readonly EditorialRealm[] = [
  {
    id: 'portal',
    href: '/',
    accent: GOLD,
    accentVar: '--color-gold',
    baseNote: 110,
    inNav: false,
    visualMode: 'cosmic',
    photoTreatment: 'none',
  },
  {
    id: 'home',
    href: '/inicio',
    accent: GOLD,
    accentVar: '--color-gold',
    baseNote: 110,
    inNav: false,
    visualMode: 'editorial',
    photoTreatment: 'warm',
  },
  {
    id: 'auth',
    href: '/acceso',
    accent: GOLD,
    accentVar: '--color-gold',
    baseNote: 110,
    inNav: false,
    visualMode: 'quiet',
    photoTreatment: 'soft',
  },
  {
    id: 'descubrete',
    href: '/descubrete',
    accent: LAV,
    accentVar: '--color-lav',
    baseNote: 98,
    inNav: true,
    visualMode: 'editorial',
    photoTreatment: 'lav',
  },
  {
    id: 'biblioteca',
    href: '/biblioteca',
    accent: GOLD,
    accentVar: '--color-gold',
    baseNote: 130.8,
    inNav: true,
    visualMode: 'editorial',
    photoTreatment: 'warm',
  },
  {
    id: 'academia',
    href: '/academia',
    accent: TEAL,
    accentVar: '--color-teal',
    baseNote: 146.8,
    inNav: true,
    visualMode: 'editorial',
    photoTreatment: 'teal',
  },
  {
    id: 'experiencias',
    href: '/experiencias',
    accent: LAV,
    accentVar: '--color-lav',
    baseNote: 123.4,
    inNav: true,
    visualMode: 'editorial',
    photoTreatment: 'lav',
  },
  {
    id: 'tienda',
    href: '/tienda',
    accent: GOLD,
    accentVar: '--color-gold',
    baseNote: 116.5,
    inNav: true,
    visualMode: 'editorial',
    photoTreatment: 'warm',
  },
  {
    id: 'sanctuario',
    href: '/mi-santuario',
    accent: GOLD,
    accentVar: '--color-gold',
    baseNote: 103.8,
    inNav: true,
    visualMode: 'quiet',
    photoTreatment: 'soft',
  },
] as const;

/** Los seis destinos de la navegación de constelación, en su orden visual. */
export const NAV_REALMS: readonly EditorialRealm[] = REALMS.filter((realm) => realm.inNav);

const BY_ID = new Map(REALMS.map((realm) => [realm.id, realm]));

export function getRealm(id: RealmId): EditorialRealm {
  const realm = BY_ID.get(id);

  if (!realm) throw new Error(`Realm desconocido: ${id}`);

  return realm;
}
