'use client';

import { useTranslations } from 'next-intl';

import { useAmbientStore } from '@/stores/ambient-store';

import { dockSegmentClasses } from './control-dock';

/**
 * Silencia o despierta el drone ambiental.
 *
 * Icono dibujado: un altavoz con ondas cuando suena y con una barra cruzada cuando calla. La
 * etiqueta accesible describe la acción, no el estado, y `aria-pressed` comunica el estado.
 */
export function AudioToggle() {
  const t = useTranslations('header');
  const enabled = useAmbientStore((state) => state.enabled);
  const toggle = useAmbientStore((state) => state.toggle);

  return (
    <button
      type="button"
      aria-label={enabled ? t('soundOn') : t('soundOff')}
      aria-pressed={enabled}
      onClick={toggle}
      data-magnetic
      className={dockSegmentClasses({ active: enabled })}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M4.5 9.5v5h3.2l4.3 3.6V5.9L7.7 9.5H4.5z" />
        {enabled ? (
          <>
            <path d="M15.4 9.3a3.6 3.6 0 0 1 0 5.4" />
            <path d="M17.7 7a6.8 6.8 0 0 1 0 10" />
          </>
        ) : (
          <path d="M15.6 9.6l4.4 4.8M20 9.6l-4.4 4.8" />
        )}
      </svg>
    </button>
  );
}
