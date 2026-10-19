'use client';

import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';

import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';

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
export type Veil = 'clear' | 'fade' | 'cut';

type FullscreenVeil = {
  /** El contenedor ocupa ahora la pantalla completa. */
  fullscreen: boolean;
  /** El navegador soporta pantalla completa: sin él, el botón no se pinta. */
  canFullscreen: boolean;
  veil: Veil;
  toggleFullscreen(): void;
};

/**
 * Pantalla completa de un contenedor con fundido: entrar y salir no salta.
 * El navegador cambia el tamaño de golpe, y ese cambio ocurre bajo el velo,
 * que se abre despacio cuando el nuevo tamaño ya está asentado. Con
 * `prefers-reduced-motion` se cambia sin fundido.
 */
export function useFullscreenVeil(frameRef: RefObject<HTMLElement | null>): FullscreenVeil {
  const reduced = useReducedMotionSafe();
  const veilTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [canFullscreen, setCanFullscreen] = useState(false);
  const [veil, setVeil] = useState<Veil>('clear');

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
  }, [frameRef]);

  const toggleFullscreen = useCallback(() => {
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
  }, [reduced, frameRef]);

  return { fullscreen, canFullscreen, veil, toggleFullscreen };
}
