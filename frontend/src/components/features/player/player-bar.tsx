'use client';

import type { ReactNode } from 'react';

import { IconButton, SeekBar } from '@/components/ui';
import { cn } from '@/lib/cn';
import { formatDuration } from '@/lib/format';
import { progressPercent } from '@/lib/player/progress';

import { EdgeProgress, PlayButton } from './player-controls';
import { NextIcon, PreviousIcon } from './player-icons';

type TimelineProps = {
  /** Segundos transcurridos y totales. */
  elapsed: number;
  total: number;
  onSeek: (seconds: number) => void;
  /** Nombre accesible de la barra, ya traducido. */
  label: string;
  className?: string;
};

/** Tiempo transcurrido, barra de posición y duración. */
export function Timeline({ elapsed, total, onSeek, label, className }: TimelineProps) {
  const elapsedLabel = formatDuration(Math.min(elapsed, total));
  const totalLabel = formatDuration(total);

  return (
    <div
      className={cn(
        'text-fg-meta text-meta flex min-w-0 flex-1 items-center gap-3 font-sans tabular-nums',
        className,
      )}
    >
      <span>{elapsedLabel}</span>
      <SeekBar
        value={elapsed}
        max={total}
        onChange={onSeek}
        label={label}
        valueText={`${elapsedLabel} / ${totalLabel}`}
        className="flex-1"
      />
      <span>{totalLabel}</span>
    </div>
  );
}

export type PlayerBarLabels = {
  play: string;
  pause: string;
  seek: string;
  previous?: string;
  next?: string;
};

export type PlayerBarProps = {
  playing: boolean;
  onToggle: () => void;
  elapsed: number;
  total: number;
  onSeek: (seconds: number) => void;
  labels: PlayerBarLabels;
  /** Carátula a la izquierda (la esfera del audio). */
  artwork?: ReactNode;
  /** Qué suena: título y línea de meta, ya traducidos. */
  title?: string;
  meta?: ReactNode;
  /** Anterior y siguiente: sólo se pintan si hay a dónde saltar. */
  onPrevious?: () => void;
  onNext?: () => void;
  /** Ranura de volumen, siempre visible junto a la pausa (el dock la rellena). */
  volume?: ReactNode;
  /** Acciones del final de la barra (ocultar y cerrar, sonido y pantalla completa). */
  actions?: ReactNode;
  /**
   * `from-md`: por debajo de 768 px la barra de posición no cabe junto al
   * título y el avance pasa a ser el filo superior (el dock). `always`: la
   * barra de posición está siempre, porque es lo principal (el video).
   */
  timeline?: 'from-md' | 'always';
  className?: string;
};

/**
 * La barra del reproductor, sin estado: carátula, qué suena, transporte,
 * posición y acciones. La comparten el dock de frecuencias y el reproductor
 * de video de las lecciones, que sólo cambian lo que le pasan; quien la usa
 * pone la superficie de cristal y el estado.
 */
export function PlayerBar({
  playing,
  onToggle,
  elapsed,
  total,
  onSeek,
  labels,
  artwork,
  title,
  meta,
  onPrevious,
  onNext,
  volume,
  actions,
  timeline = 'from-md',
  className,
}: PlayerBarProps) {
  const responsive = timeline === 'from-md';

  return (
    <div
      className={cn(
        // En móvil, la barra se parte en dos líneas si no cabe: el título conserva un
        // ancho mínimo y los controles bajan a la segunda, sin que el título desaparezca.
        'relative flex w-full flex-wrap items-center gap-x-3 gap-y-2 px-3 py-2 sm:gap-4 sm:px-4 sm:py-3 md:flex-nowrap',
        className,
      )}
    >
      {responsive ? (
        <EdgeProgress percent={progressPercent(elapsed, total)} className="md:hidden" />
      ) : null}

      {artwork}

      {title ? (
        <div className="min-w-[8rem] flex-1 basis-0 md:w-[210px] md:min-w-0 md:flex-none md:basis-auto">
          <p className="text-fg text-lead truncate font-serif leading-tight">{title}</p>
          {meta ? (
            <p className="text-fg-meta text-meta tracking-ui truncate font-sans tabular-nums">
              {meta}
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="flex shrink-0 items-center gap-1">
        {onPrevious && labels.previous ? (
          <IconButton
            variant="ghost"
            label={labels.previous}
            onClick={onPrevious}
            className="max-md:hidden"
          >
            <PreviousIcon />
          </IconButton>
        ) : null}
        <PlayButton
          playing={playing}
          onToggle={onToggle}
          playLabel={labels.play}
          pauseLabel={labels.pause}
        />
        {onNext && labels.next ? (
          <IconButton
            variant="ghost"
            label={labels.next}
            onClick={onNext}
            className="max-md:hidden"
          >
            <NextIcon />
          </IconButton>
        ) : null}
        {volume}
      </div>

      <Timeline
        elapsed={elapsed}
        total={total}
        onSeek={onSeek}
        label={labels.seek}
        className={responsive ? 'max-md:hidden' : undefined}
      />

      {actions ? <div className="flex shrink-0 items-center max-md:ml-auto">{actions}</div> : null}
    </div>
  );
}
