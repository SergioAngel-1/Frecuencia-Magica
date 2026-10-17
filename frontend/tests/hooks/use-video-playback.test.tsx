import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useVideoPlayback } from '@/hooks/use-video-playback';

describe('useVideoPlayback sin fuente', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('no simula: tocar play no pone el video en marcha ni avanza el reloj', () => {
    const { result } = renderHook(() => useVideoPlayback(undefined, 1560));

    act(() => result.current.toggle());
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(result.current.playing).toBe(false);
    expect(result.current.elapsed).toBe(0);
  });

  it('mantiene la duración conocida, sin moverla', () => {
    const { result } = renderHook(() => useVideoPlayback(undefined, 1560));

    expect(result.current.total).toBe(1560);
  });
});
