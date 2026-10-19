'use client';

import { cn } from '@/lib/cn';

import { PlayPauseIcon } from './player-icons';

export type PlayButtonProps = {
  playing: boolean;
  onToggle: () => void;
  /** Nombres accesibles ya traducidos: el botón dice lo que hará al pulsarlo. */
  playLabel: string;
  pauseLabel: string;
  className?: string;
};

/** El play del reproductor: un aro de oro que alterna con la pausa. */
export function PlayButton({
  playing,
  onToggle,
  playLabel,
  pauseLabel,
  className,
}: PlayButtonProps) {
  return (
    <button
      type="button"
      aria-label={playing ? pauseLabel : playLabel}
      onClick={onToggle}
      className={cn(
        'border-line-strong bg-accent/12 text-fg hover:bg-accent/20 hover:shadow-glow-gold flex size-11 shrink-0 items-center justify-center rounded-full border transition-[background-color,box-shadow] duration-300 sm:size-[52px]',
        className,
      )}
    >
      <PlayPauseIcon playing={playing} />
    </button>
  );
}
