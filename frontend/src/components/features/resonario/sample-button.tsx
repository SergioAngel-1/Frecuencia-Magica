'use client';

import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui';
import { useAudioPlayback, usePlayerStore } from '@/stores/player-store';

type SampleButtonProps = {
  audioId: string;
};

/**
 * «Escuchar muestra»: la muestra de unos segundos de la pista, por el mismo
 * canal que todo lo demás. Mientras esa muestra suena, el botón dice «Muestra»
 * y pulsarlo la pausa.
 */
export function SampleButton({ audioId }: SampleButtonProps) {
  const t = useTranslations('resonario');
  const { active, playing } = useAudioPlayback(audioId);
  const mode = usePlayerStore((state) => state.mode);
  const open = usePlayerStore((state) => state.open);
  const toggle = usePlayerStore((state) => state.toggle);

  const previewing = active && mode === 'preview';

  return (
    <Button
      variant="outline"
      onClick={() => (previewing && playing ? toggle() : open(audioId, 'preview'))}
    >
      {previewing ? t('sample.label') : t('sample.listen')}
    </Button>
  );
}
