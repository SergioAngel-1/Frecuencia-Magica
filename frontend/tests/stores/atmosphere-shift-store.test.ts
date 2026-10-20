import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ATMOSPHERE_SHIFT_COVER_GRACE_MS, ATMOSPHERE_SHIFT_TIMING } from '@/config/motion';
import { preloadTheme } from '@/lib/atmosphere/photo-preload';
import type { ShiftRequest } from '@/lib/atmosphere/shift';
import { activeMood } from '@/lib/arrival/selected-mood';
import { useAtmosphereShiftStore } from '@/stores/atmosphere-shift-store';
import { useAtmosphereStore } from '@/stores/atmosphere-store';

vi.mock('@/lib/atmosphere/photo-preload', () => ({
  preloadTheme: vi.fn(),
}));

const preload = vi.mocked(preloadTheme);
const { full, quick } = ATMOSPHERE_SHIFT_TIMING;

/** El velo avisa de que ya cubre la pantalla (lo hace `AtmosphereShiftVeil` al acabar su fundido). */
const veilCovers = () => useAtmosphereShiftStore.getState().covered();

const dusk: ShiftRequest = { choice: 'dusk', resolved: 'dusk', source: 'manual', feeling: null };
const auto: ShiftRequest = { choice: null, resolved: 'night', source: 'manual', feeling: null };

describe('useAtmosphereShiftStore', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    preload.mockReset();
    preload.mockResolvedValue(undefined);
    localStorage.clear();
    useAtmosphereStore.setState({ choice: null, feeling: null });
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

  it('rechazar deja marcada la emoción que ya estaba, no la nueva', () => {
    useAtmosphereStore.setState({ choice: 'dusk', feeling: 'mood:tiredness' });
    const onApplied = vi.fn();
    const shift = useAtmosphereShiftStore.getState();

    shift.ask({
      choice: 'dawn',
      resolved: 'dawn',
      source: 'feeling',
      feeling: 'mood:calm',
      onApplied,
    });
    shift.cancel();

    const { choice, feeling } = useAtmosphereStore.getState();
    expect(activeMood(choice, feeling)).toBe('tiredness');
    expect(onApplied).not.toHaveBeenCalled();
  });

  it('aceptar deja marcada la emoción aplicada', () => {
    const shift = useAtmosphereShiftStore.getState();

    shift.ask({ choice: 'dawn', resolved: 'dawn', source: 'feeling', feeling: 'mood:calm' });
    shift.confirm();
    veilCovers();

    const { choice, feeling } = useAtmosphereStore.getState();
    expect(activeMood(choice, feeling)).toBe('calm');
  });

  it('aceptar ejecuta onApplied bajo el velo, con el tema ya aplicado y no antes', () => {
    const onApplied = vi.fn(() => expect(useAtmosphereStore.getState().choice).toBe('dusk'));
    const shift = useAtmosphereShiftStore.getState();
    shift.ask({ ...dusk, onApplied });
    shift.confirm();

    // Por mucho que pase el tiempo previsto del velo, mientras no avise de que cubre no se aplica.
    vi.advanceTimersByTime(full.cover);
    expect(onApplied).not.toHaveBeenCalled();

    veilCovers();
    expect(onApplied).toHaveBeenCalledTimes(1);
  });

  it('aceptar cruza: el tema se aplica cuando el velo ya cubre la pantalla, no antes', () => {
    const shift = useAtmosphereShiftStore.getState();
    shift.ask(dusk);
    shift.confirm();

    expect(useAtmosphereShiftStore.getState().phase).toBe('in');
    vi.advanceTimersByTime(full.cover);
    expect(useAtmosphereShiftStore.getState().phase).toBe('in');
    expect(useAtmosphereStore.getState().choice).toBeNull();

    veilCovers();
    expect(useAtmosphereShiftStore.getState().phase).toBe('hold');
    expect(useAtmosphereStore.getState().choice).toBe('dusk');
  });

  /**
   * Regresión: el tema se aplicaba con un temporizador armado al pedir el cambio, pero el velo es una
   * animación que arranca después de pintar. En el momento de aplicar el tema el velo estaba entre el
   * 57 % y el 92 % de opacidad y la onda a un 83–95 % de su recorrido: el cambio se veía a través.
   */
  it('si el velo no avisa, el tema se aplica igualmente al pasar el plazo de respaldo', () => {
    const shift = useAtmosphereShiftStore.getState();
    shift.ask(dusk);
    shift.confirm();

    vi.advanceTimersByTime(full.cover + ATMOSPHERE_SHIFT_COVER_GRACE_MS - 1);
    expect(useAtmosphereStore.getState().choice).toBeNull();

    vi.advanceTimersByTime(1);
    expect(useAtmosphereShiftStore.getState().phase).toBe('hold');
    expect(useAtmosphereStore.getState().choice).toBe('dusk');
  });

  it('el aviso del velo y el plazo de respaldo no aplican el tema dos veces', () => {
    const onApplied = vi.fn();
    useAtmosphereShiftStore.getState().cross({ ...dusk, onApplied });

    veilCovers();
    veilCovers();
    vi.advanceTimersByTime(full.cover + ATMOSPHERE_SHIFT_COVER_GRACE_MS);

    expect(onApplied).toHaveBeenCalledTimes(1);
  });

  it('el aviso del velo fuera de un cruce en `in` no hace nada', () => {
    veilCovers();
    expect(useAtmosphereShiftStore.getState().phase).toBe('idle');

    useAtmosphereShiftStore.getState().cross(dusk);
    veilCovers();
    expect(useAtmosphereShiftStore.getState().phase).toBe('hold');

    veilCovers();
    expect(useAtmosphereShiftStore.getState().phase).toBe('hold');
  });

  it('recorre in → hold → out → idle con los tiempos de config', async () => {
    useAtmosphereShiftStore.getState().cross(dusk);

    veilCovers();
    expect(useAtmosphereShiftStore.getState().phase).toBe('hold');

    await vi.advanceTimersByTimeAsync(full.hold);
    expect(useAtmosphereShiftStore.getState().phase).toBe('out');

    await vi.advanceTimersByTimeAsync(full.reveal);
    expect(useAtmosphereShiftStore.getState()).toMatchObject({ phase: 'idle', request: null });
  });

  it('el cruce reducido usa los tiempos de `quick`', async () => {
    useAtmosphereShiftStore.getState().cross(dusk, { mode: 'quick' });

    veilCovers();
    await vi.advanceTimersByTimeAsync(quick.hold + quick.reveal);
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

    veilCovers();
    await vi.advanceTimersByTimeAsync(full.hold);
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
    veilCovers();
    await vi.advanceTimersByTimeAsync(full.hold);
    expect(useAtmosphereShiftStore.getState().phase).toBe('hold');

    // Se fuerza el reposo (como haría una cancelación) y arranca otro cruce.
    useAtmosphereShiftStore.setState({ phase: 'idle', request: null });
    preload.mockResolvedValueOnce(undefined);
    shift.cross({ ...dusk, choice: 'forest', resolved: 'forest' });

    veilCovers();
    await vi.advanceTimersByTimeAsync(full.hold);
    expect(useAtmosphereShiftStore.getState().phase).toBe('out');

    finishOld();
    await vi.advanceTimersByTimeAsync(0);
    expect(useAtmosphereShiftStore.getState().phase).toBe('out');
  });

  it('«según cómo te sientes» borra la elección guardada', () => {
    useAtmosphereStore.setState({ choice: 'dawn' });
    useAtmosphereShiftStore.getState().cross(auto);

    veilCovers();
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
