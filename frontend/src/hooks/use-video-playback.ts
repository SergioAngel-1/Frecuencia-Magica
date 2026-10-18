'use client';

import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';

import { useIsPlayerSounding, usePlayerStore } from '@/stores/player-store';

type VideoPlayback = {
  /** Se enlaza al `<video>`; sin fuente no hay elemento y queda en `null`. */
  videoRef: RefObject<HTMLVideoElement | null>;
  playing: boolean;
  /** Segundos transcurridos y totales. */
  elapsed: number;
  total: number;
  muted: boolean;
  toggle(): void;
  seek(seconds: number): void;
  toggleMute(): void;
};

/**
 * Estado de un video con controles propios: el elemento `<video>` manda y
 * este hook lo refleja (tiempo, duración, pausa) para que la barra lo pinte.
 *
 * Sólo suena una cosa a la vez: al empezar el video se pausa la frecuencia
 * del reproductor, y si una frecuencia empieza a sonar, se pausa el video.
 *
 * @param src       Fuente del video. Sin ella no hay nada que reproducir: el hook
 *                  no simula ni avanza el reloj (el espacio es «próximamente»).
 * @param duration  Duración conocida de antemano, en segundos: la que se
 *                  muestra hasta que el video carga sus metadatos.
 */
export function useVideoPlayback(src: string | undefined, duration: number): VideoPlayback {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [total, setTotal] = useState(duration);
  const [muted, setMuted] = useState(false);
  const frequencySounding = useIsPlayerSounding();

  // Con fuente, el estado es el del propio elemento.
  useEffect(() => {
    const video = videoRef.current;
    if (!src || !video) return;

    const onTime = () => setElapsed(video.currentTime);
    const onDuration = () => {
      if (Number.isFinite(video.duration) && video.duration > 0) setTotal(video.duration);
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);

    video.addEventListener('timeupdate', onTime);
    video.addEventListener('durationchange', onDuration);
    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    video.addEventListener('ended', onPause);

    return () => {
      video.removeEventListener('timeupdate', onTime);
      video.removeEventListener('durationchange', onDuration);
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('ended', onPause);
    };
  }, [src]);

  const pause = useCallback(() => {
    videoRef.current?.pause();
  }, []);

  // Una frecuencia que empieza a sonar le quita la palabra al video.
  useEffect(() => {
    if (frequencySounding) pause();
  }, [frequencySounding, pause]);

  const seek = useCallback(
    (seconds: number) => {
      const next = Math.min(Math.max(seconds, 0), total);

      if (src && videoRef.current) videoRef.current.currentTime = next;
      setElapsed(next);
    },
    [src, total],
  );

  const toggle = useCallback(() => {
    if (playing) {
      pause();
      return;
    }

    // Sin fuente no hay nada que reproducir: no se finge.
    if (!src) return;

    // El video toma la palabra: la frecuencia que sonara se pausa.
    const player = usePlayerStore.getState();
    if (player.isPlaying) player.toggle();

    // Terminado, vuelve a empezar.
    if (elapsed >= total) seek(0);

    // `play()` puede rechazarse (política de autoplay, fuente caída): el
    // estado sólo cambia con el evento `play` del elemento.
    void videoRef.current?.play().catch(() => {});
  }, [playing, pause, elapsed, total, seek, src]);

  const toggleMute = useCallback(() => {
    setMuted((current) => {
      if (videoRef.current) videoRef.current.muted = !current;

      return !current;
    });
  }, []);

  return { videoRef, playing, elapsed, total, muted, toggle, seek, toggleMute };
}
