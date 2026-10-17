import { describe, expect, it } from 'vitest';

import { STORE_SHOWCASE_IDS } from '@/config/store-showcase';
import { PRODUCTS } from '@/data';
import { featuredProducts } from '@/lib/store/showcase';

describe('store showcase selection', () => {
  it('shows three or four distinct products, all of them in the catalogue', () => {
    const ids = STORE_SHOWCASE_IDS as readonly string[];
    const catalogue = new Set(PRODUCTS.map((product) => product.id));

    expect(ids.length).toBeGreaterThanOrEqual(3);
    expect(ids.length).toBeLessThanOrEqual(4);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(catalogue.has(id), id).toBe(true);
  });

  it('keeps the order of the configured ids', () => {
    const products = [{ id: 'p1' }, { id: 'p2' }, { id: 'p3' }];

    expect(featuredProducts(['p3', 'p1'], products)).toEqual([{ id: 'p3' }, { id: 'p1' }]);
  });

  it('skips an id that is not in the catalogue instead of failing', () => {
    const products = [{ id: 'p1' }, { id: 'p2' }];

    expect(featuredProducts(['p2', 'pX', 'p1'], products)).toEqual([{ id: 'p2' }, { id: 'p1' }]);
  });
});
