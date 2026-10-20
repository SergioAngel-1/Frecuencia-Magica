import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const route = vi.hoisted(() => ({ pathname: '/' }));

// El portal (`/`) es el umbral: ahí el tema se aplica sin cruce, que es lo que estos tests miden.
// Los que necesitan la confirmación mueven `route.pathname` a otra vista.
vi.mock('@/i18n/navigation', () => ({ usePathname: () => route.pathname }));

import { ATMOSPHERE_SHIFT_TIMING } from '@/config/motion';
import { useArrival } from '@/hooks/use-arrival';
import { useArrivalStore } from '@/stores/arrival-store';
import { useAtmosphereShiftStore } from '@/stores/atmosphere-shift-store';
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

describe('useArrival: la emoción no se adhiere hasta que el tema se aplica', () => {
  beforeEach(() => {
    route.pathname = '/resonario';
    localStorage.clear();
    useAtmosphereStore.setState({ choice: null, feeling: null });
    useArrivalStore.setState({ key: null });
    useAtmosphereShiftStore.setState({ phase: 'idle', mode: 'full', request: null, origin: null });
  });

  afterEach(() => {
    route.pathname = '/';
  });

  it('rechazar la confirmación no escribe el ánimo, ni la llegada, ni el flujo', () => {
    const onApplied = vi.fn();
    const { result } = renderHook(() => useArrival());

    act(() => result.current.pick('mood:tiredness', { onApplied }));

    expect(useAtmosphereShiftStore.getState().phase).toBe('confirming');
    expect(onApplied).not.toHaveBeenCalled();
    expect(useAtmosphereStore.getState()).toMatchObject({ choice: null, feeling: null });
    expect(useArrivalStore.getState().key).toBeNull();
    expect(result.current.flow.key).toBeNull();

    act(() => useAtmosphereShiftStore.getState().cancel());

    expect(onApplied).not.toHaveBeenCalled();
    expect(useAtmosphereStore.getState()).toMatchObject({ choice: null, feeling: null });
    expect(useArrivalStore.getState().key).toBeNull();
    expect(result.current.flow.key).toBeNull();
  });

  it('aceptar aplica el tema y sólo entonces escribe el ánimo y la llegada', () => {
    vi.useFakeTimers();
    try {
      const onApplied = vi.fn();
      const { result } = renderHook(() => useArrival());

      act(() => result.current.pick('mood:tiredness', { onApplied }));
      act(() => useAtmosphereShiftStore.getState().confirm());

      act(() => vi.advanceTimersByTime(ATMOSPHERE_SHIFT_TIMING.full.cover));

      expect(onApplied).toHaveBeenCalledTimes(1);
      expect(useAtmosphereStore.getState()).toMatchObject({
        choice: 'dusk',
        feeling: 'mood:tiredness',
      });
      expect(useArrivalStore.getState().key).toBe('mood:tiredness');
      expect(result.current.flow.key).toBe('mood:tiredness');
    } finally {
      vi.clearAllTimers();
      vi.useRealTimers();
    }
  });
});
