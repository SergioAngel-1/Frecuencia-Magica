'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/** Cuánto tarda la barra en retirarse mientras el video suena y nadie la toca. */
const CONTROLS_IDLE_MS = 2600;

type IdleControls = {
  /** La barra se ha retirado tras un rato sin interacción. */
  quiet: boolean;
  /** Devuelve la barra y, si el video suena, vuelve a contar para retirarla. */
  wake(): void;
};

/**
 * Retira los controles de un video mientras suena y nadie interactúa. El
 * cronómetro se reinicia con `wake` (cursor, toque, foco) y se cancela al
 * desmontar.
 */
export function useIdleControls(playing: boolean): IdleControls {
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [quiet, setQuiet] = useState(false);

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

  return { quiet, wake };
}
