import { BANDS } from '@/config/bands';
import { NAV_REALMS, type EditorialRealm } from '@/config/realms';
import type { Translator } from '@/lib/home/translator';
import { resolveEditorialMedia } from '@/lib/editorial/asset-registry';

/** El héroe de la vista interna de cada realm de la navegación. */
export const REALM_HERO_SLOTS = {
  descubrete: 'discover.hero',
  resonario: 'resonario.hero',
  academia: 'academy.hero',
  experiencias: 'experiences.hero',
  tienda: 'store.hero',
  sanctuario: 'sanctuary.hero',
} as const;

/**
 * Foco propio de la tarjeta cuando su recorte deja fuera lo que el héroe
 * cuenta: Tienda es una columna alta y sus objetos viven a la derecha.
 */
const REALM_CARD_FOCUS: Partial<Record<keyof typeof REALM_HERO_SLOTS, string>> = {
  tienda: '97% 50%',
};

/**
 * Ancho que pinta cada héroe 16:9 en su tarjeta del bento. `cover` escala por
 * el alto en las tarjetas más altas que anchas: Tienda ocupa dos filas y su
 * imagen mide mucho más que la columna.
 */
const REALM_CARD_SIZES = {
  academia: '(min-width: 1024px) 760px, 100vw',
  sanctuario: '(min-width: 1024px) 860px, 100vw',
  tienda: '(min-width: 1024px) 1100px, (min-width: 640px) 60vw, 100vw',
  default: '(min-width: 1024px) 540px, (min-width: 640px) 60vw, 100vw',
} as const;

export type RealmCard = {
  id: EditorialRealm['id'];
  href: string;
  band: string;
  media: ReturnType<typeof resolveEditorialMedia>;
  emotion: string;
  title: string;
  description: string;
};

/**
 * Una tarjeta por realm de la navegación. Cada puerta se ve como lo que hay
 * detrás: el héroe de su vista interna, recortado a la tarjeta. Decorativo: la
 * tarjeta ya dice su nombre.
 */
export function buildRealmCards(
  realms: readonly Pick<EditorialRealm, 'id' | 'href' | 'accentKey'>[],
  copy: { home: Translator; nav: Translator },
): RealmCard[] {
  return realms.map((r) => {
    const heroId = r.id as keyof typeof REALM_HERO_SLOTS;

    return {
      id: r.id,
      href: r.href,
      band: BANDS[r.accentKey],
      media: resolveEditorialMedia(REALM_HERO_SLOTS[heroId], {
        alt: '',
        priority: false,
        position: REALM_CARD_FOCUS[heroId],
        sizes:
          REALM_CARD_SIZES[heroId as keyof typeof REALM_CARD_SIZES] ?? REALM_CARD_SIZES.default,
        band: BANDS[r.accentKey],
      }),
      emotion: copy.nav(`emotions.${r.id}`),
      title: copy.nav(`realms.${r.id}`),
      description: copy.home(`realms.descriptions.${r.id}`),
    };
  });
}

/** Celdas del bento que siguen a la Academia, en el orden que fija su rejilla. */
const BENTO_ORDER = ['descubrete', 'resonario', 'experiencias', 'tienda', 'sanctuario'] as const;

/**
 * Pasos de `order-*` para la columna única de móvil. Son literales para que
 * Tailwind los encuentre al escanear el código; su emparejamiento con el menú
 * lo deriva `mobileOrder` de `NAV_REALMS`.
 */
const MOBILE_ORDER_STEPS = [
  'order-1',
  'order-2',
  'order-3',
  'order-4',
  'order-5',
  'order-6',
] as const;

/**
 * En móvil (`< sm`) la rejilla es una sola columna: las puertas siguen el
 * orden del menú (`NAV_REALMS`), no el del bento de escritorio. Devuelve la
 * clase `order-*`; en `sm` y arriba el llamador la anula con `sm:order-none`.
 */
export function mobileOrder(id: EditorialRealm['id']): string | undefined {
  const index = NAV_REALMS.findIndex((realm) => realm.id === id);

  return index < 0 ? undefined : MOBILE_ORDER_STEPS[index];
}

/**
 * Reparte las tarjetas en el bento: Academia es la destacada y el resto sigue
 * `BENTO_ORDER`, no el orden del menú (Tienda ocupa dos filas en la cuarta celda).
 */
export function arrangeBento(cards: readonly RealmCard[]): {
  academia: RealmCard;
  others: RealmCard[];
} {
  const academia = cards.find((card) => card.id === 'academia');
  if (!academia) throw new Error('La Home necesita la tarjeta de Academia');

  const others = BENTO_ORDER.flatMap((id) => cards.filter((card) => card.id === id));

  return { academia, others };
}
