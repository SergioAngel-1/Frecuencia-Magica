import type { AtmosphereId } from '@/types/atmosphere';

import type { Rgb } from './colors';
import type { CosmicMessage, CosmicReply } from './protocol';
import { createCosmicDriver, createCosmicScene, type CosmicViewport } from './scene';

const MOBILE_QUERY = '(max-width: 767px)';

/** Lo que el componente le pide al fondo, pinte quien pinte. */
export type Painter = {
  resize: (viewport: CosmicViewport) => void;
  setAccent: (accent: Rgb) => void;
  setTheme: (theme: AtmosphereId) => void;
  setReduced: (reduced: boolean) => void;
  setVisible: (visible: boolean) => void;
  destroy: () => void;
};

/** Tamaño del viewport, densidad capada a 2 y breakpoint de la rejilla móvil. */
export function readViewport(): CosmicViewport {
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
export function paintOnMainThread(
  host: HTMLElement,
  accent: Rgb,
  theme: AtmosphereId,
): Painter | null {
  const ctx = createCanvas(host).getContext('2d');
  if (!ctx) return null;

  const scene = createCosmicScene(ctx, readViewport(), accent, Math.random, theme);
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
    setTheme: (next) => {
      scene.setTheme(next);
      driver.refresh();
    },
    setReduced: driver.setReduced,
    setVisible: driver.setVisible,
    destroy: driver.stop,
  };
}

/** Pinta en un worker. Si el worker no puede, `onFailed` pide el otro camino. */
export function paintInWorker(
  host: HTMLElement,
  accent: Rgb,
  theme: AtmosphereId,
  onFailed: () => void,
): Painter | null {
  const canvas = createCanvas(host);
  if (typeof Worker === 'undefined' || typeof canvas.transferControlToOffscreen !== 'function') {
    return null;
  }

  let worker: Worker;
  try {
    worker = new Worker(new URL('./cosmic.worker.ts', import.meta.url));
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
      theme,
      reduced: false,
      visible: !document.hidden,
    },
    [offscreen],
  );

  return {
    resize: (viewport) => send({ type: 'resize', viewport }),
    setAccent: (next) => send({ type: 'accent', accent: next }),
    setTheme: (next) => send({ type: 'theme', theme: next }),
    setReduced: (reduced) => send({ type: 'reduced', reduced }),
    setVisible: (visible) => send({ type: 'visible', visible }),
    destroy: () => worker.terminate(),
  };
}
