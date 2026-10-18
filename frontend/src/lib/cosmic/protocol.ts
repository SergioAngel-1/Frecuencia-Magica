import type { AtmosphereId } from '@/types/atmosphere';

import type { Rgb } from './colors';
import type { CosmicViewport } from './scene';

/** Lo que el hilo principal le dice al worker del fondo cósmico. */
export type CosmicMessage =
  | {
      type: 'init';
      canvas: OffscreenCanvas;
      viewport: CosmicViewport;
      accent: Rgb;
      theme: AtmosphereId;
      reduced: boolean;
      visible: boolean;
    }
  | { type: 'resize'; viewport: CosmicViewport }
  | { type: 'accent'; accent: Rgb }
  | { type: 'theme'; theme: AtmosphereId }
  | { type: 'reduced'; reduced: boolean }
  | { type: 'visible'; visible: boolean };

/** Lo único que el worker responde: no ha podido pintar y hay que hacerlo fuera. */
export type CosmicReply = { type: 'failed' };
