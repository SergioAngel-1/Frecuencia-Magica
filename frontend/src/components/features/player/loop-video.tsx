'use client';

import type { ReactNode } from 'react';

import { useMounted } from '@/hooks/use-mounted';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { useSaveData } from '@/hooks/use-save-data';
import { cn } from '@/lib/cn';
import { shouldPlayLoop } from '@/lib/video/loop';

type LoopVideoProps = {
  /** Fuente del loop, silenciado. Sin ella (o sin permiso del entorno) queda el póster. */
  src?: string;
  /** La imagen del paisaje: es lo que se ve cuando no hay loop. */
  poster: ReactNode;
  className?: string;
};

/**
 * Loop de paisaje silenciado (spec §4.7, nivel 2). Decorativo: sin controles ni
 * audio. Sólo suena con fuente, sin movimiento reducido y sin ahorro de datos
 * (`shouldPlayLoop`); antes de hidratar pinta el póster, para no descargar un
 * video que luego haya que descartar.
 */
export function LoopVideo({ src, poster, className }: LoopVideoProps) {
  const mounted = useMounted();
  const reduced = useReducedMotionSafe();
  const saveData = useSaveData();
  const play = mounted && shouldPlayLoop(src, { reduced, saveData });

  return (
    <div aria-hidden="true" className={cn('relative overflow-hidden', className)}>
      {poster}
      {play ? (
        <video
          src={src}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 size-full object-cover"
        />
      ) : null}
    </div>
  );
}
