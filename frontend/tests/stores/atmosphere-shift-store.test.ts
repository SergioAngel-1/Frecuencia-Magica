import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ATMOSPHERE_SHIFT_TIMING } from '@/config/motion';
import { preloadTheme } from '@/lib/atmosphere/photo-preload';
import type { ShiftRequest } from '@/lib/atmosphere/shift';
import { useAtmosphereShiftStore } from '@/stores/atmosphere-shift-store';
import { useAtmosphereStore } from '@/stores/atmosphere-store';

vi.mock('@/lib/atmosphere/photo-preload', () => ({
  preloadTheme: vi.fn(),
}));

const preload = vi.mocked(preloadTheme);
const { full, quick } = ATMOSPHERE_SHIFT_TIMING;

const dusk: ShiftRequest = { choice: 'dusk', resolved: 'dusk', source: 'manual', feeling: null };
const auto: ShiftRequest = { choice: null, resolved: 'night', source: 'manual', feeling: null };

describe('useAtmosphereShiftStore', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    preload.mockReset();
    preload.mockResolvedValue(undefined);
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

  it('rechazar la confirmación no ejecuta lo que la emoción pedía (sonido, llegada guardada)', () => {
    const onApplied = vi.fn();
    const shift = useAtmosphereShiftStore.getState();
    shift.ask({ ...dusk, onApplied });
    shift.cancel();
    vi.runAllTimers();

    expect(onApplied).not.toHaveBeenCalled();
  });

  it('aceptar ejecuta onApplied bajo el velo, con el tema ya aplicado y no antes', () => {
    const onApplied = vi.fn(() => expect(useAtmosphereStore.getState().choice).toBe('dusk'));
    const shift = useAtmosphereShiftStore.getState();
    shift.ask({ ...dusk, onApplied });
    shift.confirm();

    vi.advanceTimersByTime(full.cover - 1);
    expect(onApplied).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(onApplied).toHaveBeenCalledTimes(1);
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

  it('recorre in → hold → out → idle con los tiempos de config', async () => {
    useAtmosphereShiftStore.getState().cross(dusk);

    await vi.advanceTimersByTimeAsync(full.cover);
    expect(useAtmosphereShiftStore.getState().phase).toBe('hold');

    await vi.advanceTimersByTimeAsync(full.hold);
    expect(useAtmosphereShiftStore.getState().phase).toBe('out');

    await vi.advanceTimersByTimeAsync(full.reveal);
    expect(useAtmosphereShiftStore.getState()).toMatchObject({ phase: 'idle', request: null });
  });

  it('el cruce reducido usa los tiempos de `quick`', async () => {
    useAtmosphereShiftStore.getState().cross(dusk, { mode: 'quick' });

    await vi.advanceTimersByTimeAsync(quick.cover + quick.hold + quick.reveal);
    expect(useAtmosphereShiftStore.getState().phase).toBe('idle');
    expect(useAtmosphereStore.getState().choice).toBe('dusk');
  });

  it('precarga el tema resuelto al empezar el cruce', () => {
    useAtmosphereShiftStore.getState().cross(dusk);

    expect(preload).toHaveBeenCalledWith('dusk');
  });

  it('la revelación espera a la precarga aunque `hold` ya haya pasado', async () => {
    let finish!: () => void;
    preload.mockReturnValue(
      new Promise<void>((resolve) => {
        finish = resolve;
      }),
    );

    useAtmosphereShiftStore.getState().cross(dusk);

    await vi.advanceTimersByTimeAsync(full.cover + full.hold);
    expect(useAtmosphereShiftStore.getState().phase).toBe('hold');
    expect(useAtmosphereStore.getState().choice).toBe('dusk');

    finish();
    await vi.advanceTimersByTimeAsync(0);
    expect(useAtmosphereShiftStore.getState().phase).toBe('out');

    await vi.advanceTimersByTimeAsync(full.reveal);
    expect(useAtmosphereShiftStore.getState()).toMatchObject({ phase: 'idle', request: null });
  });

  it('la precarga de un cruce viejo no adelanta al nuevo', async () => {
    let finishOld!: () => void;
    preload.mockReturnValueOnce(
      new Promise<void>((resolve) => {
        finishOld = resolve;
      }),
    );

    const shift = useAtmosphereShiftStore.getState();
    shift.cross(dusk);
    await vi.advanceTimersByTimeAsync(full.cover + full.hold);
    expect(useAtmosphereShiftStore.getState().phase).toBe('hold');

    // Se fuerza el reposo (como haría una cancelación) y arranca otro cruce.
    useAtmosphereShiftStore.setState({ phase: 'idle', request: null });
    preload.mockResolvedValueOnce(undefined);
    shift.cross({ ...dusk, choice: 'forest', resolved: 'forest' });

    await vi.advanceTimersByTimeAsync(full.cover + full.hold);
    expect(useAtmosphereShiftStore.getState().phase).toBe('out');

    finishOld();
    await vi.advanceTimersByTimeAsync(0);
    expect(useAtmosphereShiftStore.getState().phase).toBe('out');
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
