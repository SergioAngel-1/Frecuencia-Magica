import { describe, expect, it } from 'vitest';

import { EDITORIAL_MEDIA_SLOTS } from '@/config/editorial-media';
import { zebraVariant } from '@/lib/editorial/zebra';

describe('zebraVariant', () => {
  it('is deterministic: the same slot always yields the same variant', () => {
    expect(zebraVariant('home.hero')).toEqual(zebraVariant('home.hero'));
  });

  it('keeps the angle inside the editorial range and the delay inside one sweep cycle', () => {
    for (const slot of EDITORIAL_MEDIA_SLOTS) {
      const { angle, delay } = zebraVariant(slot);

      expect(angle, slot).toBeGreaterThanOrEqual(112);
      expect(angle, slot).toBeLessThanOrEqual(134);
      expect(delay, slot).toBeLessThanOrEqual(0);
      expect(delay, slot).toBeGreaterThan(-2.4);
    }
  });

  it('spreads the slots over several angles so neighbouring bands differ', () => {
    const angles = new Set(EDITORIAL_MEDIA_SLOTS.map((slot) => zebraVariant(slot).angle));

    expect(angles.size).toBeGreaterThanOrEqual(3);
  });
});
