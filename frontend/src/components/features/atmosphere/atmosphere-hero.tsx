'use client';

import type { EditorialMedia } from '@/types/editorial-media';
import { RealmHero } from '@/components/layout/realm-hero';
import { useAtmospherePainting } from '@/hooks/use-atmosphere-painting';

export interface AtmosphereHeroProps {
  /** Héroe de la noche: lo que se ve sin atmósfera elegida. */
  base: EditorialMedia;
  kicker: string;
  title: string;
  description: string;
}

/**
 * Héroe de Resonario: con la noche, su propio héroe; con una atmósfera clara u
 * oscura elegida a mano, el paisaje de esa atmósfera a protagonismo.
 */
export function AtmosphereHero({ base, kicker, title, description }: AtmosphereHeroProps) {
  const { painting, scrimTone } = useAtmospherePainting();

  return (
    <RealmHero
      media={painting ?? base}
      kicker={kicker}
      title={title}
      description={description}
      scrimTone={scrimTone}
    />
  );
}
