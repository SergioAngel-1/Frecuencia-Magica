import { beforeEach, describe, expect, it } from 'vitest';

import { useCartStore } from '@/stores/cart-store';

describe('useCartStore', () => {
  beforeEach(() => {
    useCartStore.setState({ items: {} });
  });

  it('el carrito arranca vacío', () => {
    expect(useCartStore.getState().items).toEqual({});
  });

  it('añadir el mismo producto incrementa su cantidad', () => {
    useCartStore.getState().add('p1');
    useCartStore.getState().add('p1');
    const items = useCartStore.getState().items;
    expect(items.p1).toBe(2);
    expect(Object.keys(items)).toHaveLength(1);
  });

  it('quitar decrementa la cantidad', () => {
    useCartStore.getState().add('p1');
    useCartStore.getState().add('p1');
    useCartStore.getState().add('p1');
    useCartStore.getState().remove('p1');
    expect(useCartStore.getState().items.p1).toBe(2);
  });

  it('quitar la última unidad elimina la entrada', () => {
    useCartStore.getState().add('p1');
    useCartStore.getState().remove('p1');
    expect(useCartStore.getState().items.p1).toBeUndefined();
  });

  it('fijar cantidad a cero elimina la entrada', () => {
    useCartStore.getState().add('p1');
    useCartStore.getState().setQuantity('p1', 0);
    expect(useCartStore.getState().items.p1).toBeUndefined();
  });

  it('vaciar deja el carrito vacío', () => {
    useCartStore.getState().add('p1');
    useCartStore.getState().add('p2');
    useCartStore.getState().clear();
    expect(useCartStore.getState().items).toEqual({});
  });
});
