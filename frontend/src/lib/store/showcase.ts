/**
 * Selección de productos destacados: sigue el orden de `ids` (la config) y
 * descarta los que no existan en el catálogo, sin lanzar.
 */
export function featuredProducts<T extends { id: string }>(
  ids: readonly string[],
  products: readonly T[],
): T[] {
  const byId = new Map(products.map((product) => [product.id, product]));

  return ids.flatMap((id) => {
    const product = byId.get(id);

    return product ? [product] : [];
  });
}
