'use client';

import { useTranslations } from 'next-intl';

import { BreathingGuide } from '@/components/features/arrival/breathing-guide';
import { Modal } from '@/components/ui';
import { useBreathingStore } from '@/stores/breathing-store';

import { BreathIcon } from './breath-icon';
import { dockSegmentClasses } from './control-dock';

/**
 * Botón del header que abre la guía de respiración en un modal. Respirar es una
 * función del sitio, no una emoción: no cambia el tema ni el sonido, sólo abre
 * la práctica cuando la persona la pide. El modal sólo monta la guía mientras
 * está abierto, así que cada vez empieza de cero.
 */
export function BreathingDialog() {
  const t = useTranslations('header');
  const open = useBreathingStore((s) => s.open);
  const show = useBreathingStore((s) => s.show);
  const hide = useBreathingStore((s) => s.hide);

  return (
    <>
      <button
        type="button"
        aria-label={t('breathe')}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={show}
        data-magnetic
        className={dockSegmentClasses()}
      >
        <BreathIcon />
      </button>

      <Modal open={open} onClose={hide} title={t('breatheTitle')} closeLabel={t('breatheClose')}>
        <div className="px-5 pt-5 pb-6">
          <BreathingGuide />
        </div>
      </Modal>
    </>
  );
}
