import type { ReactNode } from 'react';

import { PlayerOrb } from './player-orb';

export type PlayerMiniProps = {
  /** `null` si la pista no es un tono: el aro no lleva cifra. */
  hz: number | null;
  band: string;
  /** Portada del audio (`AudioCover`). */
  cover?: ReactNode;
  /** Avance 0–100 del audio. */
  progress: number;
  /** Nombre accesible completo: la acción y lo que suena. */
  label: string;
  onExpand: () => void;
};

/**
 * El reproductor recogido: un disco flotante que sigue sonando. Su aro marca
 * el avance y pulsarlo devuelve el dock. Vive en la esquina inferior derecha,
 * donde no tapa el contenido ni el footer.
 */
export function PlayerMini({ hz, band, cover, progress, label, onExpand }: PlayerMiniProps) {
  return (
    <button
      type="button"
      data-player-focus
      data-magnetic
      aria-label={label}
      onClick={onExpand}
      className="fm-surface-strong shadow-glow-card hover:border-accent/45 pointer-events-auto block size-14 rounded-full transition-colors duration-300"
    >
      <PlayerOrb band={band} cover={cover} progress={progress} className="size-full">
        {hz !== null ? (
          <span className="text-fg text-body font-serif leading-none">{hz}</span>
        ) : null}
      </PlayerOrb>
    </button>
  );
}
