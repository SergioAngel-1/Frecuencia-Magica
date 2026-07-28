import { describe, expect, it } from 'vitest';

import { PRODUCTS } from '@/data';
import { cartCount, cartLines, cartSubtotal, cartTotal, shippingCost } from '@/lib/cart/totals';

const items = { p1: 2, p3: 1 };

describe('cartLines', () => {
  it('agrupa por producto con su cantidad', () => {
    const lines = cartLines(items, PRODUCTS);
    const p1 = lines.find((l) => l.product.id === 'p1');
    expect(p1?.quantity).toBe(2);
    expect(p1?.lineTotal).toBe(56);
  });

  it('ignora ids de producto desconocidos', () => {
    const lines = cartLines({ ...items, inexistente: 3 }, PRODUCTS);
    expect(lines).toHaveLength(2);
  });
});

describe('cartSubtotal', () => {
  it('suma precio por cantidad', () => {
    expect(cartSubtotal(items, PRODUCTS)).toBe(78);
  });

  it('carrito vacío suma cero', () => {
    expect(cartSubtotal({}, PRODUCTS)).toBe(0);
  });
});

describe('shippingCost', () => {
  it('es gratis por encima de cincuenta', () => {
    expect(shippingCost(78)).toBe(0);
  });

  it('cuesta seis por debajo de cincuenta', () => {
    expect(shippingCost(28)).toBe(6);
  });

  it('es exactamente seis en el límite de cincuenta', () => {
    expect(shippingCost(50)).toBe(6);
  });

  it('carrito vacío no paga envío', () => {
    expect(shippingCost(0)).toBe(0);
  });
});

describe('cartTotal', () => {
  it('suma subtotal y envío', () => {
    expect(cartTotal(28)).toBe(34);
    expect(cartTotal(78)).toBe(78);
  });
});

describe('cartCount', () => {
  it('suma todas las unidades', () => {
    expect(cartCount(items)).toBe(3);
  });

  it('carrito vacío devuelve cero', () => {
    expect(cartCount({})).toBe(0);
  });
});
