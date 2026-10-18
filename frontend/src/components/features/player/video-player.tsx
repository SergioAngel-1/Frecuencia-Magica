'use client';

import { useRef, type ReactNode } from 'react';

import { IconButton } from '@/components/ui';
import { useFullscreenVeil, type Veil } from '@/hooks/use-fullscreen-veil';
import { useIdleControls } from '@/hooks/use-idle-controls';
import { useVideoPlayback } from '@/hooks/use-video-playback';
import { cn } from '@/lib/cn';

import { PlayerBar } from './player-bar';
import { FullscreenIcon, PlayPauseIcon, VolumeIcon } from './player-icons';

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
  /** Fuente del video. Sin ella no se monta el reproductor (lo decide `VideoSlot`). */
  src: string;
  /** Duración conocida de antemano, en segundos. */
  duration: number;
  /** La imagen que se ve antes de empezar. */
  poster: ReactNode;
  labels: VideoPlayerLabels;
  className?: string;
};

const VEIL_CLASSES: Record<Veil, string> = {
  clear: 'opacity-0 transition-opacity duration-500',
  fade: 'opacity-100 transition-opacity duration-300',
  cut: 'opacity-100 transition-none',
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
  const { videoRef, playing, elapsed, total, muted, toggle, seek, toggleMute } = useVideoPlayback(
    src,
    duration,
  );
  const { quiet, wake } = useIdleControls(playing);
  const { fullscreen, canFullscreen, veil, toggleFullscreen } = useFullscreenVeil(frameRef);

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
      <video
        ref={videoRef}
        src={src}
        playsInline
        preload="metadata"
        className="absolute inset-0 size-full object-cover"
      />

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
            'border-accent/60 bg-scrim/45 text-fg flex size-14 items-center justify-center rounded-full border backdrop-blur-[6px] transition-[opacity,transform] duration-500 sm:size-[72px]',
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
              <IconButton
                variant="ghost"
                label={muted ? labels.unmute : labels.mute}
                onClick={toggleMute}
              >
                <VolumeIcon muted={muted} />
              </IconButton>
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
