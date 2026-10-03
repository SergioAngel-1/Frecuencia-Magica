import { describe, expect, it } from 'vitest';

import { simulatePayment } from '@/lib/store/payment';

describe('simulatePayment', () => {
  it('approves when the injected random is above the decline threshold', () => {
    expect(simulatePayment(() => 0.99)).toBe('ok');
    expect(simulatePayment(() => 0.5)).toBe('ok');
  });

  it('declines when the injected random falls under the decline threshold', () => {
    expect(simulatePayment(() => 0.05)).toBe('declined');
    expect(simulatePayment(() => 0.14)).toBe('declined');
  });

  it('accepts the threshold boundary as an approval', () => {
    expect(simulatePayment(() => 0.15)).toBe('ok');
    expect(simulatePayment(() => 0.1499)).toBe('declined');
  });

  it('is deterministic for a seeded random source', () => {
    const values = [0.1, 0.9, 0.2, 0.8];
    let index = 0;
    const seeded = () => values[index++]!;

    expect([simulatePayment(seeded), simulatePayment(seeded)]).toEqual(['declined', 'ok']);

    index = 0;
    expect([simulatePayment(seeded), simulatePayment(seeded)]).toEqual(['declined', 'ok']);
  });
});
