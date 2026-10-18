import { act, render, renderHook, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useVideoPlayback } from '@/hooks/use-video-playback';

describe('useVideoPlayback sin fuente', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('no simula: tocar play no pone el video en marcha ni avanza el reloj', () => {
    const { result } = renderHook(() => useVideoPlayback(undefined, 1560));

    act(() => result.current.toggle());
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(result.current.playing).toBe(false);
    expect(result.current.elapsed).toBe(0);
  });

  it('mantiene la duración conocida, sin moverla', () => {
    const { result } = renderHook(() => useVideoPlayback(undefined, 1560));

    expect(result.current.total).toBe(1560);
  });

  it('toggleMute alterna el silencio aunque no haya elemento', () => {
    const { result } = renderHook(() => useVideoPlayback(undefined, 1560));

    act(() => result.current.toggleMute());
    expect(result.current.muted).toBe(true);

    act(() => result.current.toggleMute());
    expect(result.current.muted).toBe(false);
  });
});

describe('useVideoPlayback con fuente', () => {
  let playback: ReturnType<typeof useVideoPlayback>;

  function Probe() {
    playback = useVideoPlayback('leccion.mp4', 1560);
    return <video ref={playback.videoRef} data-testid="video" muted={playback.muted} />;
  }

  it('toggleMute escribe el silencio en el elemento, no sólo en el estado', () => {
    render(<Probe />);
    const video = screen.getByTestId('video') as HTMLVideoElement;

    act(() => playback.toggleMute());
    expect(video.muted).toBe(true);
    expect(playback.muted).toBe(true);

    act(() => playback.toggleMute());
    expect(video.muted).toBe(false);
    expect(playback.muted).toBe(false);
  });
});
