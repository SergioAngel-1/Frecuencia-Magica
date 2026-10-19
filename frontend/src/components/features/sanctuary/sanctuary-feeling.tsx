'use client';

import { useTranslations } from 'next-intl';

import { Kicker } from '@/components/ui';
import { useAtmosphere } from '@/hooks/use-atmosphere';
import { useFeelingLabel } from '@/hooks/use-feeling-label';
import { useMounted } from '@/hooks/use-mounted';
import { activeFeeling } from '@/lib/atmosphere/shift';
import { useArrivalStore } from '@/stores/arrival-store';

/**
 * Nombra el estado del ánimo con el que se llegó, si el tema visible sigue
 * siendo el que ese estado propone. Antes de montar no pinta nada: la llegada
 * se rehidrata de `localStorage` y el servidor no la conoce.
 */
export function SanctuaryFeeling() {
  const mounted = useMounted();
  const { atmosphereId } = useAtmosphere();
  const savedKey = useArrivalStore((state) => state.key);
  const feelingLabel = useFeelingLabel();
  const t = useTranslations('sanctuary');
  const tAtmospheres = useTranslations('atmospheres');

  const feeling = mounted ? activeFeeling(atmosphereId, savedKey) : null;

  if (feeling === null) return null;

  return (
    <Kicker tone="muted" spacing="tight" className="animate-fm-fade-up mt-4">
      {t('feeling', {
        feeling: feelingLabel(feeling),
        atmosphere: tAtmospheres(`${atmosphereId}.name`),
      })}
    </Kicker>
  );
}
