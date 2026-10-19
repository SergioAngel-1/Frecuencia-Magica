import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useArrival } from '@/hooks/use-arrival';
import { useArrivalStore } from '@/stores/arrival-store';
import { useAtmosphereStore } from '@/stores/atmosphere-store';
import { usePlayerStore } from '@/stores/player-store';

describe('useArrival: la atmósfera sale del store (M5)', () => {
  beforeEach(() => {
    useAtmosphereStore.setState({ choice: null });
    useArrivalStore.setState({ key: null });
    usePlayerStore.setState({ audioId: null });
  });

  it('sin elección, pinta la noche', () => {
    const { result } = renderHook(() => useArrival());

    expect(result.current.atmosphere).toBe('night');
  });

  it('elegir una entrada fija la atmósfera en el store, y el hook la lee de ahí', () => {
    const { result } = renderHook(() => useArrival());

    act(() => result.current.choose('mood:calm'));

    expect(useAtmosphereStore.getState().choice).toBe('dawn');
    expect(result.current.atmosphere).toBe('dawn');
  });

  it('«elegir otra opción» parte de la atmósfera activa del store, no de un estado propio', () => {
    const { result } = renderHook(() => useArrival());
    act(() => result.current.choose('mood:calm'));

    // Descúbrete o el selector cambian la real: «otra opción» debe partir de ella.
    act(() => useAtmosphereStore.getState().setChoice('forest'));
    act(() => result.current.other());

    const after = useAtmosphereStore.getState().choice;
    expect(after).not.toBe('forest');
    expect(result.current.atmosphere).toBe(after);
  });
});

describe('useArrival: elegir sin sonar y restaurar la última llegada', () => {
  beforeEach(() => {
    useAtmosphereStore.setState({ choice: null });
    useArrivalStore.setState({ key: null });
    usePlayerStore.setState({ audioId: null });
  });

  it('pick fija tema y entrada guardada, pero no abre ninguna pista', () => {
    const { result } = renderHook(() => useArrival());

    act(() => result.current.pick('mood:tiredness'));

    expect(useArrivalStore.getState().key).toBe('mood:tiredness');
    expect(useAtmosphereStore.getState().choice).toBe('dusk');
    expect(result.current.flow.key).toBe('mood:tiredness');
    expect(usePlayerStore.getState().audioId).toBeNull();
  });

  it('choose sí abre la primera pista (el gesto de la Home) y pick no', () => {
    const originalOpen = usePlayerStore.getState().open;
    const open = vi.fn();
    usePlayerStore.setState({ open });

    try {
      const { result } = renderHook(() => useArrival());

      act(() => result.current.pick('mood:calm'));
      expect(open).not.toHaveBeenCalled();

      act(() => result.current.choose('mood:calm'));
      expect(open).toHaveBeenCalledTimes(1);
    } finally {
      usePlayerStore.setState({ open: originalOpen });
    }
  });

  it('con restore, la última llegada guardada aparece sin sonar ni cambiar el tema', () => {
    useArrivalStore.setState({ key: 'mood:nostalgia' });
    useAtmosphereStore.setState({ choice: 'forest' });

    const { result } = renderHook(() => useArrival({ restore: true }));

    expect(result.current.flow.key).toBe('mood:nostalgia');
    expect(result.current.flow.response).not.toBeNull();
    expect(usePlayerStore.getState().audioId).toBeNull();
    expect(useAtmosphereStore.getState().choice).toBe('forest');
  });

  it('sin restore, la vista no hereda la llegada guardada (Descúbrete)', () => {
    useArrivalStore.setState({ key: 'mood:nostalgia' });

    const { result } = renderHook(() => useArrival());

    expect(result.current.flow.key).toBeNull();
  });

  it('sin llegada guardada, restore deja el flujo vacío', () => {
    const { result } = renderHook(() => useArrival({ restore: true }));

    expect(result.current.flow.key).toBeNull();
  });
});
