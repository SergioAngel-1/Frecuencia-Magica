import type { Product } from '@/types/content';

export type CartLine = {
  product: Product;
  quantity: number;
  lineTotal: number;
};

export function cartLines(
  items: Record<string, number>,
  products: readonly Product[],
): CartLine[] {
  return Object.entries(items)
    .map(([id, quantity]) => {
      const product = products.find((p) => p.id === id);
      if (!product) return null;

      return {
        product,
        quantity,
        lineTotal: product.price * quantity,
      };
    })
    .filter((line): line is CartLine => line !== null);
}

export function cartSubtotal(
  items: Record<string, number>,
  products: readonly Product[],
): number {
  return cartLines(items, products).reduce((sum, line) => sum + line.lineTotal, 0);
}

export function shippingCost(subtotal: number): number {
  if (subtotal <= 0) return 0;
  if (subtotal > 50) return 0;
  return 6;
}

export function cartTotal(subtotal: number): number {
  return subtotal + shippingCost(subtotal);
}

export function cartCount(items: Record<string, number>): number {
  return Object.values(items).reduce((sum, qty) => sum + qty, 0);
}
