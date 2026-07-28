import { describe, expect, it } from 'vitest';

import { PRODUCTS } from '@/data';
import { relatedProducts } from '@/lib/store/related';
import type { Product } from '@/types/content';

function product(id: string, catKey: string): Product {
  return {
    id,
    titleKey: `store.products.${id}.title`,
    catKey,
    price: 20,
    band: 'linear-gradient(0deg,#000,#000)',
    relatedAudioId: 'a1',
  };
}

describe('relatedProducts', () => {
  it('prioriza los productos que comparten categoría', () => {
    const current = product('x1', 'store.categories.aromas');
    const sameCategory = product('x2', 'store.categories.aromas');
    const other = product('x3', 'store.categories.candles');

    const result = relatedProducts(current, [current, other, sameCategory], 3);

    expect(result[0]?.id).toBe('x2');
  });

  it('nunca incluye el producto actual', () => {
    const current = product('x1', 'store.categories.aromas');

    const result = relatedProducts(current, [current], 3);

    expect(result.some((p) => p.id === 'x1')).toBe(false);
  });

  it('completa con el resto del catálogo, en su orden, cuando faltan de la misma categoría', () => {
    const current = product('x1', 'a');
    const rest = [product('x2', 'b'), product('x3', 'c'), product('x4', 'd')];

    const result = relatedProducts(current, [current, ...rest], 3);

    expect(result.map((p) => p.id)).toEqual(['x2', 'x3', 'x4']);
  });

  it('no repite productos cuando hay menos disponibles que count', () => {
    const current = product('x1', 'a');
    const only = product('x2', 'a');

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
