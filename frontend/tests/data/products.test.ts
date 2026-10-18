import { describe, expect, it } from 'vitest';

import { PRODUCTS } from '@/data';

/**
 * Los ocho productos son un placeholder (spec §7.5): el catálogo real, con
 * nombres, tamaños, contenidos y fotos, lo define Marisol. Nada de eso se
 * inventa: mientras no lo entregue, el dato no existe y la vista no lo pinta.
 */
describe('productos provisionales', () => {
  it('los ocho siguen marcados provisionales (campo estructurado, R13)', () => {
    expect(PRODUCTS).toHaveLength(8);
    for (const product of PRODUCTS) expect(product.provisional, product.id).toBe(true);
  });

  it('ninguno inventa tamaño, contenido ni vistas de galería', () => {
    for (const product of PRODUCTS) {
      expect(product.sizeKey, product.id).toBeUndefined();
      expect(product.contentsKey, product.id).toBeUndefined();
      expect(product.gallery, product.id).toBeUndefined();
    }
  });
});
