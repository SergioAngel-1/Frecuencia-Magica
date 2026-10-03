'use client';

import { getRealm, type VisualMode } from '@/config/realms';
import { useAmbientAudio } from '@/hooks/use-ambient-audio';
import { useRealm } from '@/hooks/use-realm';

import { BrandFigures } from './brand-figures';
import { CosmicCanvas } from './cosmic-canvas';
import { LuminousCursor } from './luminous-cursor';
import { NebulaLayer } from './nebula-layer';
import { PortalAnnouncer, PortalTransition } from './portal-transition';

type WorldEngineProps = {
  /** Override the realm's atmosphere for a composed scene. */
  visualMode?: VisualMode;
};

/**
 * Motor del mundo: todas las capas inmersivas montadas una sola vez. Sobrevive
 * a los cambios de ruta y se recolorea por contexto de realm. Cualquier página
 * vacía ya se ve como Frecuencia Mágica gracias a esto.
 */
export function WorldEngine({ visualMode }: WorldEngineProps = {}) {
  useAmbientAudio();
  const { realmId } = useRealm();
  const activeVisualMode = visualMode ?? getRealm(realmId).visualMode ?? 'cosmic';

  return (
    <>
      <CosmicCanvas visualMode={activeVisualMode} />
      <NebulaLayer visualMode={activeVisualMode} />
      <BrandFigures visualMode={activeVisualMode} />
      <LuminousCursor />
      <PortalTransition />
      <PortalAnnouncer />
    </>
  );
}

export type { WorldEngineProps };
