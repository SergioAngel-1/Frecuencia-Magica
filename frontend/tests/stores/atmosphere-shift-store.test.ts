import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ATMOSPHERE_SHIFT_TIMING } from '@/config/motion';
import type { ShiftRequest } from '@/lib/atmosphere/shift';
import { useAtmosphereShiftStore } from '@/stores/atmosphere-shift-store';
import { useAtmosphereStore } from '@/stores/atmosphere-store';

const { full, quick } = ATMOSPHERE_SHIFT_TIMING;

const dusk: ShiftRequest = { choice: 'dusk', resolved: 'dusk', source: 'manual', feeling: null };
const auto: ShiftRequest = { choice: null, resolved: 'night', source: 'manual', feeling: null };

describe('useAtmosphereShiftStore', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
    useAtmosphereStore.setState({ choice: null });
    useAtmosphereShiftStore.setState({ phase: 'idle', mode: 'full', request: null, origin: null });
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('pedir confirmación no cambia el tema', () => {
    useAtmosphereShiftStore.getState().ask(dusk);

    expect(useAtmosphereShiftStore.getState().phase).toBe('confirming');
    expect(useAtmosphereStore.getState().choice).toBeNull();
  });

  it('rechazar la confirmación vuelve al reposo sin tocar el tema', () => {
    const shift = useAtmosphereShiftStore.getState();
    shift.ask(dusk);
    shift.cancel();

    expect(useAtmosphereShiftStore.getState()).toMatchObject({ phase: 'idle', request: null });
    expect(useAtmosphereStore.getState().choice).toBeNull();
  });

  it('aceptar cruza: el tema se aplica al cubrir la pantalla, no antes', () => {
    const shift = useAtmosphereShiftStore.getState();
    shift.ask(dusk);
    shift.confirm();

    expect(useAtmosphereShiftStore.getState().phase).toBe('in');
    vi.advanceTimersByTime(full.cover - 1);
    expect(useAtmosphereStore.getState().choice).toBeNull();

    vi.advanceTimersByTime(1);
    expect(useAtmosphereShiftStore.getState().phase).toBe('hold');
    expect(useAtmosphereStore.getState().choice).toBe('dusk');
  });

  it('recorre in → hold → out → idle con los tiempos de config', () => {
    useAtmosphereShiftStore.getState().cross(dusk);

    vi.advanceTimersByTime(full.cover + full.hold);
    expect(useAtmosphereShiftStore.getState().phase).toBe('out');

    vi.advanceTimersByTime(full.reveal);
    expect(useAtmosphereShiftStore.getState()).toMatchObject({ phase: 'idle', request: null });
  });

  it('el cruce reducido usa los tiempos de `quick`', () => {
    useAtmosphereShiftStore.getState().cross(dusk, { mode: 'quick' });

    vi.advanceTimersByTime(quick.cover + quick.hold + quick.reveal);
    expect(useAtmosphereShiftStore.getState().phase).toBe('idle');
    expect(useAtmosphereStore.getState().choice).toBe('dusk');
  });

  it('«según cómo te sientes» borra la elección guardada', () => {
    useAtmosphereStore.setState({ choice: 'dawn' });
    useAtmosphereShiftStore.getState().cross(auto);

    vi.advanceTimersByTime(full.cover);
    expect(useAtmosphereStore.getState().choice).toBeNull();
  });

  it('un cruce en marcha no se pisa', () => {
    const shift = useAtmosphereShiftStore.getState();
    shift.cross(dusk);
    shift.cross({ ...dusk, choice: 'forest', resolved: 'forest' });
    shift.ask(auto);

    expect(useAtmosphereShiftStore.getState().request?.choice).toBe('dusk');
    expect(useAtmosphereShiftStore.getState().phase).toBe('in');
  });

  it('confirmar sin haber pedido confirmación no hace nada', () => {
    useAtmosphereShiftStore.getState().confirm();

    expect(useAtmosphereShiftStore.getState().phase).toBe('idle');
  });
});
