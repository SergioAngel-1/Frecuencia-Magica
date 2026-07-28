import type { Product } from '@/types/content';

/**
 * Los ocho productos de la tienda.
 *
 * La rejilla bento los coloca así: fila de 3 (p2, p3, p4), destacado p1 con
 * lateral p5, y fila de 3 (p6, p7, p8).
 */
export const PRODUCTS: readonly Product[] = [
  {
    id: 'p1',
    titleKey: 'store.products.p1.title',
    catKey: 'store.categories.aromas',
    price: 28,
    band: 'linear-gradient(150deg,#8a7150,#2c2418)',
    relatedAudioId: 'a5',
  },
  {
    id: 'p2',
    titleKey: 'store.products.p2.title',
    catKey: 'store.categories.candles',
    price: 34,
    band: 'linear-gradient(150deg,#a07840,#2c2012)',
    relatedAudioId: 'a2',
  },
  {
    id: 'p3',
    titleKey: 'store.products.p3.title',
    catKey: 'store.categories.crystals',
    price: 22,
    band: 'linear-gradient(150deg,#6e5f8a,#241f3a)',
    relatedAudioId: 'a1',
  },
  {
    id: 'p4',
    titleKey: 'store.products.p4.title',
    catKey: 'store.categories.mists',
    price: 26,
    band: 'linear-gradient(150deg,#4f6b5e,#1e2e28)',
    relatedAudioId: 'a3',
  },
  {
    id: 'p5',
    titleKey: 'store.products.p5.title',
    catKey: 'store.categories.rituals',
    price: 18,
    band: 'linear-gradient(150deg,#5a6b52,#20281c)',
    relatedAudioId: 'a5',
  },
  {
    id: 'p6',
    titleKey: 'store.products.p6.title',
    catKey: 'store.categories.care',
    price: 24,
    band: 'linear-gradient(150deg,#6a5a8c,#221d38)',
    relatedAudioId: 'a4',
  },
  {
    id: 'p7',
    titleKey: 'store.products.p7.title',
    catKey: 'store.categories.drinks',
    price: 20,
    band: 'linear-gradient(150deg,#8a7150,#2c2418)',
    relatedAudioId: 'a1',
  },
  {
    id: 'p8',
    titleKey: 'store.products.p8.title',
    catKey: 'store.categories.stationery',
    price: 30,
    band: 'linear-gradient(150deg,#4a7d8a,#1c2f36)',
    relatedAudioId: 'a6',
  },
] as const;
