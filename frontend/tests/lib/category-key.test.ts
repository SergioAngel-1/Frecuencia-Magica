import { describe, expect, it } from 'vitest';

import { PRODUCTS } from '@/data';
import { categoryKey } from '@/lib/store/category-key';

describe('categoryKey', () => {
  it('quita el prefijo de namespace "store."', () => {
    expect(categoryKey('store.categories.aromas')).toBe('categories.aromas');
  });

  it('devuelve la clave sin cambios si no lleva el prefijo', () => {
    expect(categoryKey('categories.aromas')).toBe('categories.aromas');
  });

  it('funciona para todas las categorías del catálogo real', () => {
    for (const product of PRODUCTS) {
      expect(categoryKey(product.catKey)).toBe(
        product.catKey.replace(/^store\./, ''),
      );
    }
  });
});
