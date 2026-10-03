import type { Product } from '@/types/content';

/**
 * Productos relacionados con `current`, para la fila "también para ti" del
 * detalle de producto.
 *
 * Prioriza los que comparten `catKey`; si no hay suficientes, completa con
 * el resto del catálogo en su orden original. Nunca incluye `current` ni
 * repite productos, y devuelve como máximo `count`.
 */
export function relatedProducts(
  current: Product,
  all: readonly Product[],
  count: number,
): Product[] {
  const others = all.filter((product) => product.id !== current.id);
  const sameCategory = others.filter((product) => product.catKey === current.catKey);
  const rest = others.filter((product) => product.catKey !== current.catKey);

  return [...sameCategory, ...rest].slice(0, Math.max(0, count));
}
