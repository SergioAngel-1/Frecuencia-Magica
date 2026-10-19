'use client';

import { formatDuration } from '@/lib/format';
import { progressPercent } from '@/lib/player/progress';
import { usePlayerStore } from '@/stores/player-store';

import { PlayerBar, type PlayerBarProps } from './player-bar';
import { PlayerMini, type PlayerMiniProps } from './player-mini';

/*
 * Hojas del dock que leen `elapsed`. El motor lo actualiza cada 250 ms: cada
 * componente de aquí se suscribe por sí mismo, así que sólo ellos se
 * re-renderizan al avanzar y el dock (que no lo lee) se queda quieto.
 */

type PlayerProgressBarProps = Omit<PlayerBarProps, 'elapsed'>;

/** La barra del dock con su posición viva. */
export function PlayerProgressBar(props: PlayerProgressBarProps) {
  const elapsed = usePlayerStore((s) => s.elapsed);

  return <PlayerBar {...props} elapsed={elapsed} />;
}

/** El tiempo transcurrido en la línea de meta, sólo en móvil. */
export function PlayerElapsedLabel({ total }: { total: number }) {
  const elapsed = usePlayerStore((s) => s.elapsed);

  return <span className="md:hidden"> · {formatDuration(Math.min(elapsed, total))}</span>;
}

type PlayerMiniProgressProps = Omit<PlayerMiniProps, 'progress'> & {
  /** Duración de la pista, en segundos: de ella sale el avance del aro. */
  total: number;
};

/** El disco recogido con el aro que marca el avance. */
export function PlayerMiniProgress({ total, ...props }: PlayerMiniProgressProps) {
  const elapsed = usePlayerStore((s) => s.elapsed);

  return <PlayerMini {...props} progress={progressPercent(elapsed, total)} />;
}
