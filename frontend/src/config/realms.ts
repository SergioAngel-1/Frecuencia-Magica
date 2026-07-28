import type { Realm, RealmId } from '@/types/realm';

const GOLD = '#D8B978';
const TEAL = '#96C6BC';
const LAV = '#B9B0D6';

/**
 * Los nueve realms con su identidad sensorial.
 *
 * `accent` recolorea las partículas y una de las nebulosas del fondo.
 * `baseNote` re-afina el drone ambiental al entrar: el deslizamiento entre
 * notas es lo que hace que cambiar de realm se sienta como cambiar de lugar.
 */
export const REALMS: readonly Realm[] = [
  { id: 'portal', accent: GOLD, accentVar: '--color-gold', baseNote: 110, inNav: false },
  { id: 'home', accent: GOLD, accentVar: '--color-gold', baseNote: 110, inNav: false },
  { id: 'auth', accent: GOLD, accentVar: '--color-gold', baseNote: 110, inNav: false },
  { id: 'descubrete', accent: LAV, accentVar: '--color-lav', baseNote: 98, inNav: true },
  { id: 'biblioteca', accent: GOLD, accentVar: '--color-gold', baseNote: 130.8, inNav: true },
  { id: 'academia', accent: TEAL, accentVar: '--color-teal', baseNote: 146.8, inNav: true },
  { id: 'experiencias', accent: LAV, accentVar: '--color-lav', baseNote: 123.4, inNav: true },
  { id: 'tienda', accent: GOLD, accentVar: '--color-gold', baseNote: 116.5, inNav: true },
  { id: 'sanctuario', accent: GOLD, accentVar: '--color-gold', baseNote: 103.8, inNav: true },
] as const;

/** Los seis destinos de la navegación de constelación, en su orden visual. */
export const NAV_REALMS: readonly Realm[] = REALMS.filter((realm) => realm.inNav);

const BY_ID = new Map(REALMS.map((realm) => [realm.id, realm]));

export function getRealm(id: RealmId): Realm {
  const realm = BY_ID.get(id);

  if (!realm) throw new Error(`Realm desconocido: ${id}`);

  return realm;
}
