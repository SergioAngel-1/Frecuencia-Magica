import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// El router de `@/i18n/navigation` depende del árbol de Next (locale activo,
// contexto de next/navigation), así que se mockea: aquí sólo nos interesa que
// `useCrossPortal` lo invoque con la ruta y el momento correctos.
const pushMock = vi.fn();
const prefetchMock = vi.fn();
vi.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ push: pushMock, prefetch: prefetchMock }),
}));

// El resto de dependencias (stores de portal y de audio ambiental) son las
// reales: son máquinas de estado simples ya cubiertas por sus propios tests,
// así que usarlas de verdad aquí verifica la integración sin mocks frágiles.
import { PORTAL_TIMING } from '@/config/motion';
import { useCrossPortal } from '@/hooks/use-cross-portal';
import { useAmbientStore } from '@/stores/ambient-store';
import { usePortalStore } from '@/stores/portal-store';

const { full, quick } = PORTAL_TIMING;

describe('useCrossPortal', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    pushMock.mockClear();
    prefetchMock.mockClear();
    window.localStorage.clear();
    usePortalStore.setState({ phase: 'idle', mode: 'full' });
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

  it('dispara el cruce del portal con la coreografía completa la primera vez', () => {
    const { result } = renderHook(() => useCrossPortal());

    act(() => result.current());

    expect(usePortalStore.getState().phase).toBe('in');
    expect(usePortalStore.getState().mode).toBe('full');
  });

  it('precarga el destino al pulsar y navega cuando la noche cubre la pantalla', () => {
    const { result } = renderHook(() => useCrossPortal());

    act(() => result.current());
    expect(prefetchMock).toHaveBeenCalledExactlyOnceWith('/inicio');
    expect(pushMock).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(full.cover - 1);
    });
    expect(pushMock).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(pushMock).toHaveBeenCalledExactlyOnceWith('/inicio');
  });

  it('con un cruce reciente usa el fundido breve y navega al cubrir', () => {
    const { result } = renderHook(() => useCrossPortal());

    // Primera vez (storage vacío): coreografía completa.
    act(() => result.current());
    act(() => {
      vi.advanceTimersByTime(full.cover);
    });
    expect(pushMock).toHaveBeenCalledTimes(1);

    // La coreografía termina y se cruza de nuevo enseguida: fundido corto.
    usePortalStore.setState({ phase: 'idle' });
    pushMock.mockClear();

    act(() => result.current());
    expect(usePortalStore.getState().mode).toBe('quick');
    expect(pushMock).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(quick.cover);
    });

    expect(pushMock).toHaveBeenCalledExactlyOnceWith('/inicio');
  });

  it('un segundo disparo durante el cruce no reinicia nada', () => {
    const { result } = renderHook(() => useCrossPortal());

    act(() => result.current());
    act(() => {
      vi.advanceTimersByTime(full.cover / 2);
    });
    // A mitad de camino del primer cruce: este segundo disparo no debe hacer nada.
    act(() => result.current());
    act(() => {
      vi.advanceTimersByTime(full.cover);
    });

    expect(pushMock).toHaveBeenCalledTimes(1);
  });

  it('limpia su temporizador de navegación si el componente se desmonta', () => {
    const { result, unmount } = renderHook(() => useCrossPortal());

    act(() => result.current());
    unmount();
    act(() => {
      vi.advanceTimersByTime(full.cover);
    });

    expect(pushMock).not.toHaveBeenCalled();
  });
});
