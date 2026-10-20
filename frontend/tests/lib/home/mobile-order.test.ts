import { describe, expect, it } from 'vitest';

import { NAV_REALMS } from '@/config/realms';
import { mobileOrder } from '@/lib/home/realm-cards';

/** Paso numérico de la clase `order-*`; fuera del menú no hay paso. */
const stepOf = (id: (typeof NAV_REALMS)[number]['id']) => {
  const match = mobileOrder(id)?.match(/^order-(\d+)$/);

  return match ? Number(match[1]) : Number.POSITIVE_INFINITY;
};

describe('mobile realm order', () => {
  it('follows the menu order', () => {
    const byMobileOrder = [...NAV_REALMS]
      .sort((a, b) => stepOf(a.id) - stepOf(b.id))
      .map((realm) => realm.id);

    expect(byMobileOrder).toEqual(NAV_REALMS.map((realm) => realm.id));
  });

  it('gives every navigation realm its own step', () => {
    const classes = NAV_REALMS.map((realm) => mobileOrder(realm.id));

    expect(classes).toEqual(['order-1', 'order-2', 'order-3', 'order-4', 'order-5', 'order-6']);
    expect(new Set(classes).size).toBe(NAV_REALMS.length);
  });
});
