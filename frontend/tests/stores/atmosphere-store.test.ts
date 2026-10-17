import { beforeEach, describe, expect, it } from 'vitest';

import { ATMOSPHERE_STORAGE_KEY } from '@/config/atmospheres';
import { useAtmosphereStore } from '@/stores/atmosphere-store';

/** Lo que escribe el middleware `persist` de Zustand en `sessionStorage`. */
const stored = () => {
  const raw = sessionStorage.getItem(ATMOSPHERE_STORAGE_KEY);
  return raw === null ? null : (JSON.parse(raw) as { state: { manual: unknown } });
};

describe('useAtmosphereStore', () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
    useAtmosphereStore.setState({ manual: null });
  });

  it('arranca sin elección manual', () => {
    expect(useAtmosphereStore.getState().manual).toBeNull();
  });

  it('setManual guarda la elección en sessionStorage con la clave fm.atmosphere', () => {
    useAtmosphereStore.getState().setManual('dusk');

    expect(useAtmosphereStore.getState().manual).toBe('dusk');
    expect(stored()?.state.manual).toBe('dusk');
  });

  it('no escribe en localStorage: la elección dura la sesión', () => {
    useAtmosphereStore.getState().setManual('forest');

    expect(localStorage.getItem(ATMOSPHERE_STORAGE_KEY)).toBeNull();
  });

  it('clear vuelve a null y lo refleja en el almacenamiento', () => {
    const { setManual, clear } = useAtmosphereStore.getState();
    setManual('moon');
    clear();

    expect(useAtmosphereStore.getState().manual).toBeNull();
    expect(stored()?.state.manual).toBeNull();
  });

  it('al rehidratar, un valor guardado inválido se ignora', async () => {
    sessionStorage.setItem(
      ATMOSPHERE_STORAGE_KEY,
      JSON.stringify({ state: { manual: 'constructor' }, version: 0 }),
    );

    await useAtmosphereStore.persist.rehydrate();

    expect(useAtmosphereStore.getState().manual).toBeNull();
  });

  it('al rehidratar, un id válido guardado se recupera', async () => {
    sessionStorage.setItem(
      ATMOSPHERE_STORAGE_KEY,
      JSON.stringify({ state: { manual: 'marisol' }, version: 0 }),
    );

    await useAtmosphereStore.persist.rehydrate();

    expect(useAtmosphereStore.getState().manual).toBe('marisol');
  });
});
