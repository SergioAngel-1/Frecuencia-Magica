'use client';

import { useAmbientAudio } from '@/hooks/use-ambient-audio';

import { BrandFigures } from './brand-figures';
import { CosmicCanvas } from './cosmic-canvas';
import { LuminousCursor } from './luminous-cursor';
import { NebulaLayer } from './nebula-layer';
import { PortalAnnouncer, PortalTransition } from './portal-transition';

/**
 * Motor del mundo: todas las capas inmersivas montadas una sola vez. Sobrevive
 * a los cambios de ruta y se recolorea por contexto de realm. Cualquier página
 * vacía ya se ve como Frecuencia Mágica gracias a esto.
 */
export function WorldEngine() {
  useAmbientAudio();

  return (
    <>
      <CosmicCanvas />
      <NebulaLayer />
      <BrandFigures />
      <LuminousCursor />
      <PortalTransition />
      <PortalAnnouncer />
    </>
  );
}
