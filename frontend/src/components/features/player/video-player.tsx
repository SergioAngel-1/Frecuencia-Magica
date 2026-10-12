'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';

import { IconButton } from '@/components/ui';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { useVideoPlayback } from '@/hooks/use-video-playback';
import { cn } from '@/lib/cn';

import { PlayerBar } from './player-bar';
import { FullscreenIcon, PlayPauseIcon, VolumeIcon } from './player-icons';

/** Cuánto tarda la barra en retirarse mientras el video suena y nadie la toca. */
const CONTROLS_IDLE_MS = 2600;

/**
 * Fundido a la noche antes de cambiar a pantalla completa (y al volver), en
 * ms. Corto: la llamada tiene que seguir dentro del gesto de quien pulsó.
 */
const VEIL_FADE_MS = 280;
/** Margen para que el navegador termine de redimensionar bajo el velo. */
const VEIL_SETTLE_MS = 120;

/**
 * El velo que cubre el salto de tamaño: `fade` funde a la noche, `cut` la
 * pone de golpe (salida con Escape, que no avisa antes) y `clear` la abre.
 */
type Veil = 'clear' | 'fade' | 'cut';

const VEIL_CLASSES: Record<Veil, string> = {
  clear: 'opacity-0 transition-opacity duration-500',
  fade: 'opacity-100 transition-opacity duration-300',
  cut: 'opacity-100 transition-none',
};

export type VideoPlayerLabels = {
  /** Nombre accesible de la región, ya traducido. */
  region: string;
  play: string;
  pause: string;
  seek: string;
  mute: string;
  unmute: string;
  fullscreen: string;
  exitFullscreen: string;
};

type VideoPlayerProps = {
  /** Fuente del video. TODO(backend): hoy las lecciones aún no la traen. */
  src?: string;
  /** Duración conocida de antemano, en segundos. */
  duration: number;
  /** La imagen que se ve antes de empezar (y, sin fuente, durante la práctica). */
  poster: ReactNode;
  labels: VideoPlayerLabels;
  className?: string;
};

/**
 * Reproductor de video con controles propios: la versión para video de la
 * barra del dock de frecuencias (`PlayerBar`), sobre la imagen de la lección.
 * El `<video>` va sin `controls`; play, posición, sonido y pantalla completa
 * son los del sitio.
 *
 * Entrar y salir de pantalla completa funde a la noche en vez de saltar: el
 * navegador cambia el tamaño de golpe, y ese cambio ocurre bajo un velo.
 *
 * Pulsar la imagen alterna play y pausa. Mientras suena, la barra se retira
 * si nadie se mueve y vuelve al mover el cursor, tocar o enfocar un control.
 */
