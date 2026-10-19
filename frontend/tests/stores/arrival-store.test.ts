import { beforeEach, describe, expect, it } from 'vitest';

import { ARRIVAL_STORAGE_KEY } from '@/config/arrivals';
import { useArrivalStore } from '@/stores/arrival-store';

/** Lo que escribe el middleware `persist` de Zustand en `localStorage`. */
const stored = () => {
  const raw = localStorage.getItem(ARRIVAL_STORAGE_KEY);
  return raw === null ? null : (JSON.parse(raw) as { state: { key: unknown } });
};

describe('useArrivalStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useArrivalStore.setState({ key: null });
  });

  it('arranca sin elección', () => {
    expect(useArrivalStore.getState().key).toBeNull();
  });

  it('setKey guarda la clave en localStorage con la clave fm.arrival', () => {
    useArrivalStore.getState().setKey('mood:calm');

    expect(useArrivalStore.getState().key).toBe('mood:calm');
    expect(stored()?.state.key).toBe('mood:calm');
  });

  it('al rehidratar, una clave válida (intención) se conserva', async () => {
    localStorage.setItem(
      ARRIVAL_STORAGE_KEY,
      JSON.stringify({ state: { key: 'intent:rest' }, version: 1 }),
    );

    await useArrivalStore.persist.rehydrate();

    expect(useArrivalStore.getState().key).toBe('intent:rest');
  });

  it('al rehidratar, una clave que no está en ARRIVALS se descarta', async () => {
    localStorage.setItem(
      ARRIVAL_STORAGE_KEY,
      JSON.stringify({ state: { key: 'mood:inventada' }, version: 1 }),
    );

    await useArrivalStore.persist.rehydrate();

    expect(useArrivalStore.getState().key).toBeNull();
  });

  it('al rehidratar, un valor no textual o un nombre del prototipo de objeto se descarta', async () => {
    for (const key of [42, { id: 'calm' }, 'toString', null]) {
      localStorage.setItem(ARRIVAL_STORAGE_KEY, JSON.stringify({ state: { key }, version: 1 }));

      await useArrivalStore.persist.rehydrate();

      expect(useArrivalStore.getState().key).toBeNull();
    }
  });

  it('clear vuelve a null y lo refleja en el almacenamiento', () => {
    const { setKey, clear } = useArrivalStore.getState();
    setKey('mood:joy');
    clear();

    expect(useArrivalStore.getState().key).toBeNull();
    expect(stored()?.state.key).toBeNull();
  });
});
