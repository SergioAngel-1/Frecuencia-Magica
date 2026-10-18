import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useIdleControls } from '@/hooks/use-idle-controls';

/** Debe coincidir con `CONTROLS_IDLE_MS` del hook. */
const CONTROLS_IDLE_MS = 2600;

describe('useIdleControls', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('no se retira si el video está en pausa', () => {
    const { result } = renderHook(() => useIdleControls(false));

    act(() => {
      vi.advanceTimersByTime(CONTROLS_IDLE_MS * 2);
    });

    expect(result.current.quiet).toBe(false);
  });

  it('se retira tras el tiempo de inactividad mientras suena', () => {
    const { result } = renderHook(() => useIdleControls(true));

    act(() => {
      vi.advanceTimersByTime(CONTROLS_IDLE_MS - 1);
    });
    expect(result.current.quiet).toBe(false);

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current.quiet).toBe(true);
  });

  it('wake la trae de vuelta y reinicia la cuenta', () => {
    const { result } = renderHook(() => useIdleControls(true));

    act(() => {
      vi.advanceTimersByTime(CONTROLS_IDLE_MS);
    });
    expect(result.current.quiet).toBe(true);

    act(() => result.current.wake());
    expect(result.current.quiet).toBe(false);

    act(() => {
      vi.advanceTimersByTime(CONTROLS_IDLE_MS);
    });
    expect(result.current.quiet).toBe(true);
  });
});
