import { beforeEach, describe, expect, it } from 'vitest';

import { useNavMenuStore } from '@/stores/nav-menu-store';

describe('nav menu store', () => {
  beforeEach(() => useNavMenuStore.setState({ open: false }));

  it('starts closed', () => {
    expect(useNavMenuStore.getState().open).toBe(false);
  });

  it('opens and closes the one menu every trigger shares', () => {
    useNavMenuStore.getState().openMenu();
    expect(useNavMenuStore.getState().open).toBe(true);
    useNavMenuStore.getState().closeMenu();
    expect(useNavMenuStore.getState().open).toBe(false);
  });
});
