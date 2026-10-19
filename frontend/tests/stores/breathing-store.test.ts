import { beforeEach, describe, expect, it } from 'vitest';

import { useBreathingStore } from '@/stores/breathing-store';

describe('breathing store', () => {
  beforeEach(() => useBreathingStore.setState({ open: false }));

  it('starts closed', () => {
    expect(useBreathingStore.getState().open).toBe(false);
  });

  it('opens and closes the one guide every trigger shares', () => {
    useBreathingStore.getState().show();
    expect(useBreathingStore.getState().open).toBe(true);
    useBreathingStore.getState().hide();
    expect(useBreathingStore.getState().open).toBe(false);
  });
});
