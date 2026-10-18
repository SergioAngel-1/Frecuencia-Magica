'use client';

import { IconButton } from '@/components/ui';

import { VolumeIcon } from './player-icons';

export type VolumeControlLabels = {
  /** Nombre del control deslizante. */
  volume: string;
  /** Lo que hace el botón de silencio, según el estado actual. */
  mute: string;
  unmute: string;
  /** Lectura del valor, p. ej. «Volumen al 80 %». */
  valueText: string;
};

type VolumeControlProps = {
  /** Volumen maestro, 0–1. */
  value: number;
  onChange: (volume: number) => void;
  onToggleMute: () => void;
  labels: VolumeControlLabels;
};

/**
 * Volumen del reproductor: silencio y un deslizador, siempre visibles junto a
 * la pausa. El deslizador es un `<input type="range">` nativo: arrastre,
 * teclado y lector de pantalla salen gratis.
 */
export function VolumeControl({ value, onChange, onToggleMute, labels }: VolumeControlProps) {
  const muted = value === 0;

  return (
    <div className="flex shrink-0 items-center gap-1">
      <IconButton
        variant="ghost"
        label={muted ? labels.unmute : labels.mute}
        onClick={onToggleMute}
      >
        <VolumeIcon muted={muted} />
      </IconButton>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={value}
        aria-label={labels.volume}
        aria-valuetext={labels.valueText}
        onChange={(event) => onChange(Number(event.target.value))}
        className="accent-accent h-11 w-16 cursor-pointer sm:w-24"
      />
    </div>
  );
}
