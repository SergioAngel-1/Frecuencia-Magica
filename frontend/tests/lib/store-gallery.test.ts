import { describe, expect, it } from 'vitest';

import { PRODUCTS } from '@/data';
import { galleryViews, productSpecs, resolveProductView } from '@/lib/store/gallery';
import type { Product } from '@/types/content';

const base = PRODUCTS[0]!;
const withGallery: Product = {
  ...base,
  gallery: {
    texture: { slot: 'store-product-visual', instance: 'p1-texture' },
    label: { slot: 'store-product-visual', instance: 'p1-label' },
  },
};

describe('galleryViews', () => {
  it('sin vistas declaradas, la galería es sólo el visual del producto', () => {
    expect(galleryViews(base)).toEqual([
      { kind: 'cover', view: { slot: 'store-product-visual', instance: base.id } },
    ]);
  });

  it('añade las vistas declaradas tras el visual, en orden fijo (etiqueta, textura, en uso)', () => {
    expect(galleryViews(withGallery).map((v) => v.kind)).toEqual(['cover', 'label', 'texture']);
  });
});

describe('resolveProductView', () => {
  it('una vista declarada se devuelve tal cual', () => {
    expect(resolveProductView(withGallery, 'label')).toEqual({
      slot: 'store-product-visual',
      instance: 'p1-label',
    });
  });

  it('una vista que falta cae al visual del producto', () => {
    const cover = { slot: 'store-product-visual', instance: base.id };

    expect(resolveProductView(base, 'label')).toEqual(cover);
    expect(resolveProductView(withGallery, 'inUse')).toEqual(cover);
  });
});

describe('productSpecs', () => {
  it('sin dato no pinta nada: tamaño y contenido no se inventan', () => {
    expect(productSpecs(base)).toEqual([]);
  });

  it('pinta sólo los datos que existen', () => {
    expect(productSpecs({ ...base, sizeKey: 'store.products.p1.size' })).toEqual([
      { id: 'size', key: 'store.products.p1.size' },
    ]);
    expect(
      productSpecs({
        ...base,
        sizeKey: 'store.products.p1.size',
        contentsKey: 'store.products.p1.contents',
      }).map((s) => s.id),
    ).toEqual(['size', 'contents']);
  });
});
