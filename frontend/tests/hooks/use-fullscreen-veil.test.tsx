import { createRef } from 'react';
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useFullscreenVeil } from '@/hooks/use-fullscreen-veil';

describe('useFullscreenVeil', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('empieza sin velo y sin pantalla completa', () => {
    const ref = createRef<HTMLDivElement>();
    const { result } = renderHook(() => useFullscreenVeil(ref));

    expect(result.current.veil).toBe('clear');
    expect(result.current.fullscreen).toBe(false);
  });

  it('funde a la noche antes de pedir pantalla completa', () => {
    const ref = createRef<HTMLDivElement>();
    const { result } = renderHook(() => useFullscreenVeil(ref));

    act(() => result.current.toggleFullscreen());
    expect(result.current.veil).toBe('fade');
  });
});
