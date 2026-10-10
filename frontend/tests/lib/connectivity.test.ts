import { describe, expect, it, vi } from 'vitest';

import { readOnline, subscribeConnectivity, type ConnectivityTarget } from '@/lib/connectivity';

function fakeTarget() {
  const listeners = new Map<string, Set<() => void>>();
  const target: ConnectivityTarget = {
    addEventListener: (type, listener) => {
      if (!listeners.has(type)) listeners.set(type, new Set());
      listeners.get(type)!.add(listener);
    },
    removeEventListener: (type, listener) => {
      listeners.get(type)?.delete(listener);
    },
  };
  const emit = (type: 'online' | 'offline') => listeners.get(type)?.forEach((fn) => fn());
  const count = () => [...listeners.values()].reduce((sum, set) => sum + set.size, 0);

  return { target, emit, count };
}

describe('connectivity', () => {
  it('notifies both when the network drops and when it returns', () => {
    const { target, emit } = fakeTarget();
    const onChange = vi.fn();

    subscribeConnectivity(target, onChange);
    emit('offline');
    emit('online');

    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it('removes every listener on unsubscribe', () => {
    const { target, emit, count } = fakeTarget();
    const onChange = vi.fn();

    const unsubscribe = subscribeConnectivity(target, onChange);
    expect(count()).toBe(2);

    unsubscribe();
    emit('offline');

    expect(count()).toBe(0);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('only reports offline when the browser says so', () => {
    expect(readOnline({ onLine: false })).toBe(false);
    expect(readOnline({ onLine: true })).toBe(true);
    expect(readOnline({})).toBe(true);
    expect(readOnline(undefined)).toBe(true);
  });
});
