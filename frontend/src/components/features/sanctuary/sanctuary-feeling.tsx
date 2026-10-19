'use client';

import { useTranslations } from 'next-intl';

import { Kicker } from '@/components/ui';
import { useFeelingLabel } from '@/hooks/use-feeling-label';
import { useMounted } from '@/hooks/use-mounted';
import { activeFeeling } from '@/lib/atmosphere/shift';
import { useAtmosphereStore } from '@/stores/atmosphere-store';

/**
 * Nombra la emoción con la que se eligió el tema, si el tema visible sigue
 * siendo el que esa emoción propone. Antes de montar no pinta nada: la
 * elección se rehidrata de `localStorage` y el servidor no la conoce.
 */
export function SanctuaryFeeling() {
  const mounted = useMounted();
  const choice = useAtmosphereStore((state) => state.choice);
  const savedFeeling = useAtmosphereStore((state) => state.feeling);
  const feelingLabel = useFeelingLabel();
  const t = useTranslations('sanctuary');

  const feeling = mounted ? activeFeeling(choice, savedFeeling) : null;

  if (feeling === null) return null;

  return (
    <Kicker tone="muted" spacing="tight" className="animate-fm-fade-up mt-4">
      {t('feeling', { feeling: feelingLabel(feeling) })}
    </Kicker>
  );
}
