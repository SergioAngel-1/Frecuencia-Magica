'use client';

import { useTranslations } from 'next-intl';

import { Button, GlassPanel, Kicker, Swap } from '@/components/ui';
import { currentAlternative, type ArrivalFlow } from '@/lib/arrival/flow';

import { BreathingGuide } from './breathing-guide';

type ArrivalPanelProps = {
  flow: ArrivalFlow;
  onStep(delta: 1 | -1): void;
  onOther(): void;
  onStop(): void;
};

/**
 * Respuesta a la llegada elegida: una frase de lo que ofrece, la alternativa en
 * curso y su recorrido, «elegir otra opción» y parar. Sin entrada no pinta nada.
 * La práctica de respiración aparece debajo cuando la entrada la trae.
 */
export function ArrivalPanel({ flow, onStep, onOther, onStop }: ArrivalPanelProps) {
  const t = useTranslations('arrival');
  const tResonario = useTranslations('resonario');
  const tAtmospheres = useTranslations('atmospheres');

  const response = flow.response;
  if (!response) return null;

  const audio = currentAlternative(flow);
  const count = response.alternatives.length;

  return (
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
                {tResonario(`kinds.${audio.kind}.title` as 'kinds.melody.title')}
              </p>
              <p className="text-fg font-serif text-[clamp(20px,2.4vw,24px)] leading-tight">
                {tResonario(`audios.${audio.id}.title` as 'audios.a1.title')}
              </p>
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
        {flow.atmosphere ? (
          <p className="text-fg-meta text-meta tracking-ui font-sans">
            {tAtmospheres(`${flow.atmosphere}.name`)}
          </p>
        ) : null}
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
  );
}
