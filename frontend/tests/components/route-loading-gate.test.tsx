import { act, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { RouteLoadingGate } from '@/components/layout/route-loading-gate';
import { useRouteWaitStore } from '@/stores/route-wait-store';

const fallbacks = () => useRouteWaitStore.getState().fallbacks;
const reset = () => useRouteWaitStore.setState({ hydrated: false, fallbacks: 0 });

/**
 * La escena de un `loading.tsx` en una carga directa va en el árbol, como siempre. En una navegación
 * del cliente se oculta y deja el relevo a la espera de `RouteTransition`: con el fallback dentro de
 * la página, la escena aparecía al 100 % en el contenedor que salía (ya con el tema nuevo y el fondo
 * a medio fundir), se desvanecía con su salida y volvía a entrar con el contenedor nuevo: un
 * parpadeo antes del loader de verdad.
 */
describe('RouteLoadingGate', () => {
  beforeEach(reset);
  afterEach(reset);

  const scene = <p data-testid="scene">Reuniendo la luz…</p>;

  it('en una carga directa pinta la escena y no avisa a nadie', () => {
    const view = render(<RouteLoadingGate>{scene}</RouteLoadingGate>);

    expect(view.queryByTestId('scene')).not.toBeNull();
    expect(fallbacks()).toBe(0);
  });

  it('en una navegación del cliente no pinta la escena: avisa de que hay un fallback en espera', () => {
    useRouteWaitStore.getState().markHydrated();
    const view = render(<RouteLoadingGate>{scene}</RouteLoadingGate>);

    expect(view.queryByTestId('scene')).toBeNull();
    expect(fallbacks()).toBe(1);
  });

  it('al llegar la vista (el fallback se desmonta) retira el aviso', () => {
    useRouteWaitStore.getState().markHydrated();
    const view = render(<RouteLoadingGate>{scene}</RouteLoadingGate>);

    act(() => view.unmount());

    expect(fallbacks()).toBe(0);
  });

  it('la escena de una carga directa sigue en el árbol aunque la app hidrate después', () => {
    const view = render(<RouteLoadingGate>{scene}</RouteLoadingGate>);

    act(() => useRouteWaitStore.getState().markHydrated());

    expect(view.queryByTestId('scene')).not.toBeNull();
    expect(fallbacks()).toBe(0);
  });
});
