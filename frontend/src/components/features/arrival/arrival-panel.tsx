'use client';

import { useTranslations } from 'next-intl';

import { Button, GlassPanel, Kicker, Swap } from '@/components/ui';
import { arrivalAnnouncement } from '@/lib/arrival/announce';
import { currentAlternative, type ArrivalFlow } from '@/lib/arrival/flow';
import type { AtmosphereId } from '@/types/atmosphere';

import { ArrivalReveal } from './arrival-reveal';
import { BreathingGuide } from './breathing-guide';

type ArrivalPanelProps = {
  flow: ArrivalFlow;
  /** La atmósfera activa, la que nombra el panel. */
  atmosphere: AtmosphereId;
  onStep(delta: 1 | -1): void;
  onOther(): void;
  onStop(): void;
};

/**
 * Respuesta a la llegada elegida: una frase de lo que ofrece, la alternativa en
 * curso y su recorrido, «elegir otra opción» y parar. La práctica de respiración
 * aparece debajo cuando la entrada la trae.
 *
 * La región `role="status"` va siempre montada, con o sin respuesta: un lector
 * de pantalla sólo anuncia lo que cambia dentro de una región que ya existía.
 * Por eso el componente nunca se desmonta; sin entrada sólo queda esa región.
 */
export function ArrivalPanel({ flow, atmosphere, onStep, onOther, onStop }: ArrivalPanelProps) {
  const t = useTranslations('arrival');
  const tResonario = useTranslations('resonario');
  const tAtmospheres = useTranslations('atmospheres');

  const response = flow.response;
  const audio = currentAlternative(flow);
  const count = response?.alternatives.length ?? 0;

  const announcement = response
    ? arrivalAnnouncement({
        explanation: t(response.explanationKey),
        ...(audio
          ? {
              kind: tResonario(`kinds.${audio.kind}.title`),
              title: tResonario(`audios.${audio.id}.title`),
              position: t('position', { current: flow.index + 1, total: count }),
            }
          : {}),
      })
    : '';

  return (
    <div className="flex w-full flex-col items-center">
      <p role="status" aria-live="polite" className="sr-only">
        {announcement}
      </p>

      <ArrivalReveal open={Boolean(response)}>
        {response ? (
          <div className="flex w-full justify-center pt-6">
            <GlassPanel className="w-full max-w-[640px] p-5 text-center sm:p-7">
              <Swap id={`explanation-${flow.key}`}>
                <p className="text-fg-body text-lead leading-[1.7]">{t(response.explanationKey)}</p>
              </Swap>

              {audio ? (
                <div className="mt-6 flex flex-col items-center gap-3">
                  <Kicker tone="teal" spacing="wide">
                    {t('listenKind')}
                  </Kicker>
                  <Swap id={`alternative-${flow.key}-${flow.index}`}>
                    <div className="flex flex-col items-center gap-1">
                      <p className="text-fg-meta text-label tracking-label font-sans uppercase">
                        {tResonario(`kinds.${audio.kind}.title`)}
                      </p>
                      <p className="text-fg font-serif text-[clamp(20px,2.4vw,24px)] leading-tight">
                        {tResonario(`audios.${audio.id}.title`)}
                      </p>
                      {audio.headphones ? (
                        <p className="text-fg-meta text-meta tracking-ui font-sans">
                          {t('headphones')}
                        </p>
                      ) : null}
                    </div>
                  </Swap>
                  {count > 1 ? (
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" onClick={() => onStep(-1)}>
                        {t('previous')}
                      </Button>
                      <p className="text-fg-meta text-meta tracking-ui font-sans">
                        {t('position', { current: flow.index + 1, total: count })}
                      </p>
                      <Button variant="ghost" onClick={() => onStep(1)}>
                        {t('next')}
                      </Button>
                    </div>
                  ) : null}
                </div>
              ) : null}

              {response.practice === 'breathing' ? (
                <div className="mt-8">
                  <BreathingGuide />
                </div>
              ) : null}

              <div className="mt-7 flex flex-col items-center gap-3">
                <p className="text-fg-meta text-meta tracking-ui font-sans">
                  {tAtmospheres(`${atmosphere}.name`)}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Button variant="outline" onClick={onOther}>
                    {t('otherOption')}
                  </Button>
                  <Button variant="ghost" onClick={onStop}>
                    {t('stop')}
                  </Button>
                </div>
              </div>
            </GlassPanel>
          </div>
        ) : null}
      </ArrivalReveal>
    </div>
  );
}
