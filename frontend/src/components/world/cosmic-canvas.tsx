'use client';

import { useEffect, useRef } from 'react';

import type { VisualMode } from '@/config/realms';
import { useEngineProfile } from '@/hooks/use-engine-profile';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { useRealm } from '@/hooks/use-realm';
import { pauseDelayMs, shouldRunCanvas } from '@/lib/atmosphere/canvas-pause';
import { fadeDuration } from '@/lib/atmosphere/engine-profile';
import { hexToRgb, type Rgb } from '@/lib/cosmic/colors';
import type { CosmicMessage, CosmicReply } from '@/lib/cosmic/protocol';
import { createCosmicDriver, createCosmicScene, type CosmicViewport } from '@/lib/cosmic/scene';

const MOBILE_QUERY = '(max-width: 767px)';
const RESIZE_DEBOUNCE_MS = 150;

/** Lo que el componente le pide al fondo, pinte quien pinte. */
type Painter = {
  resize: (viewport: CosmicViewport) => void;
  setAccent: (accent: Rgb) => void;
  setReduced: (reduced: boolean) => void;
  setVisible: (visible: boolean) => void;
  destroy: () => void;
};

/** Tamaño del viewport, densidad capada a 2 y breakpoint de la rejilla móvil. */
function readViewport(): CosmicViewport {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
    dpr: Math.min(window.devicePixelRatio || 1, 2),
    small: window.matchMedia(MOBILE_QUERY).matches,
  };
}

function createCanvas(host: HTMLElement): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'display:block;width:100%;height:100%';
  host.replaceChildren(canvas);
  return canvas;
}

/** Pinta en el hilo principal: el camino de los navegadores sin `OffscreenCanvas`. */
function paintOnMainThread(host: HTMLElement, accent: Rgb): Painter | null {
  const ctx = createCanvas(host).getContext('2d');
  if (!ctx) return null;

  const scene = createCosmicScene(ctx, readViewport(), accent);
  const driver = createCosmicDriver(scene, requestAnimationFrame, cancelAnimationFrame);

  return {
    resize: (viewport) => {
      scene.resize(viewport);
      driver.refresh();
    },
    setAccent: (next) => {
      scene.setAccent(next);
      driver.refresh();
    },
    setReduced: driver.setReduced,
    setVisible: driver.setVisible,
    destroy: driver.stop,
  };
}

/** Pinta en un worker. Si el worker no puede, `onFailed` pide el otro camino. */
function paintInWorker(host: HTMLElement, accent: Rgb, onFailed: () => void): Painter | null {
  const canvas = createCanvas(host);
  if (typeof Worker === 'undefined' || typeof canvas.transferControlToOffscreen !== 'function') {
    return null;
  }

  let worker: Worker;
  try {
    worker = new Worker(new URL('../../lib/cosmic/cosmic.worker.ts', import.meta.url));
  } catch {
    return null;
  }

  const send = (message: CosmicMessage, transfer: Transferable[] = []) =>
    worker.postMessage(message, transfer);

  worker.onmessage = ({ data }: MessageEvent<CosmicReply>) => {
    if (data.type === 'failed') onFailed();
  };
  worker.onerror = onFailed;

  const offscreen = canvas.transferControlToOffscreen();
  send(
    {
      type: 'init',
      canvas: offscreen,
      viewport: readViewport(),
      accent,
      reduced: false,
      visible: !document.hidden,
    },
    [offscreen],
  );

  return {
    resize: (viewport) => send({ type: 'resize', viewport }),
    setAccent: (next) => send({ type: 'accent', accent: next }),
    setReduced: (reduced) => send({ type: 'reduced', reduced }),
    setVisible: (visible) => send({ type: 'visible', visible }),
    destroy: () => worker.terminate(),
  };
}

/**
 * Fondo cósmico: estrellas que parpadean, polen dorado que asciende y tres
 * nebulosas a la deriva, recoloreadas al acento del realm (`lib/cosmic/scene`).
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
  const reduced = useReducedMotionSafe();
  const { canvas: level } = useEngineProfile(visualMode);
  const fade = fadeDuration(reduced);

  // Lo último que se le dijo al fondo: el pintor que se monte lo recibe.
  const accentRef = useRef(accent);
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
      adopt(paintOnMainThread(host, hexToRgb(accentRef.current)));
    };

    const initialAccent = hexToRgb(accentRef.current);
    adopt(paintInWorker(host, initialAccent, fallBack) ?? paintOnMainThread(host, initialAccent));

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