export function VideoPlayer({ src, duration, poster, labels, className }: VideoPlayerProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const veilTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduced = useReducedMotionSafe();
  const { videoRef, playing, elapsed, total, muted, toggle, seek, toggleMute } = useVideoPlayback(
    src,
    duration,
  );
  const [quiet, setQuiet] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [canFullscreen, setCanFullscreen] = useState(false);
  const [veil, setVeil] = useState<Veil>('clear');

  // La barra reaparece y, si el video suena, vuelve a contar para retirarse.
  const wake = useCallback(() => {
    setQuiet(false);
    if (idleTimer.current) clearTimeout(idleTimer.current);
    if (playing) idleTimer.current = setTimeout(() => setQuiet(true), CONTROLS_IDLE_MS);
  }, [playing]);

  useEffect(() => {
    wake();

    return () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [wake]);

  useEffect(() => {
    // iPhone no deja poner un contenedor a pantalla completa: sin soporte, el botón no se pinta.
    setCanFullscreen(document.fullscreenEnabled === true);

    // El navegador ya ha cambiado el tamaño de golpe. Si se llegó aquí sin
    // fundido previo (Escape), la noche cae en el acto; en ambos casos se
    // abre despacio cuando el nuevo tamaño ya está asentado.
    const onChange = () => {
      setFullscreen(document.fullscreenElement === frameRef.current);
      setVeil((current) => (current === 'clear' ? 'cut' : current));
      if (veilTimer.current) clearTimeout(veilTimer.current);
      veilTimer.current = setTimeout(() => setVeil('clear'), VEIL_SETTLE_MS);
    };
    document.addEventListener('fullscreenchange', onChange);

    return () => {
      document.removeEventListener('fullscreenchange', onChange);
      if (veilTimer.current) clearTimeout(veilTimer.current);
    };
  }, []);

  // Entrar y salir sin salto: el video funde a la noche, el navegador cambia
  // el tamaño bajo ese velo y la imagen vuelve a amanecer ya en su sitio.
  const toggleFullscreen = () => {
    const change = () => {
      const request = document.fullscreenElement
        ? document.exitFullscreen()
        : frameRef.current?.requestFullscreen();

      // Si el navegador se niega, no hay `fullscreenchange` que abra el velo.
      void request?.catch(() => setVeil('clear'));
    };

    if (reduced) {
      change();
      return;
    }

    setVeil('fade');
    if (veilTimer.current) clearTimeout(veilTimer.current);
    veilTimer.current = setTimeout(change, VEIL_FADE_MS);
  };

  // Con la barra retirada, el primer toque sólo la trae de vuelta.
  const handleSurface = () => {
    if (quiet) wake();
    else toggle();
  };

  return (
    <div
      ref={frameRef}
      role="region"
      aria-label={labels.region}
      onPointerMove={wake}
      onPointerDown={quiet ? undefined : wake}
      onFocus={wake}
      className={cn('bg-void-2 relative isolate overflow-hidden', className)}
      data-video-state={playing ? 'playing' : 'paused'}
    >
      <div className="absolute inset-0">{poster}</div>
      {src ? (
        <video
          ref={videoRef}
          src={src}
          playsInline
          preload="metadata"
          className="absolute inset-0 size-full object-cover"
        />
      ) : null}

      {/* La imagen entera alterna play y pausa. Es un atajo de puntero: el
          control con nombre y foco es el play de la barra. */}
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        onClick={handleSurface}
        className="absolute inset-0 z-10 flex items-center justify-center max-sm:pb-[72px]"
      >
        <span
          className={cn(
            'border-gold/60 bg-void/45 text-ivory flex size-14 items-center justify-center rounded-full border backdrop-blur-[6px] transition-[opacity,transform] duration-500 sm:size-[72px]',
            playing ? 'scale-90 opacity-0' : 'scale-100 opacity-100',
          )}
        >
          <PlayPauseIcon playing={false} size={26} />
        </span>
      </button>

      {/* Velo de noche que cubre el cambio a pantalla completa y su vuelta. */}
      <div
        aria-hidden="true"
        className={cn('bg-void-2 pointer-events-none absolute inset-0 z-30', VEIL_CLASSES[veil])}
        data-video-veil={veil}
      />

      <div
        className={cn(
          'fm-surface-strong rounded-card shadow-glow-card absolute inset-x-3 bottom-3 z-20 transition-opacity duration-500 focus-within:opacity-100 sm:inset-x-5 sm:bottom-5',
          quiet ? 'pointer-events-none opacity-0 focus-within:pointer-events-auto' : 'opacity-100',
        )}
        data-video-controls="true"
      >
        <PlayerBar
          timeline="always"
          playing={playing}
          onToggle={toggle}
          elapsed={elapsed}
          total={total}
          onSeek={seek}
          labels={{ play: labels.play, pause: labels.pause, seek: labels.seek }}
          actions={
            <>
              {src ? (
                <IconButton
                  variant="ghost"
                  label={muted ? labels.unmute : labels.mute}
                  onClick={toggleMute}
                >
                  <VolumeIcon muted={muted} />
                </IconButton>
              ) : null}
              {canFullscreen ? (
                <IconButton
                  variant="ghost"
                  label={fullscreen ? labels.exitFullscreen : labels.fullscreen}
                  onClick={toggleFullscreen}
                >
                  <FullscreenIcon active={fullscreen} />
                </IconButton>
              ) : null}
            </>
          }
        />
      </div>
    </div>
  );
}
