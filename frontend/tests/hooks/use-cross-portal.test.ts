import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// El router de `@/i18n/navigation` depende del árbol de Next (locale activo,
// contexto de next/navigation), así que se mockea: aquí sólo nos interesa que
// `useCrossPortal` lo invoque con la ruta y el momento correctos.
const pushMock = vi.fn();
vi.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}));

// El resto de dependencias (stores de portal y de audio ambiental) son las
// reales: son máquinas de estado simples ya cubiertas por sus propios tests,
// así que usarlas de verdad aquí verifica la integración sin mocks frágiles.
import { useCrossPortal } from '@/hooks/use-cross-portal';
import { useAmbientStore } from '@/stores/ambient-store';
import { usePortalStore } from '@/stores/portal-store';

describe('useCrossPortal', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    pushMock.mockClear();
    usePortalStore.setState({ phase: 'idle' });
    useAmbientStore.setState({ enabled: false });
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('activa el audio ambiental si estaba apagado', () => {
    const { result } = renderHook(() => useCrossPortal());

    act(() => result.current());

    expect(useAmbientStore.getState().enabled).toBe(true);
  });

  it('no toca el audio si ya estaba encendido', () => {
    useAmbientStore.setState({ enabled: true });
    const { result } = renderHook(() => useCrossPortal());

    act(() => result.current());

    expect(useAmbientStore.getState().enabled).toBe(true);
  });

  it('dispara el cruce del portal', () => {
    const { result } = renderHook(() => useCrossPortal());

    act(() => result.current());

    expect(usePortalStore.getState().phase).toBe('in');
  });

  it('navega a /inicio a los 1000 ms, cuando el círculo cubre la pantalla', () => {
    const { result } = renderHook(() => useCrossPortal());

    act(() => result.current());
    expect(pushMock).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(pushMock).toHaveBeenCalledExactlyOnceWith('/inicio');
  });

  it('un segundo disparo durante el cruce no reinicia nada', () => {
    const { result } = renderHook(() => useCrossPortal());

    act(() => result.current());
    act(() => {
      vi.advanceTimersByTime(500);
    });
    // A mitad de camino del primer cruce: este segundo disparo no debe hacer nada.
    act(() => result.current());
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(pushMock).toHaveBeenCalledTimes(1);
  });

  it('limpia su temporizador de navegación si el componente se desmonta', () => {
    const { result, unmount } = renderHook(() => useCrossPortal());

    act(() => result.current());
    unmount();
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(pushMock).not.toHaveBeenCalled();
  });
});
