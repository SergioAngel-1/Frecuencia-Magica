'use client';

import { FullBleedSection } from '@/components/ui';
import { useAtmospherePainting } from '@/hooks/use-atmosphere-painting';

/**
 * Franja a sangre con el paisaje de la atmósfera elegida. En la noche no pinta
 * nada: la vista sigue como siempre.
 */
export function AtmosphereBand() {
  const { painting, scrimTone } = useAtmospherePainting();

  if (!painting) return null;

  return (
    <FullBleedSection
      media={painting}
      mode="banner"
      fade="bottom"
      scrimTone={scrimTone}
      className="mb-block"
    >
      {null}
    </FullBleedSection>
  );
}
