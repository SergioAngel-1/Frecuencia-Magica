'use client';

import { PRODUCTS } from '@/data/products';
import { cartLines } from '@/lib/cart/totals';
import { useCartStore } from '@/stores/cart-store';

/** Unidades del carrito que cuentan en la navegación (sólo productos del catálogo). */
export function useCartCount(): number {
  const items = useCartStore((state) => state.items);

  return cartLines(items, PRODUCTS).reduce((sum, line) => sum + line.quantity, 0);
}
