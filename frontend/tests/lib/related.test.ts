import { describe, expect, it } from 'vitest';

import { PRODUCTS } from '@/data';
import { relatedProducts } from '@/lib/store/related';
import type { Product, ProductId } from '@/types/content';

function product(id: ProductId, catKey: string): Product {
  return {
    id,
    intents: [],
    titleKey: `store.products.${id}.title`,
    catKey,
    price: 20,
    band: 'linear-gradient(0deg,#000,#000)',
    relatedAudioId: 'a1',
    provisional: true,
  };
}

describe('relatedProducts', () => {
  it('prioriza los productos que comparten categoría', () => {
    const current = product('p1', 'store.categories.aromas');
    const sameCategory = product('p2', 'store.categories.aromas');
    const other = product('p3', 'store.categories.candles');

    const result = relatedProducts(current, [current, other, sameCategory], 3);

    expect(result[0]?.id).toBe('p2');
  });

  it('nunca incluye el producto actual', () => {
    const current = product('p1', 'store.categories.aromas');

    const result = relatedProducts(current, [current], 3);

    expect(result.some((p) => p.id === 'p1')).toBe(false);
  });

  it('completa con el resto del catálogo, en su orden, cuando faltan de la misma categoría', () => {
    const current = product('p1', 'a');
    const rest = [product('p2', 'b'), product('p3', 'c'), product('p4', 'd')];

    const result = relatedProducts(current, [current, ...rest], 3);

    expect(result.map((p) => p.id)).toEqual(['p2', 'p3', 'p4']);
  });

  it('no repite productos cuando hay menos disponibles que count', () => {
    const current = product('p1', 'a');
    const only = product('p2', 'a');

    const result = relatedProducts(current, [current, only], 5);

    expect(result).toHaveLength(1);
  });

  it('devuelve como máximo count productos del catálogo real', () => {
    const current = PRODUCTS[0]!;

    const result = relatedProducts(current, PRODUCTS, 3);

    expect(result).toHaveLength(3);
    expect(result.every((p) => p.id !== current.id)).toBe(true);
  });
});
