import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ATMOSPHERE_STORAGE_KEY } from '@/config/atmospheres';
import { useAtmosphereStore } from '@/stores/atmosphere-store';

/** Lo que escribe el middleware `persist` de Zustand en `localStorage`. */
const stored = () => {
  const raw = localStorage.getItem(ATMOSPHERE_STORAGE_KEY);
  return raw === null ? null : (JSON.parse(raw) as { state: { choice: unknown } });
};

describe('useAtmosphereStore', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.clear();
    useAtmosphereStore.setState({ choice: null });
  });

  it('arranca sin elección', () => {
    expect(useAtmosphereStore.getState().choice).toBeNull();
  });

  it('setChoice guarda la elección en localStorage con la clave fm.atmosphere', () => {
    useAtmosphereStore.getState().setChoice('dusk');

    expect(useAtmosphereStore.getState().choice).toBe('dusk');
    expect(stored()?.state.choice).toBe('dusk');
  });

  it('al rehidratar, un tema eliminado (study) se ignora', async () => {
    localStorage.setItem(
      ATMOSPHERE_STORAGE_KEY,
      JSON.stringify({ state: { choice: 'study' }, version: 1 }),
    );

    await useAtmosphereStore.persist.rehydrate();

    expect(useAtmosphereStore.getState().choice).toBeNull();
  });

  it('clear vuelve a null y lo refleja en el almacenamiento', () => {
    const { setChoice, clear } = useAtmosphereStore.getState();
    setChoice('moon');
    clear();

    expect(useAtmosphereStore.getState().choice).toBeNull();
    expect(stored()?.state.choice).toBeNull();
  });

  it('al rehidratar, un valor guardado inválido se ignora', async () => {
    localStorage.setItem(
      ATMOSPHERE_STORAGE_KEY,
      JSON.stringify({ state: { choice: 'constructor' }, version: 1 }),
    );

    await useAtmosphereStore.persist.rehydrate();

    expect(useAtmosphereStore.getState().choice).toBeNull();
  });

  it('al rehidratar, un JSON roto deja la elección en null sin lanzar', async () => {
    useAtmosphereStore.setState({ choice: null });
    localStorage.setItem(ATMOSPHERE_STORAGE_KEY, '{"state":');

    await expect(useAtmosphereStore.persist.rehydrate()).resolves.toBeUndefined();
    expect(useAtmosphereStore.getState().choice).toBeNull();
  });

  it('si localStorage no es legible, el store arranca sin elección y no lanza', async () => {
    useAtmosphereStore.setState({ choice: null });
    const spy = vi.spyOn(localStorage, 'getItem').mockImplementation(() => {
      throw new Error('SecurityError');
    });

    try {
      await expect(useAtmosphereStore.persist.rehydrate()).resolves.toBeUndefined();
      expect(useAtmosphereStore.getState().choice).toBeNull();
    } finally {
      spy.mockRestore();
    }
  });

  it('al rehidratar, un id válido guardado se recupera', async () => {
    localStorage.setItem(
      ATMOSPHERE_STORAGE_KEY,
      JSON.stringify({ state: { choice: 'forest' }, version: 1 }),
    );

    await useAtmosphereStore.persist.rehydrate();

    expect(useAtmosphereStore.getState().choice).toBe('forest');
  });
});
