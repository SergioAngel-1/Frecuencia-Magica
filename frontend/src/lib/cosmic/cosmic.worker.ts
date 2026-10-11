import type { CosmicMessage, CosmicReply } from './protocol';
import {
  createCosmicDriver,
  createCosmicScene,
  type CosmicDriver,
  type CosmicScene,
} from './scene';

/**
 * El fondo cósmico, fuera del hilo principal. Pinta sobre el `OffscreenCanvas`
 * que le transfiere `CosmicCanvas` con su propio `requestAnimationFrame`, de
 * modo que ni el dibujo ni la entrega del frame compiten con el scroll, las
 * transiciones o React.
 */

/** Lo que este archivo usa del ámbito global de un worker dedicado. */
type WorkerScope = {
  onmessage: ((event: MessageEvent<CosmicMessage>) => void) | null;
  postMessage: (reply: CosmicReply) => void;
  requestAnimationFrame?: (callback: (timestamp: number) => void) => number;
  cancelAnimationFrame?: (handle: number) => void;
};

const scope = self as unknown as WorkerScope;

// Un worker sin `requestAnimationFrame` (motores antiguos) marca el paso con
// un temporizador a 60 fps.
const schedule = scope.requestAnimationFrame
  ? (callback: (timestamp: number) => void) => scope.requestAnimationFrame!(callback)
  : (callback: (timestamp: number) => void) =>
      setTimeout(() => callback(performance.now()), 1000 / 60) as unknown as number;
const cancel = scope.cancelAnimationFrame
  ? (handle: number) => scope.cancelAnimationFrame!(handle)
  : (handle: number) => clearTimeout(handle);

let scene: CosmicScene | null = null;
let driver: CosmicDriver | null = null;

scope.onmessage = ({ data }) => {
  if (data.type === 'init') {
    const ctx = data.canvas.getContext('2d');
    if (!ctx) {
      scope.postMessage({ type: 'failed' });
      return;
    }

    scene = createCosmicScene(ctx, data.viewport, data.accent);
    driver = createCosmicDriver(scene, schedule, cancel);
    driver.setVisible(data.visible);
    driver.setReduced(data.reduced);
    return;
  }

  if (!scene || !driver) return;

  switch (data.type) {
    case 'resize':
      scene.resize(data.viewport);
      driver.refresh();
      break;
    case 'accent':
      scene.setAccent(data.accent);
      driver.refresh();
      break;
    case 'reduced':
      driver.setReduced(data.reduced);
      break;
    case 'visible':
      driver.setVisible(data.visible);
      break;
  }
};
