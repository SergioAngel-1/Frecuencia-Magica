import type { Product, ProductView, ProductViewKind } from '@/types/content';

/** Orden fijo de las vistas opcionales tras el visual del producto. */
const OPTIONAL_VIEWS: readonly ProductViewKind[] = ['label', 'texture', 'inUse'];

export type GalleryViewKind = 'cover' | ProductViewKind;

export type GalleryView = { kind: GalleryViewKind; view: ProductView };

/** El visual propio del producto: el slot e instancia de su tarjeta. */
function coverView(product: Product): ProductView {
  return { slot: 'store-product-visual', instance: product.id };
}

/**
 * Vistas que el producto sí tiene: su visual y, tras él, las que declara. Una
 * vista sin foto no aparece: la galería no repite el visual para llenar huecos.
 */
export function galleryViews(product: Product): GalleryView[] {
  const views: GalleryView[] = [{ kind: 'cover', view: coverView(product) }];

  for (const kind of OPTIONAL_VIEWS) {
    const view = product.gallery?.[kind];
    if (view) views.push({ kind, view });
  }

  return views;
}

/** La vista pedida, o el visual del producto si no la declara. */
export function resolveProductView(product: Product, kind: ProductViewKind): ProductView {
  return product.gallery?.[kind] ?? coverView(product);
}

export type ProductSpec = { id: 'size' | 'contents'; key: string };

/** Tamaño y contenido que el producto declara; sin dato no hay fila (no se inventa). */
export function productSpecs(product: Product): ProductSpec[] {
  const specs: ProductSpec[] = [];

  if (product.sizeKey) specs.push({ id: 'size', key: product.sizeKey });
  if (product.contentsKey) specs.push({ id: 'contents', key: product.contentsKey });

  return specs;
}
