'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { Button, Kicker, Modal, ThemeSwatch } from '@/components/ui';
import { ATMOSPHERE_IDS } from '@/config/atmospheres';
import { useFeelingLabel } from '@/hooks/use-feeling-label';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import type { ShiftRequest } from '@/lib/atmosphere/shift';
import { useAtmosphereShiftStore } from '@/stores/atmosphere-shift-store';

/**
 * Confirmación del cambio manual de atmósfera: enseña a dónde se va (su luz, su frase, qué
 * cambia) antes de cruzar. «Según cómo te sientes» enseña los cinco temas en fila: cada lugar
 * propone el suyo. Aceptar empieza el cruce (`AtmosphereShiftVeil`); rechazar no cambia nada.
 */
export function AtmosphereShiftConfirm() {
  const t = useTranslations('atmospheres');
  const feelingLabel = useFeelingLabel();
  const reduced = useReducedMotionSafe();
  const phase = useAtmosphereShiftStore((state) => state.phase);
  const request = useAtmosphereShiftStore((state) => state.request);
  const confirm = useAtmosphereShiftStore((state) => state.confirm);
  const cancel = useAtmosphereShiftStore((state) => state.cancel);
  // El diálogo anima su salida: el último pedido se conserva hasta que termina.
  const [shown, setShown] = useState<ShiftRequest | null>(request);

  if (request && request !== shown) setShown(request);

  const target = shown?.choice ?? null;
  const phrase = target ? t(`${target}.phrase`) : t('switcher.auto');
  const description = target ? t(`${target}.description`) : t('switcher.autoDescription');

  return (
    <Modal
      open={phase === 'confirming'}
      onClose={cancel}
      title={t('shift.title')}
      closeLabel={t('shift.close')}
    >
      {shown ? (
        <div className="flex flex-col gap-5 p-6">
          <div className="flex items-center gap-4">
            <span aria-hidden="true" className="flex shrink-0 gap-1.5">
              {(target ? [target] : ATMOSPHERE_IDS).map((id) => (
                <ThemeSwatch key={id} theme={id} size={target ? 'lg' : 'sm'} />
              ))}
            </span>
            <div className="flex flex-col gap-1">
              <Kicker tone="muted">
                {shown.feeling
                  ? t('shift.feeling', { feeling: feelingLabel(shown.feeling) })
                  : t('shift.kicker')}
              </Kicker>
              <p className="text-fg text-serif-md font-serif leading-none">{phrase}</p>
            </div>
          </div>

          <p className="text-fg-soft text-body font-sans">{description}</p>
          <p className="text-fg-meta text-meta font-sans">{t('shift.changes')}</p>

          <div className="flex flex-wrap gap-3">
            <Button variant="accent" onClick={() => confirm(reduced ? 'quick' : 'full')}>
              {target ? t(`${target}.want`) : t('shift.confirmAuto')}
            </Button>
            <Button variant="ghost" onClick={cancel}>
              {t('shift.cancel')}
            </Button>
          </div>
        </div>
      ) : null}
    </Modal>
  );
}
