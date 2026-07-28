'use client';

import { useTranslations } from 'next-intl';

import { IconButton } from '@/components/ui';
import { useAmbientStore } from '@/stores/ambient-store';

/**
 * Silencia o despierta el drone ambiental.
 *
 * Los glifos son notación musical, no iconos de interfaz: ♪ suena, 𝄽 es un
 * silencio. La etiqueta accesible describe la acción, no el estado, y
 * `aria-pressed` comunica el estado.
 */
export function AudioToggle() {
  const t = useTranslations('header');
  const enabled = useAmbientStore((state) => state.enabled);
  const toggle = useAmbientStore((state) => state.toggle);

  return (
    <IconButton
      label={enabled ? t('soundOn') : t('soundOff')}
      aria-pressed={enabled}
      onClick={toggle}
      active={enabled}
      className="pointer-events-auto"
    >
      <span className="font-sans text-[11px] tracking-[.1em]">{enabled ? '♪' : '𝄽'}</span>
    </IconButton>
  );
}
