import { beforeEach, describe, expect, it } from 'vitest';

import { useAmbientStore } from '@/stores/ambient-store';

describe('useAmbientStore', () => {
  beforeEach(() => {
    useAmbientStore.setState({ enabled: false });
  });

  it('el audio arranca apagado', () => {
    // Los navegadores bloquean audio sin gesto del usuario: obligatorio.
    expect(useAmbientStore.getState().enabled).toBe(false);
  });

  it('toggle alterna el estado', () => {
    const { toggle } = useAmbientStore.getState();
    toggle();
    expect(useAmbientStore.getState().enabled).toBe(true);
    toggle();
    expect(useAmbientStore.getState().enabled).toBe(false);
  });
});
