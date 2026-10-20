'use client';

import { useEffect, useRef } from 'react';

import type { VisualMode } from '@/config/realms';
import { useAtmosphere } from '@/hooks/use-atmosphere';
import { useEngineProfile } from '@/hooks/use-engine-profile';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { useRealm } from '@/hooks/use-realm';
import { useThemeFade } from '@/hooks/use-theme-fade';
import { pauseDelayMs, shouldRunCanvas } from '@/lib/atmosphere/canvas-pause';
import { hexToRgb } from '@/lib/cosmic/colors';
import { paintInWorker, paintOnMainThread, readViewport, type Painter } from '@/lib/cosmic/painter';

const RESIZE_DEBOUNCE_MS = 150;

/**
 * Fondo vivo: estrellas, partículas y tres nebulosas a la deriva, con la escena del
 * tema activo (`lib/cosmic/themes`); en la noche, recoloreado al acento del realm.
 *
 * Se pinta en un worker sobre un `OffscreenCanvas`: es la única capa que
 * dibuja en cada frame, y fuera del hilo principal deja de competir con el
 * scroll y las transiciones. Además, sin su `requestAnimationFrame` aquí, el
 * navegador ya no tiene que producir un frame de página 60 veces por segundo
 * y las animaciones CSS corren solas en el compositor. Donde no hay
 * `OffscreenCanvas`, o si el worker falla, pinta en el hilo principal con el
 * mismo código.
 *
 * El `<canvas>` se crea a mano dentro del efecto: una vez transferido a un
 * worker no admite otro contexto, y así cada montaje estrena el suyo.
 */
export function CosmicCanvas({ visualMode = 'cosmic' }: { visualMode?: VisualMode }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const painterRef = useRef<Painter | null>(null);
  const { accent } = useRealm();
  const { atmosphereId } = useAtmosphere();
  const reduced = useReducedMotionSafe();
  const { canvas: level } = useEngineProfile(visualMode);
  const fade = useThemeFade('engine');

  // Lo último que se le dijo al fondo: el pintor que se monte lo recibe.
  const accentRef = useRef(accent);
  const themeRef = useRef(atmosphereId);
  const reducedRef = useRef(reduced);
  // Si el fondo se ve: con el multiplicador a 0 el rAF se para al acabar el fundido.
  const liveRef = useRef(true);
  const pauseTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const adopt = (painter: Painter | null) => {
      painterRef.current = painter;
      painter?.setReduced(reducedRef.current);
      painter?.setVisible(liveRef.current && !document.hidden);
    };
    const fallBack = () => {
      painterRef.current?.destroy();
      adopt(paintOnMainThread(host, hexToRgb(accentRef.current), themeRef.current));
    };

    const initialAccent = hexToRgb(accentRef.current);
    adopt(
      paintInWorker(host, initialAccent, themeRef.current, fallBack) ??
        paintOnMainThread(host, initialAccent, themeRef.current),
    );

    // El frame quieto de movimiento reducido se repinta al momento; el bucle
    // espera a que el tamaño se asiente.
    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    const onResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      if (reducedRef.current) {
        painterRef.current?.resize(readViewport());
        return;
      }
      resizeTimer = setTimeout(
        () => painterRef.current?.resize(readViewport()),
        RESIZE_DEBOUNCE_MS,
      );
    };
    // Pausar fuera de pantalla para no gastar batería.
    const onVisibility = () => painterRef.current?.setVisible(!document.hidden && liveRef.current);

    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      painterRef.current?.destroy();
      painterRef.current = null;
      host.replaceChildren();
    };
  }, []);

  useEffect(() => {
    accentRef.current = accent;
    painterRef.current?.setAccent(hexToRgb(accent));
  }, [accent]);

  useEffect(() => {
    themeRef.current = atmosphereId;
    painterRef.current?.setTheme(atmosphereId);
  }, [atmosphereId]);

  useEffect(() => {
    reducedRef.current = reduced;
    painterRef.current?.setReduced(reduced);
  }, [reduced]);

  // Opacidad final bajo el umbral (atmósferas claras): el bucle se para al acabar el
  // fundido, no antes, para no congelar las estrellas mientras se desvanecen.
  const previousLevel = useRef<number | null>(null);
  useEffect(() => {
    const delay = pauseDelayMs(previousLevel.current, level, fade);
    previousLevel.current = level;
    clearTimeout(pauseTimer.current);

    if (shouldRunCanvas(level)) {
      liveRef.current = true;
      painterRef.current?.setVisible(!document.hidden);
      return;
    }

    pauseTimer.current = setTimeout(() => {
      liveRef.current = false;
      painterRef.current?.setVisible(false);
    }, delay);

    return () => clearTimeout(pauseTimer.current);
  }, [level, fade]);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className="z-world pointer-events-none fixed inset-0"
      style={{ opacity: level, transition: `opacity ${fade}s ease-in-out` }}
    />
  );
}
