'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { BreathingGuide } from '@/components/features/arrival/breathing-guide';
import { Modal } from '@/components/ui';

import { dockSegmentClasses } from './control-dock';

/**
 * Botón del header que abre la guía de respiración en un modal. Respirar es una
 * función del sitio, no una emoción: no cambia el tema ni el sonido, sólo abre
 * la práctica cuando la persona la pide. El modal sólo monta la guía mientras
 * está abierto, así que cada vez empieza de cero.
 */
export function BreathingDialog() {
  const t = useTranslations('header');
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label={t('breathe')}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        data-magnetic
        className={dockSegmentClasses()}
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
          <circle cx="12" cy="12" r="7.5" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={t('breatheTitle')}
        closeLabel={t('breatheClose')}
      >
        <div className="px-5 pt-5 pb-6">
          <BreathingGuide />
        </div>
      </Modal>
    </>
  );
}
