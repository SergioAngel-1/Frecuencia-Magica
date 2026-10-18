import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { useArrival } from '@/hooks/use-arrival';
import { useAtmosphereStore } from '@/stores/atmosphere-store';

describe('useArrival: la atmósfera sale del store (M5)', () => {
  beforeEach(() => {
    useAtmosphereStore.setState({ manual: null });
  });

  it('sin elección manual, pinta la noche', () => {
    const { result } = renderHook(() => useArrival());

    expect(result.current.atmosphere).toBe('night');
  });

  it('elegir una entrada fija la atmósfera en el store, y el hook la lee de ahí', () => {
    const { result } = renderHook(() => useArrival());

    act(() => result.current.choose('mood:calm'));

    expect(useAtmosphereStore.getState().manual).toBe('dawn');
    expect(result.current.atmosphere).toBe('dawn');
  });

  it('«elegir otra opción» parte de la atmósfera activa del store, no de un estado propio', () => {
    const { result } = renderHook(() => useArrival());
    act(() => result.current.choose('mood:calm'));

    // Descúbrete o el selector cambian la real: «otra opción» debe partir de ella.
    act(() => useAtmosphereStore.getState().setManual('forest'));
    act(() => result.current.other());

    const after = useAtmosphereStore.getState().manual;
    expect(after).not.toBe('forest');
    expect(result.current.atmosphere).toBe(after);
  });
});
